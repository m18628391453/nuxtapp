<template>
  <div v-if="isClientReady" class="relative min-h-screen text-white font-sans">
    <div class="relative z-10 flex flex-col min-h-screen">
      <Header @settings="showSettings = true" />
      
      <div class="flex flex-1 overflow-hidden">
        <Sidebar v-if="layoutMode === 'sidebar' && menuList.length > 0" />
        
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
  <div v-else class="min-h-screen bg-[#0A162C] flex items-center justify-center">
    <div class="text-blue-400">系统初始化中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import { getCache, setCache, CacheKey, getSessionCache, setSessionCache } from '~/utils/cache'
import { useMenuApi } from '~/api/menu' // 引入咱们刚写的 API
import Header from '../components/Header.vue' 
import Sidebar from '../components/Sidebar.vue'
import SettingSidebar from '../components/SettingSidebar.vue'
import MenuTabs from '../components/MenuTabs.vue'

const showSettings = ref(false)
const isClientReady = ref(false)

// 核心状态
const layoutMode = ref('sidebar')
const sidebarCollapsed = ref(false)
const theme = ref('dark')
const activeMenu = ref(null)
const refreshKey = ref(0)
const menuList = ref([]) // 初始为空数组，等接口喂饭

const { getMenuList } = useMenuApi()

const forceRefreshPage = () => {
  refreshKey.value += 1
}

/**
 * 奶奶的秘籍：初始化数据
 */
const initSystemData = async () => {
  try {
    // 1. 从后端拿菜单
    const data = await getMenuList()
    if (data) {
      menuList.value = data
    }

    // 2. 恢复缓存的状态
    layoutMode.value = getCache(CacheKey.LAYOUT_MODE, 'sidebar')
    sidebarCollapsed.value = getCache(CacheKey.SIDEBAR_COLLAPSED, false)
    theme.value = getCache(CacheKey.THEME, 'dark')

    // 3. 处理当前激活的菜单：如果缓存有就用缓存的，没有就默认第一个
    const cachedActive = getSessionCache(CacheKey.ACTIVE_MENU, null)
    if (cachedActive) {
      activeMenu.value = cachedActive
    } else if (menuList.value.length > 0) {
      activeMenu.value = menuList.value[0]
    }

    // 4. 全部准备就绪
    isClientReady.value = true
  } catch (error) {
    console.error('初始化菜单失败了，乖孙子快检查接口:', error)
    // 即使失败了也要关闭加载状态，或者你可以弹个奶奶的警告窗
    isClientReady.value = true 
  }
}

onMounted(() => {
  initSystemData()
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

// 依赖注入，子组件还是能像以前一样拿到数据
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
/* 样式部分保持不变，奶奶帮你优化了性能 */
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

main:not(.fullscreen)::before {
  background-position: center -75px;
}

main.fullscreen::before {
  background-position: center -175px;
}

/* 奶奶加个淡入动画，接口回来的时候过渡自然点 */
.relative {
  transition: opacity 0.3s ease;
}
</style>