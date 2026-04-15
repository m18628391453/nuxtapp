<template>
  <div v-if="isClientReady" class="relative min-h-screen text-white font-sans">
    <div class="relative z-10 flex flex-col min-h-screen">
      <Header @settings="showSettings = true" />
      
      <div class="flex flex-1 overflow-hidden">
        <Sidebar v-if="layoutMode === 'sidebar'" />

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
import { getSessionCache, setSessionCache } from '~/utils/cache' 
import Header from '../components/Header.vue' 
import Sidebar from '../components/Sidebar.vue'
import SettingSidebar from '../components/SettingSidebar.vue'
import MenuTabs from '../components/MenuTabs.vue'
import { useMenuApi } from '~/api/menu'

const showSettings = ref(false)
const isClientReady = ref(false)

// 核心状态
const layoutMode = ref('sidebar')
const sidebarCollapsed = ref(false)
const theme = ref('dark')
const activeMenu = ref(null)
const refreshKey = ref(0)
const { getMenuList } = useMenuApi()

const forceRefreshPage = () => {
  refreshKey.value += 1
}

// 菜单配置：初始化为空数组
const menuList = ref([])

const initSystemData = async () => {
  try {
    // 从后端拿菜单
    const res = await getMenuList()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      menuList.value = res.data
    }
    // 菜单加载完成后，再初始化activeMenu
    const cacheActiveMenu = getSessionCache(CacheKey.ACTIVE_MENU)
    if (cacheActiveMenu && menuList.value.length > 0) {
      // 校验缓存的菜单是否存在于最新菜单列表中
      const existMenu = menuList.value.find(item => item.route === cacheActiveMenu.route)
      activeMenu.value = existMenu || menuList.value[0]
    } else {
      // 无缓存则取第一个菜单
      activeMenu.value = menuList.value[0] || null
    }
  } catch (err) {
    console.error('获取菜单失败:', err)
    // 异常时兜底空数组，避免报错
    menuList.value = []
    activeMenu.value = null
  }
};

// 挂载逻辑：先加载菜单，再标记客户端就绪
onMounted(async () => {
  // 先加载菜单
  await initSystemData();
  // 再读取缓存配置
  layoutMode.value = getCache(CacheKey.LAYOUT_MODE, 'sidebar')
  sidebarCollapsed.value = getCache(CacheKey.SIDEBAR_COLLAPSED, false)
  theme.value = getCache(CacheKey.THEME, 'dark')
  // 标记客户端就绪（确保菜单加载完成后再渲染）
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
  // 空值保护
  if (!menu) return
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
</style>