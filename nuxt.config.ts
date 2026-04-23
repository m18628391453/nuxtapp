import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  pages: true,
  srcDir: 'app/',
  devServer: {
    port: 4022,
    host: '0.0.0.0'
  },
  runtimeConfig: {
    apiSecret: '',
    public: {
      baseURL: 'http://localhost:4022/api'
    }
  },
  devtools: { enabled: false }, 
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxtjs/tailwindcss',
    '@ant-design-vue/nuxt',
    '@vercel/analytics'
  ],
  css: [
    '~/assets/css/global.css',
  ],
  app: {
    head: {
      title: '综合能碳管理平台',  // 全局默认标题
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
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
          javascriptEnabled: true,
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue-echarts',
        'echarts',
        'dayjs',
        'dayjs/plugin/weekday',
        'dayjs/plugin/localeData',
        'dayjs/plugin/weekOfYear',
        'dayjs/plugin/weekYear',
        'dayjs/plugin/quarterOfYear',
        'dayjs/plugin/advancedFormat',
        'dayjs/plugin/customParseFormat',
        'lucide-vue-next',
        'dayjs/esm/locale/zh-cn',
        'axios',
        'vue-router',
        'ant-design-vue/es',
      ]
    }
  },
  // 配置根路径对应页面
  hooks: {
    'pages:extend': (pages) => {
      // 配置默认首页
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