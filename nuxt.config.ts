export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@ant-design-vue/nuxt'
  ],
  css: ['~/assets/css/global.css'],
  app: {
    head: {
      title: '综合能碳管理平台',  // 全局默认标题
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }  // favicon 放在 public 目录
      ],
      meta: [
        { name: 'description', content: '智慧能源管理系统' }
      ]
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true, // 启用 Less JS 特性（避免解析报错）
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue-echarts',
        'echarts', // 确保包含完整 echarts
      ]
    }
  },
  // 配置根路径对应页面
  hooks: {
    'pages:extend': (pages) => {
      const overviewPage = pages.find(p => p.name === 'dashboard-overview')
      if (overviewPage) {
        pages.unshift({
          name: 'index',
          path: '/',
          file: overviewPage.file,
          meta: overviewPage.meta
        })
      }
    }
  }
})