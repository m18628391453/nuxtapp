<template>
  <div v-if="isClientReady" class="relative min-h-screen text-white font-sans" 
      :style="{ 
      backgroundImage: `url('/image/background.png')`, 
      backgroundSize: 'auto',  
      backgroundPosition: 'center -120px',
      backgroundRepeat: 'repeat-y',
      opacity: 0.99 
  }"
  >
      <div class="relative z-10 flex flex-col min-h-screen">
          <Header @settings="showSettings = true" />
          
          <div class="flex flex-1 overflow-hidden">
              <Sidebar v-if="layoutMode === 'sidebar'" />
              
              <main 
                  class="flex-1 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300"
                  :class="layoutMode === 'sidebar' && !sidebarCollapsed ? 'ml-60' : 'ml-0'"
              >
                  <slot />
              </main>
          </div>
      </div>
      <SettingSidebar v-model:visible="showSettings" />
  </div>
  <div v-else class="min-h-screen bg-[#0A162C]"></div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { getCache, setCache, CacheKey } from '~/utils/cache'
import Header from '../components/Header.vue' 
import Sidebar from '../components/Sidebar.vue'
import SettingSidebar from '../components/SettingSidebar.vue'

const showSettings = ref(false)
const isClientReady = ref(false) // 客户端就绪标记

// 1. 定义核心状态
const layoutMode = ref('fullscreen')
const sidebarCollapsed = ref(false)
const theme = ref('dark')
const activeMenu = ref(null)

// 菜单数据写死在顶层，分发下去
const menuList = ref([
  { 
    name: '首页', route: '/', icon: 'Home', index: 0,
    subMenu: [
      { name: '综合看板', route: '/dashboard/overview', index: 0 },
      { name: '能源看板', route: '/dashboard/energy', index: 1 }
    ]
  },
  { name: '能源管理', route: '/energy', icon: 'Zap', index: 1, subMenu: [] },
  { name: '储能管理', route: '/storage', icon: 'Battery', index: 2, subMenu: [] },
  { name: '负荷管理', route: '/load', icon: 'Activity', index: 3, subMenu: [] },
  { name: '预测管理', route: '/forecast', icon: 'TrendingUp', index: 4, subMenu: [] },
  { name: '策略管理', route: '/strategy', icon: 'Sliders', index: 5, subMenu: [] },
  { name: '能碳管理', route: '/carbon', icon: 'Cloud', index: 6, subMenu: [] },
  { name: '电力交易', route: '/trade', icon: 'BarChart3', index: 7, subMenu: [] },
  { name: '基础设置', route: '/base', icon: 'Settings', index: 8, subMenu: [] },
  { name: '系统设置', route: '/system', icon: 'Shield', index: 9, subMenu: [] },
])

// 2. 挂载时从本地存储拉取数据
onMounted(() => {
  layoutMode.value = getCache(CacheKey.LAYOUT_MODE, 'fullscreen')
  sidebarCollapsed.value = getCache(CacheKey.SIDEBAR_COLLAPSED, false)
  theme.value = getCache(CacheKey.THEME, 'dark')
  activeMenu.value = getCache(CacheKey.ACTIVE_MENU, menuList.value[0])
  isClientReady.value = true // 数据读取完毕，放心渲染
})

// 3. 封装修改状态的方法并同步到本地缓存
const updateLayoutMode = (mode) => {
  layoutMode.value = mode
  setCache(CacheKey.LAYOUT_MODE, mode)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  setCache(CacheKey.SIDEBAR_COLLAPSED, sidebarCollapsed.value)
}

const updateActiveMenu = (menu) => {
  activeMenu.value = menu
  setCache(CacheKey.ACTIVE_MENU, menu)
}

// 4. 将状态和方法注入给所有子组件
provide('layoutState', {
  layoutMode,
  sidebarCollapsed,
  theme,
  activeMenu,
  menuList
})

provide('layoutActions', {
  updateLayoutMode,
  toggleSidebar,
  updateActiveMenu
})
</script>