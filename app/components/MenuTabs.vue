<template>
  <div
    v-if="layoutMode === 'sidebar'"
    class="h-9 border-b border-gray-800/80 flex items-center gap-1 px-2 overflow-x-auto whitespace-nowrap z-20 relative"
    :style="layoutMode !== 'fullscreen' ? { 
        backgroundImage: `url('/image/matrix.png')`, 
        backgroundSize: '12%',  
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        paddingTop: '2px',
        opacity: 0.99 
    }: null"
  >
    <div
      v-for="tab in tabsList"
      :key="tab.route"
      class="relative h-full flex items-center px-4 cursor-pointer text-sm transition-all duration-200 group"
      :class="[
        activeTabRoute === tab.route
          ? 'tab-active text-white'
          : 'tab-inactive text-gray-200 hover:text-white'
      ]"
      @click="goToTab(tab.route)"
      @contextmenu.prevent="openContextMenu($event, tab.route)"
    >
      <!-- 首页显示房子图标，其他显示名称 -->
      <span v-if="tab.route === '/dashboard/overview' || tab.route === '/'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </span>
      <span v-else>{{ tab.name }}</span>
      <!-- 关闭按钮（首页不显示，仅选中/hover时可见） -->
      <button
        v-if="tab.route !== '/dashboard/overview' && tab.route !== '/'"
        @click.stop="closeTab(tab.route)"
        class="ml-2 -mr-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#32AFFF1F] hover:text-white transition-all duration-200 opacity-100 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
        :class="[
          activeTabRoute === tab.route ? 'opacity-100 pointer-events-auto' : ''
        ]"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.show"
      class="fixed z-50 w-32 bg-[#0F172A] border border-gray-700 rounded shadow-lg text-sm overflow-hidden"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
    >
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors"
        @click="closeOtherTabs(contextMenu.route)"
      >
        关闭其他
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors"
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
// 关闭所有Tabs页
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
// 跳转到Tab页
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
onMounted(() => {
  loadTabsFromSession()
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<style scoped>
/* 滚动条样式优化，贴合设计稿深色风格 */
::-webkit-scrollbar {
  height: 2px;
}
::-webkit-scrollbar-thumb {
  background: #1E40AF;
  border-radius: 1px;
}
::-webkit-scrollbar-track {
  background: transparent;
}

/* 非激活Tab样式 */
.tab-inactive {
  border-radius: 4px;
  position: relative;
}
.tab-inactive:hover {
  background: #32AFFF1F;
  margin-bottom: 2px;
  margin-top: 1px;
  height: calc(100% - 3px);
}
/* 非激活Tab之间的分隔线 */
.tab-inactive + .tab-inactive::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(255,255,255,0.1);
}

/* 激活Tab核心样式 - 贴合设计稿的底部衔接曲线 */
.tab-active {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: #32AFFF1f;
  position: relative;
  font-weight: 500;
  margin-top: 1px;
  padding-bottom: 2px;
  height: calc(100% - 1px);
}
/* 底部衔接曲线 - 左下角 */
.tab-active::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -8px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at top left, transparent 70%, #0F3B6E 70%);
  z-index: 1;
}
/* 底部衔接曲线 - 右下角 */
.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at top right, transparent 70%, #0F3B6E 70%);
  z-index: 1;
}
/* 覆盖底部边框，实现和下方内容无缝衔接 */
.tab-active > span {
  position: relative;
  z-index: 2;
}
.tab-active::before,
.tab-active::after {
  pointer-events: none;
}
</style>