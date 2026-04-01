export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    optimizeDeps: {
      include: [
        'vue-echarts',
        'echarts', // 确保包含完整 echarts
      ]
    }
  }
})