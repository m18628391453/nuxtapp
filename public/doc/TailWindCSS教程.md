# 《TailWindCSS极速入门》

## 第一部分：TailWindCSS简介与项目快速搭建
### 1.1 什么是TailWindCSS？
记住了：**TailWindCSS是一个"实用优先"的CSS框架**。它不像Bootstrap那样给你现成的按钮、卡片组件，而是给你提供了一大堆原子化的工具类（比如`text-red-500`、`flex`、`p-4`），让你直接在HTML里写样式。

**为什么要学它？**
- **开发速度极快**：不用来回切换HTML和CSS文件
- **不用想类名**：这是所有前端开发者的痛点！
- **体积极小**：生产环境会自动剔除未使用的样式
- **高度可定制**：想改什么颜色、间距、字体都很方便

### 1.2 三种快速搭建方式（从最简单到最推荐）
给你准备了三种搭建方式，你根据自己的项目情况选就行。

#### 方式一：CDN引入（5秒钟上手，适合快速原型）
这是最快的方式，不用安装任何东西，直接在HTML文件里加一行代码就行。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TailWindCSS CDN示例</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold text-blue-600 text-center mt-10">
    你好，TailWindCSS！
  </h1>
</body>
</html>
```

**优点**：零配置，立即使用
**缺点**：不能自定义配置，生产环境不推荐

#### 方式二：使用Vite创建项目（最推荐，适合正式项目）
这是现在最主流的方式，Vite和TailWindCSS是绝配，速度飞快。

**步骤：**
1. 创建Vite项目（选择Vanilla或Vue或React都可以）
```bash
# 创建Vite项目
npm create vite@latest my-tailwind-project -- --template vanilla

# 进入项目目录
cd my-tailwind-project

# 安装依赖
npm install
```

2. 安装TailWindCSS和它的依赖
```bash
npm install -D tailwindcss postcss autoprefixer
```

3. 生成配置文件
```bash
npx tailwindcss init -p
```
这会在项目根目录生成两个文件：
- `tailwind.config.js`：TailWindCSS的配置文件
- `postcss.config.js`：PostCSS的配置文件

4. 配置模板文件路径
打开`tailwind.config.js`，修改`content`数组：
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
这一步很重要！告诉TailWindCSS哪些文件里用到了它的工具类，这样生产环境才能正确摇树优化。

5. 引入TailWindCSS指令
打开`src/style.css`，清空原有内容，添加这三行：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. 启动项目
```bash
npm run dev
```
现在你就可以在项目里随便用TailWindCSS的工具类了！

#### 方式三：在现有项目中添加TailWindCSS
如果你已经有一个项目了，想加上TailWindCSS，按照方式二的第2-5步做就行，非常简单。

### 1.3 标准项目目录结构
给你一个标准的TailWindCSS项目目录结构，以后所有项目都可以这么建，清晰又好维护。

```
my-tailwind-project/
├── node_modules/          # 依赖包
├── public/                # 静态资源
│   └── favicon.ico
├── src/                   # 源代码
│   ├── assets/            # 图片、字体等资源
│   ├── components/        # 可复用组件
│   ├── pages/             # 页面文件
│   ├── styles/            # 样式文件
│   │   ├── base.css       # 基础样式（重置、全局样式）
│   │   ├── components.css # 自定义组件样式
│   │   └── utilities.css  # 自定义工具类
│   ├── main.js            # 入口文件
│   └── style.css          # 主样式文件（引入TailWind指令）
├── .gitignore             # Git忽略文件
├── index.html             # HTML入口
├── package.json           # 项目配置
├── postcss.config.js      # PostCSS配置
└── tailwind.config.js     # TailWindCSS核心配置
```

**说明：**
- `src/styles/`目录下的三个文件是可选的
- `base.css`放全局重置样式和基础标签样式
- `components.css`放你自己写的可复用组件样式（比如自定义按钮、卡片）
- `utilities.css`放你自己扩展的工具类

### 1.4 今天的小作业
今天的内容不多，但很重要。你现在就动手：
1. 用Vite创建一个新的TailWindCSS项目
2. 按照给的目录结构创建好文件夹
3. 在`index.html`里写一个简单的页面，用上至少5个不同的TailWind工具类

下次课咱们讲**第二部分：核心概念与基础样式**，包括颜色、字体、间距、边框这些最常用的样式怎么写。

需要我把今天的内容整理成一个**可直接复制的项目模板代码包**吗？


## 第二部分：TailWindCSS核心实用类（上）
### 2.1 布局类（Layout）—— 页面的骨架
布局是页面的根本，TailWind把Flex和Grid这两个现代CSS布局神器封装得特别好用。

#### 2.1.1 Flex布局（最常用）
记住这几个核心类，90%的Flex布局场景都能搞定：

| 功能 | CSS属性 | TailWind类名 | 示例 |
| :--- | :--- | :--- | :--- |
| **开启Flex** | `display: flex` | `flex` | `<div class="flex">...</div>` |
| **主轴方向** | `flex-direction` | `flex-row` (默认，横向)<br>`flex-col` (纵向) | `<div class="flex flex-col">...</div>` |
| **主轴对齐** | `justify-content` | `justify-start` (左/上)<br>`justify-center` (居中)<br>`justify-end` (右/下)<br>`justify-between` (两端对齐)<br>`justify-around` (环绕对齐) | `<div class="flex justify-center">...</div>` |
| **交叉轴对齐** | `align-items` | `items-start` (顶/左)<br>`items-center` (居中)<br>`items-end` (底/右)<br>`items-stretch` (拉伸) | `<div class="flex items-center">...</div>` |
| **元素换行** | `flex-wrap` | `flex-wrap` | `<div class="flex flex-wrap">...</div>` |

**经典组合：水平垂直居中**
```html
<div class="flex justify-center items-center h-screen">
  <div>我在屏幕正中间！</div>
</div>
```

#### 2.1.2 Grid布局（适合二维布局）
Grid适合做卡片列表、相册这种规整的布局：

| 功能 | CSS属性 | TailWind类名 | 示例 |
| :--- | :--- | :--- | :--- |
| **开启Grid** | `display: grid` | `grid` | `<div class="grid">...</div>` |
| **列数** | `grid-template-columns` | `grid-cols-n` (n为1-12)<br>`grid-cols-1fr` (等宽) | `<div class="grid grid-cols-3">...</div>` (3列) |
| **间距** | `gap` | `gap-n` (n为0-96) | `<div class="grid grid-cols-3 gap-4">...</div>` (间距1rem) |

**示例：3列卡片布局**
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="bg-white p-4 rounded-lg">卡片1</div>
  <div class="bg-white p-4 rounded-lg">卡片2</div>
  <div class="bg-white p-4 rounded-lg">卡片3</div>
</div>
```
*(注：`md:`是响应式前缀，后面讲，先记住这么用)*

### 2.2 间距类（Spacing）—— 元素的呼吸
间距包括外边距（Margin）和内边距（Padding），TailWind的间距系统非常规整。

#### 2.2.1 基本规则
- **`m-`** 开头 = Margin（外边距）
- **`p-`** 开头 = Padding（内边距）
- **方向后缀**：
  - 无后缀 = 4个方向都有
  - `t` = Top (上)，`r` = Right (右)，`b` = Bottom (下)，`l` = Left (左)
  - `x` = 左右 (X轴)，`y` = 上下 (Y轴)
- **尺寸值**：`0` (0), `1` (0.25rem), `2` (0.5rem), `4` (1rem), `6` (1.5rem), `8` (2rem), `12` (3rem), `16` (4rem), `24` (6rem), `32` (8rem), `auto` (自动)

#### 2.2.2 常用示例
```html
<!-- 内边距：上下1rem，左右2rem -->
<div class="py-4 px-8">...</div>

<!-- 外边距：底部2rem，左右自动（居中） -->
<div class="mb-8 mx-auto">...</div>

<!-- 4个方向都没有间距 -->
<div class="m-0 p-0">...</div>
```

### 2.3 颜色类（Colors）—— 页面的妆容
TailWind自带一套非常漂亮的颜色系统，从浅到深分9个等级（50, 100, 200, ..., 900, 950）。

#### 2.3.1 颜色应用场景
| 场景 | 前缀 | 示例 |
| :--- | :--- | :--- |
| **文字颜色** | `text-` | `text-gray-800` (深灰文字)<br>`text-blue-600` (蓝色文字) |
| **背景颜色** | `bg-` | `bg-white` (白色背景)<br>`bg-gray-100` (浅灰背景) |
| **边框颜色** | `border-` | `border-gray-300` (浅灰边框)<br>`border-red-500` (红色边框) |

#### 2.3.2 常用颜色速记
- 中性色：`gray` (最常用！)
- 主色：`blue`, `indigo`, `purple`
- 辅助色：`green` (成功), `yellow` (警告), `red` (错误)

**示例：一个警告卡片**
```html
<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <p class="text-yellow-800">注意：这是一条警告信息！</p>
</div>
```

### 2.4 字体类（Typography）—— 文字的气质
文字是页面的灵魂，TailWind把字体样式封装得明明白白。

#### 2.4.1 字体大小（Font Size）
| 类名 | 大小 | 适用场景 |
| :--- | :--- | :--- |
| `text-xs` | 0.75rem | 辅助说明 |
| `text-sm` | 0.875rem | 次要信息 |
| `text-base` | 1rem | 正文（默认） |
| `text-lg` | 1.125rem | 小标题 |
| `text-xl` | 1.25rem | 大标题 |
| `text-2xl` 到 `text-9xl` | 1.5rem 到 8rem | 特大标题 |

#### 2.4.2 字重（Font Weight）
| 类名 | 字重 |
| :--- | :--- |
| `font-light` | 细体 |
| `font-normal` | 正常（默认） |
| `font-medium` | 中等 |
| `font-semibold` | 半粗 |
| `font-bold` | 粗体 |

#### 2.4.3 其他常用字体类
| 功能 | 类名 |
| :--- | :--- |
| **文字对齐** | `text-left` (左)<br>`text-center` (中)<br>`text-right` (右) |
| **行高** | `leading-tight` (紧凑)<br>`leading-normal` (正常)<br>`leading-relaxed` (宽松) |
| **文字颜色** | 见上一节“颜色类” |

**示例：一段排版优美的文字**
```html
<div class="max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold text-gray-900 mb-4">文章标题</h1>
  <p class="text-gray-600 leading-relaxed mb-4">
    这是一段正文内容。使用了合适的行高（leading-relaxed），
    看起来不会太拥挤，阅读体验更好。
  </p>
  <p class="text-sm text-gray-500 text-right">
    —— 发布于 2026-04-17
  </p>
</div>
```

### 2.5 今天的小作业
今天讲的都是硬通货，你现在就动手：
1. 用昨天搭好的项目
2. 写一个**个人名片卡片**：
   - 用Flex布局让头像和名字并排
   - 加上合适的内边距（p-6）和圆角（rounded-xl）
   - 名字用 `text-xl font-bold text-gray-900`
   - 职位用 `text-gray-600`
   - 底部加一行联系方式，用 `text-sm text-blue-600`

## 第三部分：TailWindCSS核心实用类
### 3.1 边框与圆角类（Border & Radius）
边框和圆角是让页面变精致的关键，TailWind提供了非常灵活的控制。

#### 3.1.1 边框基础
| 功能 | TailWind类名 | 说明 |
| :--- | :--- | :--- |
| **开启边框** | `border` | 所有方向1px边框<br>`border-2`/`border-4`/`border-8` 指定厚度 |
| **单边边框** | `border-t`/`border-r`/`border-b`/`border-l` | 只显示某一边的边框 |
| **边框颜色** | `border-颜色-等级` | 如 `border-gray-300`、`border-blue-500` |
| **边框样式** | `border-solid` (默认)<br>`border-dashed` (虚线)<br>`border-dotted` (点线) |  |
| **移除边框** | `border-0` | 移除所有边框 |

#### 3.1.2 圆角（Rounded）
| 类名 | 效果 |
| :--- | :--- |
| `rounded-none` | 无圆角（直角） |
| `rounded-sm` | 小圆角 |
| `rounded` | 默认圆角（0.25rem） |
| `rounded-md` | 中圆角 |
| `rounded-lg` | 大圆角 |
| `rounded-xl`/`rounded-2xl`/`rounded-3xl` | 更大的圆角 |
| `rounded-full` | 圆形（宽高相等时） |
| `rounded-t-lg`/`rounded-b-lg` | 只给上边/下边加圆角 |

**示例：一个精致的按钮**
```html
<button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
  点击我
</button>
```

### 3.2 背景与阴影类（Background & Shadow）
#### 3.2.1 背景类
除了纯色背景，TailWind还支持渐变背景：

| 功能 | 类名 | 示例 |
| :--- | :--- | :--- |
| **纯色背景** | `bg-颜色-等级` | `bg-white`、`bg-gray-100` |
| **线性渐变** | `bg-gradient-to-方向` | `bg-gradient-to-r from-blue-500 to-purple-600` |
| **背景透明度** | `bg-opacity-数值` | `bg-black bg-opacity-50` (半透明黑色) |
| **背景大小** | `bg-cover` (覆盖)<br>`bg-contain` (包含) |  |
| **背景位置** | `bg-center` (居中)<br>`bg-top` (顶部) |  |

**示例：渐变背景卡片**
```html
<div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-xl text-white">
  <h3 class="text-xl font-bold mb-2">渐变背景</h3>
  <p>这是一个漂亮的渐变色卡片</p>
</div>
```

#### 3.2.2 阴影类（Shadow）
阴影能让页面有层次感，TailWind提供了从浅到深的预设阴影：

| 类名 | 效果 |
| :--- | :--- |
| `shadow-none` | 无阴影 |
| `shadow-sm` | 轻微阴影 |
| `shadow` | 默认阴影 |
| `shadow-md` | 中等阴影 |
| `shadow-lg` | 大阴影 |
| `shadow-xl`/`shadow-2xl` | 更大的阴影 |
| `shadow-inner` | 内阴影 |

**示例：带阴影的卡片**
```html
<div class="bg-white p-6 rounded-xl shadow-lg">
  <h3 class="text-xl font-bold mb-2">带阴影的卡片</h3>
  <p class="text-gray-600">阴影让卡片看起来有悬浮感</p>
</div>
```

### 3.3 尺寸类（Sizing）
控制元素的宽度和高度：

| 功能 | 类名 | 说明 |
| :--- | :--- | :--- |
| **宽度** | `w-数值` | `w-0` 到 `w-96` (0 到 24rem)<br>`w-full` = 100% 宽度<br>`w-screen` = 100vw 屏幕宽度<br>`w-auto` = 自动宽度 |
| **高度** | `h-数值` | `h-0` 到 `h-96`<br>`h-full` = 100% 高度<br>`h-screen` = 100vh 屏幕高度<br>`h-auto` = 自动高度 |
| **最大宽度** | `max-w-数值` | 非常常用！`max-w-2xl`、`max-w-7xl` 限制内容宽度 |
| **最大高度** | `max-h-数值` |  |

**最常用组合：内容居中**
```html
<div class="max-w-7xl mx-auto px-4">
  <!-- 所有页面内容都放在这里 -->
  <!-- 这样在大屏幕上内容不会太宽，阅读体验更好 -->
</div>
```

### 3.4 交互状态类（States）
这是TailWind超级好用的功能！直接在类名前加前缀就能控制元素在不同状态下的样式。

| 状态 | 前缀 | 示例 | 说明 |
| :--- | :--- | :--- | :--- |
| **悬停** | `hover:` | `hover:bg-blue-700` | 鼠标悬停时的样式 |
| **聚焦** | `focus:` | `focus:outline-none focus:ring-2` | 输入框聚焦时的样式 |
| **激活** | `active:` | `active:bg-blue-800` | 鼠标点击时的样式 |
| **禁用** | `disabled:` | `disabled:opacity-50 disabled:cursor-not-allowed` | 元素禁用时的样式 |

**示例：完整的按钮状态**
```html
<button class="bg-blue-600 text-white px-6 py-2 rounded-lg 
               hover:bg-blue-700 
               active:bg-blue-800 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               transition-colors duration-200">
  完整状态按钮
</button>
```
*(注：`transition-colors` 是过渡动画，让颜色变化更平滑)*

### 3.5 响应式设计（Responsive）
这是TailWind最强大的功能之一！**只需要在类名前加断点前缀**，就能实现响应式布局，不用写一行媒体查询！

#### 3.5.1 默认断点
TailWind有5个常用断点，覆盖了从手机到超大屏的所有设备：

| 前缀 | 屏幕宽度 | 对应设备 |
| :--- | :--- | :--- |
| 无前缀 | 所有屏幕 | 移动端优先（默认样式） |
| `sm:` | ≥ 640px | 小屏手机 |
| `md:` | ≥ 768px | 平板 |
| `lg:` | ≥ 1024px | 笔记本电脑 |
| `xl:` | ≥ 1280px | 台式电脑 |
| `2xl:` | ≥ 1536px | 超大屏 |

#### 3.5.2 响应式用法
**核心原则：移动端优先**。先写移动端的样式，然后用断点前缀覆盖大屏幕的样式。

**示例1：响应式列数**
```html
<!-- 手机：1列；平板：2列；电脑：3列；大屏：4列 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="bg-white p-4 rounded-lg shadow">卡片1</div>
  <div class="bg-white p-4 rounded-lg shadow">卡片2</div>
  <div class="bg-white p-4 rounded-lg shadow">卡片3</div>
  <div class="bg-white p-4 rounded-lg shadow">卡片4</div>
</div>
```

**示例2：响应式导航栏**
```html
<!-- 手机：纵向排列；平板及以上：横向排列 -->
<nav class="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow">
  <div class="text-xl font-bold mb-4 md:mb-0">Logo</div>
  <div class="flex space-x-6">
    <a href="#" class="text-gray-600 hover:text-blue-600">首页</a>
    <a href="#" class="text-gray-600 hover:text-blue-600">产品</a>
    <a href="#" class="text-gray-600 hover:text-blue-600">关于</a>
  </div>
</nav>
```

### 3.6 显示与隐藏类（Display）
控制元素的显示和隐藏，配合响应式前缀特别好用：

| 功能 | 类名 |
| :--- | :--- |
| **块级元素** | `block` |
| **行内元素** | `inline` |
| **行内块** | `inline-block` |
| **Flex布局** | `flex` |
| **Grid布局** | `grid` |
| **隐藏元素** | `hidden` |

**示例：移动端隐藏，电脑端显示**
```html
<!-- 手机上隐藏，lg及以上屏幕显示 -->
<div class="hidden lg:block">
  这个内容只在电脑上显示
</div>

<!-- 手机上显示，lg及以上屏幕隐藏 -->
<div class="block lg:hidden">
  这个内容只在手机上显示
</div>
```

### 3.7 今天的小作业
今天的内容有点多，但都是精华！你现在就动手，把昨天写的个人名片升级一下：
1. 给卡片加上 `shadow-lg` 阴影和 `rounded-xl` 大圆角
2. 给按钮加上 `hover:`、`active:`、`focus:` 状态
3. 让卡片在手机上占满宽度，在平板上占一半宽度，在电脑上占1/3宽度
4. 尝试给卡片加一个渐变背景

## 第四部分：样式自定义与高级用法
### 4.1 全局样式与基础层自定义
这就是你问的**如何新增全局样式**。TailWind有三层结构，我们可以在不同的层添加不同类型的样式：

```css
/* src/style.css */
@tailwind base;      /* 基础层：放全局重置、基础标签样式 */
@tailwind components;/* 组件层：放自定义组件样式 */
@tailwind utilities; /* 工具层：放自定义工具类 */
```

#### 如何添加全局样式
**方法一：在base层直接写（推荐）**
创建`src/styles/base.css`，然后在主样式文件中引入：

```css
/* src/styles/base.css */
@layer base {
  /* 全局重置 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 基础标签样式 */
  body {
    @apply bg-gray-50 text-gray-800 font-sans;
  }

  h1 {
    @apply text-3xl font-bold mb-4;
  }

  h2 {
    @apply text-2xl font-bold mb-3;
  }

  a {
    @apply text-blue-600 hover:text-blue-800 transition-colors;
  }
}
```

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/base.css';
```

**方法二：直接写在style.css末尾**
```css
/* 这种方式也可以，但优先级最高，会覆盖所有工具类 */
body {
  background-color: #f9fafb;
}
```

### 4.2 自定义主题配置（tailwind.config.js）
这是TailWind最强大的自定义功能，所有的颜色、字体、间距、断点都可以在这里改。**记住：永远用`extend`扩展，不要直接覆盖默认主题！**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    // ❌ 不要这么写！会覆盖所有默认颜色
    // colors: {
    //   primary: '#3b82f6'
    // },

    // ✅ 正确写法：扩展默认主题
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // 主色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },

      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },

      // 自定义间距
      spacing: {
        '128': '32rem',
      },

      // 自定义断点
      screens: {
        '3xl': '1920px',
      }
    },
  },
  plugins: [],
}
```

现在你就可以在项目中使用这些自定义的样式了：
```html
<button class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg">
  自定义主色按钮
</button>
```

### 4.3 自定义组件类（@apply指令）
当你发现自己在重复写同一组工具类时，就可以用`@apply`指令把它们提取成一个自定义组件类。

#### 如何使用@apply
创建`src/styles/components.css`，然后在主样式文件中引入：

```css
/* src/styles/components.css */
@layer components {
  /* 自定义按钮组件 */
  .btn {
    @apply px-6 py-2 rounded-lg font-medium transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400;
  }

  /* 自定义卡片组件 */
  .card {
    @apply bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow;
  }
}
```

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/base.css';
@import './styles/components.css';
```

现在你就可以像使用原生工具类一样使用这些自定义组件了：
```html
<div class="card">
  <h3 class="text-xl font-bold mb-4">卡片标题</h3>
  <p class="text-gray-600 mb-4">卡片内容</p>
  <button class="btn btn-primary">点击我</button>
</div>
```

**提醒**：不要滥用@apply！如果一个样式只在一个地方用，就直接写工具类。只有当你在3个以上地方重复使用同一组样式时，才考虑提取成组件类。


### 4.4 页面级样式（指定页面的样式）
这就是你问的**如何新增指定页面的样式**，有三种常用方法：

#### 方法一：给页面根元素加唯一类名（最简单，推荐）
```html
<!-- 首页 index.html -->
<body class="page-home">
  <!-- 首页内容 -->
</body>

<!-- 关于页 about.html -->
<body class="page-about">
  <!-- 关于页内容 -->
</body>
```

然后在CSS中写：
```css
@layer base {
  .page-home {
    @apply bg-gradient-to-br from-blue-50 to-indigo-100;
  }

  .page-about {
    @apply bg-gradient-to-br from-green-50 to-emerald-100;
  }

  /* 只在首页生效的h1样式 */
  .page-home h1 {
    @apply text-4xl font-extrabold text-primary-600;
  }
}
```

#### 方法二：使用CSS模块（Vue/React项目推荐）
如果是Vue或React项目，直接用框架自带的CSS模块或Scoped CSS：
```vue
<!-- Home.vue -->
<template>
  <div class="home-container">
    <h1>首页标题</h1>
  </div>
</template>

<style scoped>
/* 这个样式只在当前页面生效 */
.home-container {
  @apply bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen;
}
</style>
```

#### 方法三：单独的CSS文件
给每个页面创建一个单独的CSS文件，只在对应的页面引入：
```html
<!-- 只在首页引入 -->
<link rel="stylesheet" href="/styles/home.css">
```

### 4.5 自定义工具类
如果TailWind没有提供你需要的工具类，你可以自己扩展：

创建`src/styles/utilities.css`：
```css
/* src/styles/utilities.css */
@layer utilities {
  /* 自定义文本阴影 */
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .text-shadow-lg {
    text-shadow: 0 4px 8px rgba(0,0,0,0.25);
  }

  /* 自定义内容居中 */
  .content-auto {
    content-visibility: auto;
  }
}
```

然后在主样式文件中引入：
```css
@import './styles/utilities.css';
```

现在就可以使用了：
```html
<h1 class="text-4xl font-bold text-white text-shadow-lg">
  带阴影的标题
</h1>
```

### 4.6 三个超级好用的高级技巧
#### 技巧一：任意值语法
如果TailWind没有提供你需要的精确值，可以用方括号`[]`直接写任意值：
```html
<!-- 精确宽度250px -->
<div class="w-[250px]"></div>

<!-- 自定义颜色 -->
<div class="bg-[#ff6b6b] text-[#1a1a2e]"></div>

<!-- 自定义边距 -->
<div class="mt-[17px]"></div>

<!-- 自定义渐变 -->
<div class="bg-gradient-to-r from-[#ff6b6b] to-[#feca57]"></div>
```

#### 技巧二：重要性前缀
在类名前加`!`可以让这个样式变成`!important`，优先级最高：
```html
<!-- 这个文字一定会是红色，不管其他样式怎么写 -->
<p class="!text-red-500">重要文字</p>
```

#### 技巧三：过渡与动画
TailWind自带了常用的过渡和动画：
```html
<!-- 过渡动画 -->
<button class="transition-all duration-300 ease-in-out hover:scale-105">
  悬停放大
</button>

<!-- 预定义动画 -->
<div class="animate-spin">加载中...</div>
<div class="animate-pulse">呼吸效果</div>
<div class="animate-bounce">弹跳效果</div>
```

### 4.7 今天的小作业
今天的内容非常重要，是真正提升开发效率的关键。你现在就动手重构之前的项目：
1. 在`tailwind.config.js`中自定义一套你喜欢的主色调
2. 用`@apply`提取一个通用的按钮组件和卡片组件
3. 给首页和一个测试页面加不同的全局背景色
4. 尝试使用任意值语法和重要性前缀

## 第五部分：完整响应式官网实战
### 5.1 项目准备
首先，咱们用之前学的方法创建一个干净的TailWindCSS项目：

```bash
# 创建Vite项目
npm create vite@latest company-website -- --template vanilla

# 进入项目目录
cd company-website

# 安装依赖
npm install -D tailwindcss postcss autoprefixer

# 生成配置文件
npx tailwindcss init -p
```

然后按照咱们之前讲的标准目录结构创建文件夹，并配置好`tailwind.config.js`和`style.css`。

**最终项目结构：**
```
company-website/
├── src/
│   ├── styles/
│   │   ├── base.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── main.js
│   └── style.css
├── index.html
├── tailwind.config.js
└── postcss.config.js
```

### 5.2 第一步：配置全局样式和自定义主题
先把基础打好，配置好全局样式和自定义主题。

**1. 配置tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // 主色：天蓝色
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**2. 配置base.css（全局样式）**
```css
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-gray-50 text-gray-800 font-sans antialiased;
  }

  section {
    @apply py-16 md:py-24;
  }

  .section-title {
    @apply text-3xl md:text-4xl font-bold text-center mb-12;
  }
}
```

**3. 配置components.css（自定义组件）**
```css
@layer components {
  .btn {
    @apply px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block;
  }

  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-lg hover:shadow-xl;
  }

  .btn-secondary {
    @apply bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 active:bg-gray-100;
  }

  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

### 5.3 第二步：编写页面组件
现在咱们开始一个一个写组件，所有代码都写在`index.html`的`<body>`标签里。

#### 5.3.1 导航栏（Navbar）
这是网站最重要的组件，必须是响应式的。
```html
<!-- 导航栏 -->
<nav class="bg-white shadow-sm sticky top-0 z-50">
  <div class="container">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a href="#" class="text-2xl font-bold text-primary-600">
        TechCorp
      </a>

      <!-- 桌面端导航链接 -->
      <div class="hidden md:flex space-x-8">
        <a href="#home" class="text-gray-600 hover:text-primary-600 transition-colors">首页</a>
        <a href="#features" class="text-gray-600 hover:text-primary-600 transition-colors">特性</a>
        <a href="#products" class="text-gray-600 hover:text-primary-600 transition-colors">产品</a>
        <a href="#testimonials" class="text-gray-600 hover:text-primary-600 transition-colors">评价</a>
        <a href="#contact" class="text-gray-600 hover:text-primary-600 transition-colors">联系我们</a>
      </div>

      <!-- 联系按钮 -->
      <a href="#contact" class="btn btn-primary hidden md:block">
        立即咨询
      </a>

      <!-- 移动端菜单按钮 -->
      <button class="md:hidden text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </div>
</nav>
```

#### 5.3.2 英雄区（Hero Section）
网站的第一印象，要简洁有力。
```html
<!-- 英雄区 -->
<section id="home" class="bg-gradient-to-br from-primary-50 to-blue-100 pt-24 pb-32">
  <div class="container">
    <div class="flex flex-col lg:flex-row items-center">
      <!-- 左侧文字 -->
      <div class="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          打造下一代
          <span class="text-primary-600">数字化解决方案</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
          我们提供专业的软件开发和技术咨询服务，帮助企业实现数字化转型，提升竞争力。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a href="#contact" class="btn btn-primary text-lg">
            开始合作
          </a>
          <a href="#features" class="btn btn-secondary text-lg">
            了解更多
          </a>
        </div>
      </div>

      <!-- 右侧图片 -->
      <div class="lg:w-1/2">
        <img src="https://picsum.photos/600/400" alt="数字化解决方案" class="rounded-2xl shadow-2xl">
      </div>
    </div>
  </div>
</section>
```

#### 5.3.3 特性介绍（Features）
展示产品或服务的核心优势。
```html
<!-- 特性介绍 -->
<section id="features">
  <div class="container">
    <h2 class="section-title">我们的核心优势</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- 特性卡片1 -->
      <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">快速交付</h3>
        <p class="text-gray-600">
          采用敏捷开发方法，确保项目按时高质量交付，缩短您的上市时间。
        </p>
      </div>

      <!-- 特性卡片2 -->
      <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">安全可靠</h3>
        <p class="text-gray-600">
          严格遵循行业安全标准，采用最新的安全技术，保护您的数据安全。
        </p>
      </div>

      <!-- 特性卡片3 -->
      <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">专业团队</h3>
        <p class="text-gray-600">
          拥有经验丰富的技术团队，为您提供专业的技术支持和咨询服务。
        </p>
      </div>
    </div>
  </div>
</section>
```

#### 5.3.4 产品展示（Products）
展示公司的主要产品或服务。
```html
<!-- 产品展示 -->
<section id="products" class="bg-gray-100">
  <div class="container">
    <h2 class="section-title">我们的产品</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 产品卡片1 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <img src="https://picsum.photos/600/300?random=1" alt="企业管理系统" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-3">企业管理系统</h3>
          <p class="text-gray-600 mb-4">
            一站式企业管理解决方案，涵盖人力资源、财务管理、项目管理等多个模块。
          </p>
          <a href="#" class="text-primary-600 font-medium hover:text-primary-700">
            了解详情 →
          </a>
        </div>
      </div>

      <!-- 产品卡片2 -->
      <div class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <img src="https://picsum.photos/600/300?random=2" alt="电商平台" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-3">电商平台</h3>
          <p class="text-gray-600 mb-4">
            功能完善的电商平台系统，支持多店铺、多支付方式、订单管理等功能。
          </p>
          <a href="#" class="text-primary-600 font-medium hover:text-primary-700">
            了解详情 →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### 5.3.5 客户评价（Testimonials）
增加可信度和说服力。
```html
<!-- 客户评价 -->
<section id="testimonials">
  <div class="container">
    <h2 class="section-title">客户怎么说</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 评价卡片1 -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center mb-4">
          <img src="https://picsum.photos/64/64?random=3" alt="客户头像" class="w-12 h-12 rounded-full mr-4">
          <div>
            <h4 class="font-bold">张总</h4>
            <p class="text-sm text-gray-500">某科技公司CEO</p>
          </div>
        </div>
        <p class="text-gray-600 italic">
          "TechCorp的团队非常专业，他们帮助我们在短短3个月内完成了系统升级，大大提高了我们的工作效率。"
        </p>
      </div>

      <!-- 评价卡片2 -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center mb-4">
          <img src="https://picsum.photos/64/64?random=4" alt="客户头像" class="w-12 h-12 rounded-full mr-4">
          <div>
            <h4 class="font-bold">李经理</h4>
            <p class="text-sm text-gray-500">某电商平台运营总监</p>
          </div>
        </div>
        <p class="text-gray-600 italic">
          "他们开发的电商平台非常稳定，功能也很完善，我们的销售额在上线后增长了50%。"
        </p>
      </div>

      <!-- 评价卡片3 -->
      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center mb-4">
          <img src="https://picsum.photos/64/64?random=5" alt="客户头像" class="w-12 h-12 rounded-full mr-4">
          <div>
            <h4 class="font-bold">王老师</h4>
            <p class="text-sm text-gray-500">某教育机构负责人</p>
          </div>
        </div>
        <p class="text-gray-600 italic">
          "售后服务非常好，遇到问题总能及时解决，是值得信赖的合作伙伴。"
        </p>
      </div>
    </div>
  </div>
</section>
```

#### 5.3.6 联系表单（Contact）
让潜在客户能够轻松联系到你。
```html
<!-- 联系我们 -->
<section id="contact" class="bg-primary-50">
  <div class="container">
    <div class="max-w-2xl mx-auto">
      <h2 class="section-title">联系我们</h2>
      <p class="text-center text-gray-600 mb-8">
        有任何问题或合作意向，请填写下面的表单，我们会尽快与您联系。
      </p>
      
      <form class="bg-white p-8 rounded-xl shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-gray-700 font-medium mb-2">姓名</label>
            <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">电话</label>
            <input type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">邮箱</label>
          <input type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2">留言</label>
          <textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
        </div>
        
        <button type="submit" class="btn btn-primary w-full">
          提交留言
        </button>
      </form>
    </div>
  </div>
</section>
```

#### 5.3.7 页脚（Footer）
网站的底部信息。
```html
<!-- 页脚 -->
<footer class="bg-gray-900 text-white py-12">
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <!-- 公司信息 -->
      <div>
        <h3 class="text-xl font-bold mb-4">TechCorp</h3>
        <p class="text-gray-400">
          专注于数字化解决方案，帮助企业实现数字化转型。
        </p>
      </div>

      <!-- 快速链接 -->
      <div>
        <h4 class="font-bold mb-4">快速链接</h4>
        <ul class="space-y-2 text-gray-400">
          <li><a href="#home" class="hover:text-white transition-colors">首页</a></li>
          <li><a href="#features" class="hover:text-white transition-colors">特性</a></li>
          <li><a href="#products" class="hover:text-white transition-colors">产品</a></li>
          <li><a href="#contact" class="hover:text-white transition-colors">联系我们</a></li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div>
        <h4 class="font-bold mb-4">联系方式</h4>
        <ul class="space-y-2 text-gray-400">
          <li>电话：400-123-4567</li>
          <li>邮箱：contact@techcorp.com</li>
          <li>地址：北京市朝阳区科技路100号</li>
        </ul>
      </div>

      <!-- 社交媒体 -->
      <div>
        <h4 class="font-bold mb-4">关注我们</h4>
        <div class="flex space-x-4">
          <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
      <p>&copy; 2026 TechCorp. 保留所有权利。</p>
    </div>
  </div>
</footer>
```

### 5.4 第三步：运行项目
现在所有组件都写完了，运行项目看看效果：
```bash
npm run dev
```

打开浏览器访问`http://localhost:5173`，你就能看到一个完整、美观、响应式的企业官网了！


### 5.5 今天的小作业
乖孙儿，恭喜你！你已经用TailWindCSS写出了一个完整的网站。现在你可以：
1. 把网站里的文字和图片换成你自己的内容
2. 尝试修改颜色和字体，打造属于你自己的风格
3. 添加一个移动端的汉堡菜单功能
4. 给表单加上简单的验证