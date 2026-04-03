<template>
  <div
    v-if="layoutMode === 'sidebar'"
    class="h-10 bg-[#0D1B32] border-b border-gray-800/50 flex items-center gap-1 px-2 overflow-x-auto whitespace-nowrap z-20"
  >
    <div
      v-for="tab in tabsList"
      :key="tab.route"
      class="relative h-8 flex items-center px-3 rounded cursor-pointer text-sm transition-all"
      :class="[
        activeTabRoute === tab.route
          ? 'bg-[#32AFFF]/20 text-[#32AFFF]'
          : 'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white'
      ]"
      @click="goToTab(tab.route)"
      @contextmenu.prevent="openContextMenu($event, tab.route)"
    >
      <span>{{ tab.name }}</span>
      <!-- 关闭按钮（首页不显示） -->
      <button
        v-if="tab.route !== '/dashboard/overview' && tab.route !== '/'"
        @click.stop="closeTab(tab.route)"
        class="ml-1 -mr-1.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed z-50 w-32 bg-[#1A1D24] border border-gray-700 rounded shadow-lg text-sm overflow-hidden"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
    >
      <div
        class="px-3 py-2 hover:bg-[#32AFFF]/20 hover:text-white cursor-pointer"
        @click="closeOtherTabs(contextMenu.route)"
      >
        关闭其他
      </div>
      <div
        class="px-3 py-2 hover:bg-[#32AFFF]/20 hover:text-white cursor-pointer"
        @click="closeAllTabs"
      >
        关闭全部
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSessionCache, setSessionCache, SessionCacheKey } from '~/utils/cache'

// 从父组件注入状态
const layoutState = inject('layoutState') as any
const { layoutMode, activeMenu, menuList } = layoutState

const router = useRouter()
const route = useRoute()

// Tab 数据类型
interface TabItem {
  name: string
  route: string
  index?: number
}

// Tab 列表
const tabsList = ref<TabItem[]>([])
// 当前激活的 Tab
const activeTabRoute = ref<string>('')
// 标记是否是初始化加载阶段
const isInitializing = ref(true)

// 右键菜单
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  route: ''
})

// 保存 Tabs 到 sessionStorage
const saveTabsToSession = () => {
  setSessionCache(SessionCacheKey.TABS_LIST, tabsList.value)
  setSessionCache(SessionCacheKey.ACTIVE_TAB_ROUTE, activeTabRoute.value)
}

// 从 sessionStorage 加载 Tabs
const loadTabsFromSession = () => {
  const savedTabs = getSessionCache<TabItem[]>(SessionCacheKey.TABS_LIST, [])
  const savedActiveRoute = getSessionCache<string>(SessionCacheKey.ACTIVE_TAB_ROUTE, '')
  
  if (savedTabs.length > 0) {
    tabsList.value = savedTabs
    activeTabRoute.value = savedActiveRoute
  } else {
    // 初始化默认 Tab（取第一个菜单的第一个子菜单）
    const defaultMenu = menuList.value[0]
    const defaultTab = defaultMenu.subMenu && defaultMenu.subMenu.length > 0 
      ? { name: defaultMenu.subMenu[0].name, route: defaultMenu.subMenu[0].route, index: defaultMenu.subMenu[0].index }
      : { name: defaultMenu.name, route: defaultMenu.route, index: defaultMenu.index }
    tabsList.value = [defaultTab]
    activeTabRoute.value = defaultTab.route
  }
}

// 添加 Tab
const addTab = (tab: TabItem) => {
  // 检查是否已存在
  const existingTab = tabsList.value.find(t => t.route === tab.route)
  if (!existingTab) {
    tabsList.value.push(tab)
  }
  // 切换到该 Tab
  activeTabRoute.value = tab.route
  saveTabsToSession()
}

// 移除 Tab
const removeTab = (route: string) => {
  const index = tabsList.value.findIndex(t => t.route === route)
  if (index === -1) return
  
  // 如果移除的是首页，不允许移除
  if (route === '/dashboard/overview' || route === '/') return
  
  const isRemovingActive = activeTabRoute.value === route
  tabsList.value.splice(index, 1)
  
  // 如果移除的是当前激活的 Tab，需要切换到相邻的 Tab
  if (isRemovingActive && tabsList.value.length > 0) {
    const newIndex = index < tabsList.value.length ? index : tabsList.value.length - 1
    const newActiveRoute = tabsList.value[newIndex].route
    activeTabRoute.value = newActiveRoute
    router.push(newActiveRoute)
  }
  
  saveTabsToSession()
}

// 关闭指定Tab
const closeTab = (route: string) => {
  removeTab(route)
  // 关闭后隐藏右键菜单
  contextMenu.value.show = false
}

// 关闭其他 Tabs
const closeOtherTabs = (route: string) => {
  // 保留当前Tab和首页
  const homeTab = tabsList.value.find(t => t.route === '/dashboard/overview')
  const currentTab = tabsList.value.find(t => t.route === route)
  
  if (homeTab && currentTab) {
    tabsList.value = homeTab.route === currentTab.route ? [homeTab] : [homeTab, currentTab]
  } else if (homeTab) {
    tabsList.value = [homeTab]
  } else if (currentTab) {
    tabsList.value = [currentTab]
  }
  
  activeTabRoute.value = route
  router.push(route)
  saveTabsToSession()
  contextMenu.value.show = false
}

// 关闭所有 Tabs（保留首页）
const closeAllTabs = () => {
  const homeTab = tabsList.value.find(t => t.route === '/dashboard/overview')
  if (homeTab) {
    tabsList.value = [homeTab]
    activeTabRoute.value = homeTab.route
    router.push(homeTab.route)
  } else {
    const defaultMenu = menuList.value[0]
    const defaultTab = defaultMenu.subMenu && defaultMenu.subMenu.length > 0 
      ? { name: defaultMenu.subMenu[0].name, route: defaultMenu.subMenu[0].route, index: defaultMenu.subMenu[0].index }
      : { name: defaultMenu.name, route: defaultMenu.route, index: defaultMenu.index }
    tabsList.value = [defaultTab]
    activeTabRoute.value = defaultTab.route
    router.push(defaultTab.route)
  }
  saveTabsToSession()
  contextMenu.value.show = false
}

// 跳转到 Tab
const goToTab = (route: string) => {
  activeTabRoute.value = route
  router.push(route)
  saveTabsToSession()
}

// 右键菜单
const openContextMenu = (e: MouseEvent, route: string) => {
  e.preventDefault()
  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    route
  }
}

// 点击外部关闭右键菜单
const handleClickOutside = () => {
  contextMenu.value.show = false
}

// 监听路由变化，添加新 Tab（只有路由变了才加，Header点顶级菜单不触发路由变）
watch(() => route.path, (newPath) => {
  // 初始化阶段，只恢复状态，不新增Tab
  if (isInitializing.value) {
    // 确保激活状态和当前路由一致
    if (tabsList.value.some(t => t.route === newPath)) {
      activeTabRoute.value = newPath
      saveTabsToSession()
    }
    isInitializing.value = false
    return
  }

  // 正常交互阶段，查找菜单项并添加Tab
  let currentMenuItem: TabItem | null = null
  
  // 先在一级菜单中查找
  for (const menu of menuList.value) {
    if (menu.route === newPath) {
      currentMenuItem = { name: menu.name, route: menu.route, index: menu.index }
      break
    }
    // 在子菜单中查找
    if (menu.subMenu && menu.subMenu.length > 0) {
      const subItem = menu.subMenu.find((sub: any) => sub.route === newPath)
      if (subItem) {
        currentMenuItem = { name: subItem.name, route: subItem.route, index: subItem.index }
        break
      }
    }
  }
  
  // 如果找到对应的菜单项，添加 Tab
  if (currentMenuItem) {
    addTab(currentMenuItem)
  }
}, { immediate: true })

// 【核心修改】移除了 watch(activeMenu) 的新增Tab逻辑，只保留路由变化触发新增Tab

onMounted(() => {
  // 先加载Session缓存
  loadTabsFromSession()
  // 添加点击外部关闭菜单的监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
::-webkit-scrollbar {
  height: 2px;
}
::-webkit-scrollbar-thumb {
  background: #32AFFF;
  border-radius: 1px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>