<template>
  <div v-if="isClientReady" class="relative min-h-screen text-white font-sans">
    <!-- 内容层（保持 z-10 在背景之上） -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <Header @settings="showSettings = true" />
      
      <div class="flex flex-1 overflow-hidden">
        <Sidebar v-if="layoutMode === 'sidebar'" />
        
        <!-- 核心修改：给 main 加 relative，去掉内联 style，加动态 fullscreen class -->
        <main 
          class="flex-1 h-[calc(100vh-50px)] overflow-hidden transition-all duration-300 relative"
          :key="refreshKey"
          :class="[
            layoutMode === 'sidebar' && !sidebarCollapsed ? 'ml-[210px]' : 'ml-0',
            layoutMode === 'fullscreen' ? 'fullscreen' : 'sidebar'
          ]"
        >
          <MenuTabs />
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
import MenuTabs from '../components/MenuTabs.vue'

const showSettings = ref(false)
const isClientReady = ref(false)

// 核心状态，完全保留原有逻辑
const layoutMode = ref('sidebar')
const sidebarCollapsed = ref(false)
const theme = ref('dark')
const activeMenu = ref(null)
const refreshKey = ref(0)

const forceRefreshPage = () => {
  refreshKey.value += 1
}

// 菜单配置保持原样
const menuList = ref([
  { 
    name: '首页', route: '/', icon: 'Home', index: 0,
    subMenu: [
      { name: '综合看板', route: '/dashboard/overview', icon: 'TvMinimal', index: 0 },
      { name: '能量看板', route: '/dashboard/energy', icon: 'Atom', index: 1 }
    ]
  },
  { 
    name: '能源管理', route: '/energy/pvoverview', icon: 'Zap', index: 1,
    subMenu: [
      { 
        name: '光伏监测', route: '/energy/pv', icon: 'Sun', index: 0,
        subMenu: [
          { name: '光伏总览', route: '/energy/pvoverview', index: 0 },
          { name: '逆变器监视', route: '/energy/pvinverter', index: 1 },
          { name: '告警总览', route: '/energy/pvalarm', index: 2 }
        ]
      },
      { 
        name: '风电监测', route: '/energy/wind', icon: 'Wind', index: 1,
        subMenu: [
          { name: '风电总览', route: '/energy/windoverview', index: 0 },
          { name: '风机监视', route: '/energy/windturbine', index: 1 },
        ]
      }
    ]
  },
  { name: '储能管理', route: '/storage', icon: 'Battery', index: 2,
    subMenu: [
      { name: '储能总览', route: '/storage/overview', icon: 'GalleryThumbnails', index: 0 },
      { name: '储能单元', route: '/storage/unit', icon: 'Boxes', index: 0 },
      { name: 'BMS监视', route: '/storage/monitor', icon: 'ChartNoAxesCombined', index: 0 },
    ]
  },
  { name: '负荷管理', route: '/load', icon: 'Activity', index: 3, subMenu: [] },
  { name: '预测管理', route: '/forecast', icon: 'TrendingUp', index: 4, subMenu: [] },
  { name: '策略管理', route: '/strategy', icon: 'Sliders', index: 5, subMenu: [] },
  { name: '能碳管理', route: '/carbon', icon: 'Cloud', index: 6, subMenu: [] },
  { name: '电力交易', route: '/trade', icon: 'BarChart3', index: 7, subMenu: [] },
  { name: '基础设置', route: '/base', icon: 'Settings', index: 8, subMenu: [] },
  { name: '系统设置', route: '/system', icon: 'Shield', index: 9, subMenu: [] },
])

// 挂载逻辑完全保留
onMounted(() => {
  layoutMode.value = getCache(CacheKey.LAYOUT_MODE, 'sidebar')
  sidebarCollapsed.value = getCache(CacheKey.SIDEBAR_COLLAPSED, false)
  theme.value = getCache(CacheKey.THEME, 'dark')
  activeMenu.value = getSessionCache(CacheKey.ACTIVE_MENU, menuList.value[0])
  isClientReady.value = true
})

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
  setSessionCache(CacheKey.ACTIVE_MENU, menu)
}

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
  updateActiveMenu,
  forceRefreshPage
})
</script>

<style>
/* 给 main 标签添加伪元素背景层 */
main::before {
  content: '';
  position: absolute;
  inset: 0; 
  z-index: -1;
  pointer-events: none; 
  background-image: url('/image/background.jpg');
  background-size: 100%;
  background-repeat: repeat;
  opacity: 0.45;
}

/* 非全屏模式 (Sidebar 模式)：背景位置 -100px */
main:not(.fullscreen)::before {
  background-position: center -75px;
}

/* 全屏模式：背景位置 -150px */
main.fullscreen::before {
  background-position: center -175px;
}
</style>