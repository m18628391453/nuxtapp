# 如何从头创建一个最新的 Nuxt 项目。

## 1. 环境准备

确保你的 Node.js 版本满足要求（Nuxt 4 要求 Node.js 18.20+ 或 20.12+）：

```bash
node --version
# 建议使用 v20.12.0 或更高版本
```

## 2. 创建新项目

使用官方初始化命令：

```bash
# 使用 npx
npx nuxi@latest init nuxt-app

# 或使用 pnpm（推荐）
pnpm dlx nuxi@latest init nuxt-app

# 或使用 bun
bunx nuxi@latest init nuxt-app
```

## 3. 启用 Nuxt 4 特性

进入项目目录并修改 `nuxt.config.ts`：

```bash
cd nuxt-app
```

编辑 `nuxt.config.ts`：

```typescript
export default defineNuxtConfig({
  // 启用 Nuxt 4 特性
  future: {
    compatibilityVersion: 4,
  },
  
  // Nuxt 4 的默认配置
  ssr: true,
  devtools: { enabled: true },
  
  // 可选：更严格的类型检查
  typescript: {
    strict: true,
  },
  
  // Nuxt 4 中 app 配置的变化
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
})
```

## 4. 更新 package.json

确保使用最新的 Nuxt 版本：

```json
{
  "name": "nuxt-app",
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "nuxt": "^3.13.0"  // Nuxt 4 基于 Nuxt 3，使用最新版本
  },
  "devDependencies": {
    "@nuxt/devtools": "latest"
  }
}
```

## 5. 安装依赖

```bash
pnpm install
```

## 6. 配置 TypeScript（可选但推荐）

创建 `tsconfig.json`（Nuxt 会自动生成，但可以自定义）：

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "types": ["node"]
  }
}
```

## 7. 创建基础目录结构

```bash
mkdir -p pages components layouts composables utils server/api server/routes public
```

基础目录结构：
```
app/
├── pages/
│   └── index.vue
├── components/
├── layouts/
│   └── default.vue
├── composables/
├── utils/
├── server/
│   └── api/
├── public/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── app.vue
```

## 8. 创建基础页面文件

**app.vue**（根组件）：
```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

**layouts/default.vue**：
```vue
<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">首页</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>Nuxt 4 项目</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  padding: 1rem;
  background: #f5f5f5;
}
main {
  min-height: 80vh;
  padding: 2rem;
}
footer {
  padding: 1rem;
  text-align: center;
  background: #f5f5f5;
}
</style>
```

**pages/index.vue**：
```vue
<template>
  <div>
    <h1>欢迎使用 Nuxt 4</h1>
    <p>这是一个最新的 Nuxt 4 项目</p>
    <button @click="increment">
      计数: {{ count }}
    </button>
  </div>
</template>

<script setup>
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
h1 {
  color: #00dc82;
}
</style>
```

## 9. 运行开发服务器

```bash
# 开发模式
pnpm run dev

# 或
npm run dev
```

访问 `http://localhost:3000`

## 10. Nuxt 4 主要变化和新特性

如果你想体验更多 Nuxt 4 特性，可以添加：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  
  // 新的默认值
  ssr: true,
  nitro: {
    preset: 'node-server',  // Nuxt 4 默认使用 node-server
  },
  
  // 实验性功能
  experimental: {
    typedPages: true,      // 类型安全的路由
    componentIslands: true, // 组件岛屿
    viewTransition: true,   // 视图过渡 API
  },
  
  // 路由规则
  routeRules: {
    '/': { prerender: true },
    '/api/**': { cors: true },
  },
})
```

## 11. 添加常用模块（可选）

```bash
# 安装常用模块
pnpm add -D @nuxt/image @nuxtjs/tailwindcss @pinia/nuxt @nuxtjs/i18n
```

配置模块：
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],
  
  // Pinia 配置
  pinia: {
    storesDirs: ['./stores/**'],
  },
  
  // i18n 配置
  i18n: {
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
  },
})
```

## 注意事项

1. **Nuxt 4 目前还在开发阶段**，建议在生产环境使用前查看官方文档的最新状态
2. **破坏性变化**：查看[官方迁移指南](https://nuxt.com/docs/getting-started/upgrade#nuxt-4)了解从 Nuxt 3 迁移的变化
3. **依赖版本**：确保所有模块都支持 Nuxt 4
4. **TypeScript**：推荐开启严格模式以获得更好的类型提示

现在你已经有了一完整的 Nuxt 4 项目！🚀