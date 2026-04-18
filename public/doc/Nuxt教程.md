# 《Nuxt极速入门》

# 第一讲：5分钟搞定Nuxt项目搭建（从0到能跑）

咱先把基础架子立起来，就像包饺子先和面、备馅一样，简单得很～

#### 1. 先查环境（Nuxt4有小要求）

打开你电脑上的“终端”（就是那个黑框框，别害怕～），敲一行命令看看Node.js版本：

```bash
node --version
```

Nuxt4要求Node.js得是 `18.20+` 或 `20.12+`，建议直接用20.12.0以上版本，要是版本不够，去Node官网更一下就行，点几下鼠标的事儿～

#### 2. 一键创建项目（选一个顺手的命令敲）

推荐用pnpm（快、省空间），你也可以用npx/bun，效果都一样：

```bash
# 推荐：pnpm（先装pnpm的话，终端敲 npm i -g pnpm）
pnpm dlx nuxi@latest init nuxt-app
# 或者用npx
npx nuxi@latest init nuxt-app
# 或者用bun
bunx nuxi@latest init nuxt-app
```

这里的`nuxt-app`是项目名，你想叫啥改啥，比如`my-nuxt-demo`、`nuxt-learn`都成～

#### 3. 配置Nuxt4特性（就改一个文件）

先进入项目文件夹（终端里敲）：

```bash
cd nuxt-app
```

然后找到项目里的`nuxt.config.ts`文件（这是Nuxt的“总配置开关”），打开它，把下面代码贴进去（覆盖原来的）：

```typescript
export default defineNuxtConfig({
  // 启用Nuxt4特性（核心）
  future: {
    compatibilityVersion: 4,
  },
  // 默认开SSR，开发工具也打开（方便咱调试）
  ssr: true,
  devtools: { enabled: true },
  // 可选：TypeScript严格模式（写代码少出错）
  typescript: {
    strict: true,
  },
  // 页面基础配置（适配手机、字符集）
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
})
```

#### 4. 装依赖+启动项目（最后两步）

终端里敲命令装依赖：

```bash
pnpm install
```

等它装完，再敲命令启动开发服务器：

```bash
pnpm run dev
```

然后打开浏览器，输入`http://localhost:3000`，能看到页面就说明咱搭成了！是不是超简单～

#### 5. 认认Nuxt的“家当”——标准目录结构

项目搭好后，里面一堆文件夹/文件，咱得知道每个是干啥的，别用的时候找不着北～现在给你列**核心目录**，记不住没关系，用的时候翻就行：

```
app/          # 项目根目录
├── pages/         # 【重点】页面文件夹！放页面组件，自动生成路由（比如index.vue=首页）
├── components/    # 组件文件夹！放可复用的小部件（比如按钮、卡片、导航栏）
├── layouts/       # 布局文件夹！控制页面整体框架（比如页眉、页脚、侧边栏）
├── composables/   # 组合式函数！放可复用的逻辑（比如计数、表单验证）
├── utils/         # 工具函数！放通用工具（比如时间格式化、数据过滤）
├── server/        # 服务端文件夹！Nuxt自带的后端
│   └── api/       # 【重点】API接口！访问/api/xxx就能调（不用额外搭后端）
├── public/        # 静态资源！放图片、字体、视频（直接能访问，比如public/logo.png）
├── nuxt.config.ts # 核心配置文件（咱刚才改的那个）
├── package.json   # 项目依赖/脚本配置（比如dev/build命令在这）
├── tsconfig.json  # TypeScript配置（可选，开严格模式更规范）
└── app.vue        # 根组件！所有页面都包裹在这（相当于项目的“入口外壳”）
```

简单记口诀：

- 写页面 → 找pages
- 写小部件 → 找components
- 定页面框架 → 找layouts
- 写通用逻辑 → 找composables/utils
- 写接口 → 找server/api
- 放图片 → 找public

#### 小结

咱今天先把项目搭起来，认了认核心目录，下一次跟你讲：

1. 咋新增页面、组件、布局（比如加个“关于页”、加个“搜索组件”）
2. 咋配置HTTP请求工具（比如axios）

# 第二讲：页面·组件·布局·路由跳转（极速上手）

## 一、新增页面（约定式路由，零配置！）

Nuxt最省心的就是**pages目录自动生成路由**，不用写路由配置表，**建文件=有路由**，现在给你讲3种最常用的页面创建方式：

### 1. 普通页面

直接在`pages`文件夹新建`.vue`文件，**文件名就是路由地址**：

- `pages/index.vue` → 首页 `/`
- `pages/about.vue` → 关于页 `/about`
- `pages/contact.vue` → 联系页 `/contact`

**示例：新建关于页 `pages/about.vue`**

```vue
<template>
  <div>
    <h1>关于我们</h1>
    <p>这是《Nuxt极速入门》教程页</p>
  </div>
</template>
```

保存后直接访问 `http://localhost:3000/about`，页面立刻生效！

### 2. 多级嵌套页面

建文件夹就能做多级路由，比如新闻模块：

- `pages/news/list.vue` → `/news/list`
- `pages/news/detail.vue` → `/news/detail`

### 3. 动态路由（带参数）

文件名用`[参数名].vue`，适配文章/用户详情页：

- `pages/article/[id].vue` → `/article/1`、`/article/100`

**获取动态参数**：

```vue
<script setup>
// 直接拿路由参数
const route = useRoute()
const articleId = route.params.id
</script>
```

## 二、新增组件（自动注册，不用导入！）

组件放在`components`文件夹，**Nuxt自动全局注册**，写组件名直接用，不用写`import`！

### 1. 新建通用组件

比如做一个按钮组件：`components/MyButton.vue`

```vue
<template>
  <button class="btn" @click="$emit('click')">
    <slot />
  </button>
</template>
<style scoped>
.btn {
  padding: 6px 12px;
  background: #00dc82;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 2. 页面直接使用

在任意页面直接写组件名，无需导入：

```vue
<template>
  <div>
    <h1>首页</h1>
    <!-- 直接用组件 -->
    <MyButton>点击测试</MyButton>
  </div>
</template>
```

## 三、新增布局（统一页面框架，一键换皮）

布局放在`layouts`文件夹，默认用`default.vue`，想做不同页面框架（如空白页、后台页），新建布局即可。

### 1. 新建空白布局

`layouts/blank.vue`（无页眉页脚，纯内容）

```vue
<template>
  <div>
    <slot />
  </div>
</template>
```

### 2. 页面指定布局

在页面里用`definePageMeta`声明用哪个布局：

```vue
<!-- pages/about.vue -->
<script setup>
// 指定使用blank空白布局
definePageMeta({
  layout: 'blank'
})
</script>
<template>
  <div>关于我们</div>
</template>
```

### 3. 根容器 app.vue

所有页面的入口，保留咱之前写的代码即可：

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

## 四、路由跳转（两种方式，全覆盖）

Nuxt跳转分**标签跳转**和**代码跳转**，日常开发全够用：

### 1. 标签跳转（NuxtLink，推荐）

前端路由无刷新，比a标签快，用于导航栏：

```vue
<template>
  <nav>
    <NuxtLink to="/">首页</NuxtLink>
    <NuxtLink to="/about">关于</NuxtLink>
    <NuxtLink to="/article/123">文章123</NuxtLink>
  </nav>
</template>
```

### 2. 编程式跳转（代码里跳）

点击按钮、请求成功后跳转，用`useRouter`：

```vue
<script setup>
const router = useRouter()

// 跳去关于页
const goToAbout = () => router.push('/about')
// 跳转动态路由
const goToArticle = () => router.push('/article/456')
</script>
<template>
  <button @click="goToAbout">跳去关于页</button>
</template>
```

### 3. 获取当前路由信息

用`useRoute`拿路径、参数：

```vue
<script setup>
const route = useRoute()
// 当前完整路径
console.log(route.fullPath)
// 动态路由参数
console.log(route.params.id)
</script>
```

#### 小结

今天咱吃透4个核心技能：

1. **加页面**：pages建文件，自动生成路由
2. **加组件**：components建组件，直接用无需导入
3. **加布局**：layouts建布局，页面指定即可生效
4. **路由跳转**：NuxtLink标签 + useRouter代码跳转

# 第三讲：全局CSS + TailwindCSS + 全局请求工具 + server/api 接口（极速配置）

## 一、配置全局CSS（全站生效，不用每个页面引）

### 1. 先建全局样式文件

在项目根目录新建：  
`assets/css/global.css`

写点通用样式：

```css
/* 全局重置 + 通用样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f9f9f9;
}

/* 全局通用类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
```

### 2. 在 nuxt.config.ts 引入

```typescript
export default defineNuxtConfig({
  css: [
    // 引入全局CSS
    '~/assets/css/global.css'
  ]
})
```

✅ 保存后，**全站立刻生效**，不用再单独引入！

## 二、一键配置 TailwindCSS（最流行样式库）

### 1. 安装依赖

```bash
pnpm add -D @nuxtjs/tailwindcss
```

### 2. 在 nuxt.config.ts 注册模块

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss' // 加上这一行
  ]
})
```

### 3. 自动生成配置（不用手动建文件）

运行 dev 就会自动生成：`tailwind.config.js`

### 4. 直接用（示例）

```vue
<template>
  <div class="mt-10 text-center">
    <h1 class="text-3xl text-green-500 font-bold">Hello Tailwind</h1>
  </div>
</template>
```

✅ 完事！不用配 PostCSS、不用引 css，Nuxt 全帮你弄好。

## 三、配置 HTTP 请求工具库（useFetch + 封装 axios）

Nuxt 自带 **useFetch / useAsyncData**，足够 90% 场景；现在再给你封装一套**通用请求函数**，一劳永逸。

### 1.  composables/useRequest.ts（自动全局可用）

```typescript
// 通用请求封装
export const useRequest = async (url: string, options = {}) => {
  const config = useRuntimeConfig()

  const { data, error } = await useFetch(url, {
    baseURL: config.public.apiBase,
    ...options
  })

  if (error.value) {
    console.error('请求失败：', error.value)
    throw new Error(error.value?.message || '请求出错')
  }

  return data.value
}
```

### 2. 在 nuxt.config.ts 配置接口地址

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000' // 你的接口地址
    }
  }
})
```

### 3. 页面直接用（不用导入）

```vue
<script setup>
// 直接调用
const list = await useRequest('/api/list')
</script>
```

## 四、配置 server/api 接口（Nuxt 自带后端，零部署）

### 1. 新建接口文件

`server/api/hello.get.ts`

```typescript
export default defineEventHandler(() => {
  return {
    code: 200,
    message: 'Nuxt接口成功啦！',
    data: 'Hello Nuxt Server'
  }
})
```

### 2. 访问地址

`/api/hello` 直接调用

### 3. 带参数的接口

`server/api/user/[id].get.ts`

```typescript
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return {
    userId: id,
    name: 'Nuxt'
  }
})
```

访问：`/api/user/123`

#### 小结

- 全局 CSS → 丢 assets/css，在 config 里引
- Tailwind → 装模块、加一行，直接用
- HTTP 请求 → 丢 composables，全局自动用
- server/api → 建文件就是接口，不用配路由

# 第四讲：Pinia全局状态 + 图片优化 + 打包部署 + 项目规范

## 一、Pinia 状态管理（全局数据共享，必学）

Nuxt里用Pinia最省心，**自动导入、自动持久化、支持SSR**。

### 1. 安装

```bash
pnpm add -D @pinia/nuxt pinia
```

### 2. 在 nuxt.config.ts 注册

```typescript
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt' // 加上这行
  ],
  pinia: {
    storesDirs: ['./stores/**'] // 自动扫描stores目录
  }
})
```

### 3. 新建状态仓库

新建 `stores/user.ts`

```typescript
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    nickname: '访客',
    age: 0
  }),

  actions: {
    // 登录
    login(data) {
      this.token = data.token
      this.nickname = data.nickname
    },
    // 登出
    logout() {
      this.$reset()
    }
  },

  // 持久化（可选）
  persist: {
    storage: persistedState.cookies
  }
})
```

### 4. 页面里直接用（不用导入）

```vue
<script setup>
const userStore = useUserStore()
</script>

<template>
  <div>
    <p>用户名：{{ userStore.nickname }}</p>
    <button @click="userStore.login({ nickname: 'Nux' })">
      登录
    </button>
  </div>
</template>
```

## 二、图片优化 @nuxt/image（自动压缩、懒加载）

### 1. 安装

```bash
pnpm add -D @nuxt/image
```

### 2. 配置

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/image']
})
```

### 3. 使用（替换img标签）

```vue
<template>
  <!-- 本地图片 -->
  <NuxtImg src="/logo.png" alt="logo" width="200" />

  <!-- 网络图片 -->
  <NuxtImg
    src="https://xxx.png"
    alt="图片"
    width="600"
    height="400"
    loading="lazy"
  />
</template>
```

✅ 自动 WebP、懒加载、适配屏幕、不拉伸

## 三、打包部署（3种模式，全覆盖）

### 1. 开发模式（本地写代码）

```bash
pnpm dev
```

### 2. 生产构建（Node服务部署，SSR）

```bash
pnpm build
```

生成 `.output` 目录，丢服务器运行：

```bash
node .output/server/index.mjs
```

### 3. 纯静态部署（无服务器，放CDN/OSS/GitHub Pages）

```bash
pnpm generate
```

生成 `.output/public`，直接上传静态托管。

### 4. 预览构建结果

```bash
pnpm preview
```

## 四、项目规范

### 1. 目录规范（必守）

- pages/ → 页面
- components/ → 组件
- layouts/ → 布局
- composables/ → 全局函数
- stores/ → Pinia状态
- server/api/ → 接口
- assets/css/ → 样式
- public/ → 静态资源

### 2. 命名规范

- 页面：about.vue、user/login.vue
- 组件：MyButton.vue、UserCard.vue（大驼峰）
- 接口：hello.get.ts、user.post.ts

### 3. 开发规范

- 页面用 `<script setup>`
- 状态用 Pinia
- 请求用 useRequest(composables)
- 样式优先 TailwindCSS

#### 小结

- Pinia：装模块 → 建stores → 直接用
- 图片：NuxtImg 标签一键优化
- 打包：dev/build/generate/preview
- 规范：目录不乱、命名统一、少写重复代码

# 第五讲：路由守卫·环境变量·错误处理·工具函数·完整模板

## 一、路由守卫（登录权限控制，必用）

Nuxt 用 **中间件 middleware** 做权限，不用写复杂路由配置。

### 1. 新建全局中间件

`middleware/auth.global.ts`

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  // 需要登录的页面
  const authPages = ['/user', '/order', '/cart']

  // 没登录 → 跳登录页
  if (authPages.includes(to.path) && !userStore.token) {
    return navigateTo('/login')
  }
})
```

✅ 全局自动生效，所有页面都会检查

### 2. 页面单独守卫（局部权限）

`pages/user/index.vue`

```vue
<script setup>
definePageMeta({
  middleware: ['auth']
})
</script>
```

## 二、环境变量（开发/生产两套配置，不踩坑）

### 1. 新建环境文件

根目录创建：

- `.env`（本地开发）
- `.env.production`（上线）

内容：

```env
# .env 开发
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
NUXT_PUBLIC_APP_NAME=我的Nuxt开发版

# .env.production 生产
NUXT_PUBLIC_API_BASE=https://你的域名/api
NUXT_PUBLIC_APP_NAME=我的Nuxt生产版
```

### 2. 配置读取

```typescript
// 任意页面/组件
const config = useRuntimeConfig()
console.log(config.public.apiBase)
console.log(config.public.appName)
```

## 三、接口统一错误处理（全局捕获，不用每个请求写try/catch）

### 1. 升级 useRequest  composables/useRequest.ts

```typescript
export const useRequest = async (url: string, options = {}) => {
  const config = useRuntimeConfig()
  const { data, error } = await useFetch(url, {
    baseURL: config.public.apiBase,
    ...options
  })

  if (error.value) {
    const msg = error.value?.message || '请求失败'
    // 这里可以加全局提示
    console.error(msg)
    ElMessage.error(msg) // 有UI库就用这个
    throw error.value
  }

  return data.value
}
```

### 2. 服务端接口统一返回

`server/utils/response.ts`

```typescript
export function success(data: any, msg = '成功') {
  return { code: 200, data, message: msg }
}

export function fail(msg = '失败', code = 500) {
  return { code, data: null, message: msg }
}
```

接口里直接用：

```typescript
export default defineEventHandler(() => {
  return success({ name: 'nuxt' })
})
```

## 四、常用工具函数（直接丢项目里用）

`utils/index.ts`

```typescript
// 时间格式化
export function formatTime(time) {
  return new Date(time).toLocaleString()
}

// 防抖
export function debounce(fn, delay = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 深拷贝
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
```

## 五、完整项目启动模板（直接复制新建项目）

### 1. nuxt.config.ts

```typescript
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  ssr: true,
  devtools: { enabled: true },

  css: ['~/assets/css/global.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  runtimeConfig: {
    public: {
      apiBase: '',
      appName: '',
    }
  },

  pinia: { storesDirs: ['./stores/**'] },
})
```

### 2. app.vue

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 3. 目录结构（最终版）

```
nuxt-app/
├── assets/css/global.css
├── components/
├── composables/useRequest.ts
├── layouts/default.vue
├── middleware/auth.global.ts
├── pages/index.vue、login.vue、user.vue
├── server/api/
├── stores/user.ts
├── utils/index.ts
├── .env
├── nuxt.config.ts
└── package.json
```

##### 总结

1. 第一讲：项目搭建 + 目录认识
2. 第二讲：页面·组件·布局·路由
3. 第三讲：全局CSS + Tailwind + 请求 + server/api
4. 第四讲：Pinia + 图片优化 + 打包部署
5. 第五讲：路由守卫 + 环境变量 + 错误处理 + 工具函数 + 完整模板

🎉 **学完这5讲，你已经能独立做完整的 Nuxt 上线项目啦！**