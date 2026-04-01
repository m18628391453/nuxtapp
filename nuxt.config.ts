export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
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
    optimizeDeps: {
      include: [
        'vue-echarts',
        'echarts', // 确保包含完整 echarts
      ]
    }
  }
})