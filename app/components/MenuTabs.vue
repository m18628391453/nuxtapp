<template>
  <div
    v-if="layoutMode === 'sidebar'"
    class="h-9 border-b border-gray-800/80 flex items-center px-2 z-20 relative"
    :style="layoutMode !== 'fullscreen' ? { 
        backgroundImage: `url('/image/matrix.png')`, 
        backgroundSize: '12%',  
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        paddingTop: '2px',
        opacity: 0.99 
    }: null"
    @dragover.prevent="handleContainerDragOver"
    @drop="handleContainerDrop"
  >
    <div
      v-if="homeTab"
      class="relative h-full flex items-center px-3 mx-0.5 cursor-pointer text-sm transition-all duration-200 group flex-shrink-0"
      :class="[
        activeTabRoute === homeTab.route
          ? 'tab-active text-white'
          : 'tab-inactive text-gray-200 hover:text-white'
      ]"
      @click="goToTab(homeTab.route)"
      @contextmenu.prevent="openContextMenu($event, homeTab.route)"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </div>

    <button
      v-show="showArrows"
      @click="scrollTabs('left')"
      class="flex-shrink-0 w-6 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#32AFFF03] transition-colors z-10"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div
      ref="scrollContainerRef"
      class="flex-1 h-full overflow-x-auto flex items-center hide-scrollbar scroll-smooth"
      @wheel.prevent="handleWheelScroll"
    >
      <transition-group name="tab-list" tag="div" class="flex items-center h-full flex-nowrap w-max">
        <div
          v-for="tab in scrollableTabsList"
          :key="tab.route"
          class="relative h-full flex items-center px-3 mx-0.5 cursor-pointer text-sm transition-all duration-200 group flex-shrink-0"
          :class="[
            activeTabRoute === tab.route
              ? 'tab-active text-white'
              : 'tab-inactive text-gray-200 hover:text-white'
          ]"
          @click="goToTab(tab.route)"
          @contextmenu.prevent="openContextMenu($event, tab.route)"
          :draggable="true"
          @dragstart="handleDragStart(tab, $event)"
          @dragover.prevent="handleDragOver($event, tab)"
          @drop="handleDrop(tab, $event)"
          @dragend="handleDragEnd"
        >
          <span>{{ tab.name }}</span>
          <button
            @click.stop="tab.isFixed ? toggleFixed(tab.route) : closeTab(tab.route)"
            class="ml-2 -mr-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#32AFFF1F] hover:text-white transition-all duration-200 opacity-100 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            :class="[
              activeTabRoute === tab.route ? 'opacity-100 pointer-events-auto' : ''
            ]"
          >
            <svg v-if="tab.isFixed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>

    <button
      v-show="showArrows"
      @click="scrollTabs('right')"
      class="flex-shrink-0 w-6 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#32AFFF03] transition-colors z-10"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <div
      v-if="contextMenu.show"
      class="fixed z-50 w-40 bg-[#0F172A] border border-gray-700 rounded shadow-lg text-sm overflow-hidden"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y - 15 }px` }"
    >
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableClose ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="closeTab(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        关闭
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableFixed ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="toggleFixed(contextMenu.route)"
      >
        <svg v-if="!isContextFixed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        {{ isContextFixed ? '取消固定' : '固定标签' }}
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        @click="reloadTab(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重新加载
      </div>
      <div class="h-px bg-gray-700 my-1"></div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableCloseLeft ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="closeLeftTabs(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        关闭左侧标签
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableCloseRight ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="closeRightTabs(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
        关闭右侧标签
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableCloseOther ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="closeOtherTabs(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        关闭其他标签
      </div>
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        :class="disableCloseAll ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''"
        @click="closeAllTabs"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        关闭全部标签
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSessionCache, setSessionCache, SessionCacheKey } from '~/utils/cache'

// 从父组件注入状态
const layoutState = inject('layoutState') as any
const layoutActions = inject('layoutActions') as any 
const { forceRefreshPage } = layoutActions
const { layoutMode, activeMenu, menuList } = layoutState
const router = useRouter()
const route = useRoute()

// Tab 数据类型 - 新增固定字段
interface TabItem {
  name: string
  route: string
  index?: number
  isFixed?: boolean
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

// ==================== 拖拽相关状态 ====================
const draggingTab = ref<TabItem | null>(null)

// ==================== 滚动与箭头状态 ====================
const scrollContainerRef = ref<HTMLElement | null>(null)
const showArrows = ref(false)
let resizeObserver: ResizeObserver | null = null

// ==================== 核心计算属性 ====================
// 渲染用的整体Tab列表：Home永远在前 → 固定标签 → 非固定标签
const renderTabsList = computed(() => {
  const home = tabsList.value.find(t => t.route === '/dashboard/overview' || t.route === '/')
  const fixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && t.isFixed)
  const unfixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && !t.isFixed)
  const result = []
  if (home) result.push(home)
  result.push(...fixedTabs)
  result.push(...unfixedTabs)
  return result
})

// 单独提取 Home 标签，用于固定在最左侧
const homeTab = computed(() => renderTabsList.value.find(t => t.route === '/dashboard/overview' || t.route === '/'))
// 提取可滚动的其他标签
const scrollableTabsList = computed(() => renderTabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/')))

// 当前右键选中的Tab
const currentContextTab = computed(() => {
  return tabsList.value.find(t => t.route === contextMenu.value.route)
})
// 是否是首页标签
const isContextHome = computed(() => {
  const route = contextMenu.value.route
  return route === '/dashboard/overview' || route === '/'
})
// 当前右键标签是否固定
const isContextFixed = computed(() => {
  return currentContextTab.value?.isFixed || false
})
// 非固定标签列表（排除首页）
const unfixedTabs = computed(() => {
  return renderTabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && !t.isFixed)
})
// 当前右键标签在非固定列表中的索引
const contextTabUnfixedIndex = computed(() => {
  return unfixedTabs.value.findIndex(t => t.route === contextMenu.value.route)
})
// 关闭按钮禁用逻辑
const disableClose = computed(() => {
  return isContextHome.value || isContextFixed.value
})
// 固定按钮禁用逻辑
const disableFixed = computed(() => {
  return isContextHome.value
})
// 关闭左侧禁用逻辑
const disableCloseLeft = computed(() => {
  if (isContextHome.value || isContextFixed.value) return true
  return contextTabUnfixedIndex.value <= 0
})
// 关闭右侧禁用逻辑
const disableCloseRight = computed(() => {
  if (isContextHome.value || isContextFixed.value) return true
  if (contextTabUnfixedIndex.value === -1) return true
  return contextTabUnfixedIndex.value >= unfixedTabs.value.length - 1
})
// 关闭其他禁用逻辑
const disableCloseOther = computed(() => {
  if (isContextHome.value) return true
  const closableTabs = tabsList.value.filter(t => 
    !(t.route === '/dashboard/overview' || t.route === '/') && 
    !t.isFixed && 
    t.route !== contextMenu.value.route
  )
  return closableTabs.length === 0
})
// 关闭全部禁用逻辑
const disableCloseAll = computed(() => {
  const closableTabs = tabsList.value.filter(t => 
    !(t.route === '/dashboard/overview' || t.route === '/') && 
    !t.isFixed
  )
  return closableTabs.length === 0
})

// ==================== 滚动与箭头逻辑 ====================
// 检查是否需要显示箭头
const checkScroll = () => {
  if (scrollContainerRef.value) {
    const { scrollWidth, clientWidth } = scrollContainerRef.value
    // 添加极小容差防止边界闪烁
    showArrows.value = scrollWidth > clientWidth + 1
  }
}

// 点击箭头进行固定尺寸平滑滚动
const scrollTabs = (direction: 'left' | 'right') => {
  if (!scrollContainerRef.value) return
  const scrollAmount = 300 // 固定尺寸的滚动跨度
  const currentScroll = scrollContainerRef.value.scrollLeft
  scrollContainerRef.value.scrollTo({
    left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
    behavior: 'smooth'
  })
}

// 鼠标滚轮水平滚动（增强体验）
const handleWheelScroll = (e: WheelEvent) => {
  if (!scrollContainerRef.value) return
  scrollContainerRef.value.scrollLeft += e.deltaY > 0 ? 150 : -150
}

// 自动滚动到激活的 Tab 确保其在可视区域内
const scrollToActiveTab = () => {
  nextTick(() => {
    if (!scrollContainerRef.value) return
    const container = scrollContainerRef.value
    const activeTabEl = container.querySelector('.tab-active') as HTMLElement
    if (activeTabEl) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTabEl.getBoundingClientRect()

      if (tabRect.left < containerRect.left) {
        container.scrollBy({ left: tabRect.left - containerRect.left - 30, behavior: 'smooth' })
      } else if (tabRect.right > containerRect.right) {
        container.scrollBy({ left: tabRect.right - containerRect.right + 30, behavior: 'smooth' })
      }
    }
  })
}

// ==================== 原有方法保留 ====================
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
    tabsList.value = savedTabs.map(t => ({ isFixed: false, ...t }))
    activeTabRoute.value = savedActiveRoute
  } else {
    const defaultMenu = menuList.value[0]
    const defaultTab = defaultMenu.subMenu && defaultMenu.subMenu.length > 0 
      ? { name: defaultMenu.subMenu[0].name, route: defaultMenu.subMenu[0].route, index: defaultMenu.subMenu[0].index, isFixed: false }
      : { name: defaultMenu.name, route: defaultMenu.route, index: defaultMenu.index, isFixed: false }
    tabsList.value = [defaultTab]
    activeTabRoute.value = defaultTab.route
  }
}
// 添加 Tab
const addTab = (tab: TabItem) => {
  const existingTab = tabsList.value.find(t => t.route === tab.route)
  if (!existingTab) {
    tabsList.value.push({ ...tab, isFixed: false })
  }
  activeTabRoute.value = tab.route
  saveTabsToSession()
}
// 移除 Tab
const removeTab = (route: string) => {
  const index = tabsList.value.findIndex(t => t.route === route)
  if (index === -1) return
  
  if (route === '/dashboard/overview' || route === '/') return
  const targetTab = tabsList.value[index]
  if (targetTab.isFixed) return
  
  const isRemovingActive = activeTabRoute.value === route
  tabsList.value.splice(index, 1)
  
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
  contextMenu.value.show = false
}
// 关闭其他 Tabs
const closeOtherTabs = (route: string) => {
  tabsList.value = tabsList.value.filter(t => {
    const isHome = t.route === '/dashboard/overview' || t.route === '/'
    const isFixed = t.isFixed
    const isCurrent = t.route === route
    return isHome || isFixed || isCurrent
  })
  activeTabRoute.value = route
  router.push(route)
  saveTabsToSession()
  contextMenu.value.show = false
}
// 关闭所有Tabs页
const closeAllTabs = () => {
  const reservedTabs = tabsList.value.filter(t => {
    const isHome = t.route === '/dashboard/overview' || t.route === '/'
    const isFixed = t.isFixed
    return isHome || isFixed
  })
  tabsList.value = reservedTabs
  if (reservedTabs.length > 0) {
    const targetRoute = reservedTabs[0].route
    activeTabRoute.value = targetRoute
    router.push(targetRoute)
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
  const targetElement = e.currentTarget as HTMLElement
  const rect = targetElement.getBoundingClientRect()
  const menuLeft = rect.left + rect.width / 2
  const menuTop = rect.bottom + 10
  contextMenu.value = { show: true, x: menuLeft, y: menuTop, route }
}
// 点击外部关闭右键菜单
const handleClickOutside = () => {
  contextMenu.value.show = false
}

// ==================== 右键菜单扩展方法 ====================
// 切换标签固定状态
const toggleFixed = (route: string) => {
  const targetTab = tabsList.value.find(t => t.route === route)
  if (!targetTab || isContextHome.value) return
  targetTab.isFixed = !targetTab.isFixed
  saveTabsToSession()
  contextMenu.value.show = false
}
// 重新加载当前标签页
const reloadTab = (route: string) => {
  contextMenu.value.show = false
  const targetRoute = route
  if (activeTabRoute.value === targetRoute) {
    forceRefreshPage()
  } else {
    router.push(targetRoute).then(() => {
      setTimeout(() => { forceRefreshPage() }, 50)
    })
  }
}
// 关闭左侧标签
const closeLeftTabs = (route: string) => {
  const currentIndex = contextTabUnfixedIndex.value
  if (currentIndex <= 0) return
  const toCloseRoutes = unfixedTabs.value.slice(0, currentIndex).map(t => t.route)
  toCloseRoutes.forEach(routeKey => removeTab(routeKey))
  contextMenu.value.show = false
}
// 关闭右侧标签
const closeRightTabs = (route: string) => {
  const currentIndex = contextTabUnfixedIndex.value
  if (currentIndex === -1 || currentIndex >= unfixedTabs.value.length - 1) return
  const toCloseRoutes = unfixedTabs.value.slice(currentIndex + 1).map(t => t.route)
  toCloseRoutes.forEach(routeKey => removeTab(routeKey))
  contextMenu.value.show = false
}

// ==================== 拖拽相关方法 ====================
const handleDragStart = (tab: TabItem, e: DragEvent) => {
  draggingTab.value = tab
  ;(e.target as HTMLElement).style.opacity = '0.5'
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (e: DragEvent, targetTab: TabItem) => {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  if (draggingTab.value?.isFixed !== targetTab.isFixed) return
  if (targetTab.route === '/dashboard/overview' || targetTab.route === '/') return
}

const handleDrop = (targetTab: TabItem, e: DragEvent) => {
  if (!draggingTab.value) return
  if (
    draggingTab.value.route === targetTab.route ||
    draggingTab.value.isFixed !== targetTab.isFixed ||
    targetTab.route === '/dashboard/overview' || targetTab.route === '/'
  ) {
    return
  }
  const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const mouseX = e.clientX
  const targetMiddleX = targetRect.left + targetRect.width / 2
  const dragIndex = tabsList.value.findIndex(t => t.route === draggingTab.value!.route)
  const targetIndex = tabsList.value.findIndex(t => t.route === targetTab.route)
  if (dragIndex === -1 || targetIndex === -1) return

  const [movedTab] = tabsList.value.splice(dragIndex, 1)
  const adjustedTargetIndex = dragIndex < targetIndex ? targetIndex - 1 : targetIndex
  
  let insertIndex: number
  if (mouseX < targetMiddleX) {
    insertIndex = adjustedTargetIndex
  } else {
    insertIndex = adjustedTargetIndex + 1
  }
  tabsList.value.splice(insertIndex, 0, movedTab)
  saveTabsToSession()
}

const handleContainerDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!draggingTab.value) return
  e.dataTransfer!.dropEffect = 'move'
}

const handleContainerDrop = (e: DragEvent) => {
  if (!draggingTab.value) return
  if (draggingTab.value.route === '/dashboard/overview' || draggingTab.value.route === '/') return
  const dragIndex = tabsList.value.findIndex(t => t.route === draggingTab.value!.route)
  if (dragIndex === -1) return

  const [movedTab] = tabsList.value.splice(dragIndex, 1)
  const currentHomeTab = tabsList.value.find(t => t.route === '/dashboard/overview' || t.route === '/')
  const currentFixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && t.isFixed)
  
  let insertIndex: number
  if (movedTab.isFixed) {
    insertIndex = (currentHomeTab ? 1 : 0) + currentFixedTabs.length
  } else {
    insertIndex = tabsList.value.length
  }
  tabsList.value.splice(insertIndex, 0, movedTab)
  saveTabsToSession()
}

const handleDragEnd = (e: DragEvent) => {
  ;(e.target as HTMLElement).style.opacity = '1'
  draggingTab.value = null
}

// 监听路由变化，添加新 Tab 及触发滚动
watch(() => route.path, (newPath) => {
  if (isInitializing.value) {
    if (tabsList.value.some(t => t.route === newPath)) {
      activeTabRoute.value = newPath
      saveTabsToSession()
    }
    isInitializing.value = false
    return
  }
  let currentMenuItem: TabItem | null = null
  for (const menu of menuList.value) {
    if (menu.route === newPath) {
      currentMenuItem = { name: menu.name, route: menu.route, index: menu.index }
      break
    }
    if (menu.subMenu && menu.subMenu.length > 0) {
      const subItem = menu.subMenu.find((sub: any) => sub.route === newPath)
      if (subItem) {
        currentMenuItem = { name: subItem.name, route: subItem.route, index: subItem.index }
        break
      }
    }
  }
  if (currentMenuItem) {
    addTab(currentMenuItem)
  }
}, { immediate: true })

// 监听激活Tab变更，自动调整滚动条位置
watch(activeTabRoute, () => {
  scrollToActiveTab()
})

// 监听可滚动列表长度变化，重新检查箭头状态
watch(() => scrollableTabsList.value.length, () => {
  nextTick(() => { checkScroll() })
})

const handleAddTabEvent = (event: CustomEvent) => {
  const { name, route, index } = event.detail
  addTab({ name, route, index, isFixed: false })
}

onMounted(() => {
  loadTabsFromSession()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('add-tab', handleAddTabEvent as EventListener)
  
  // 监听容器大小变化动态显隐箭头
  if (scrollContainerRef.value) {
    resizeObserver = new ResizeObserver(() => checkScroll())
    resizeObserver.observe(scrollContainerRef.value)
    // 初始化检查一次
    nextTick(() => checkScroll())
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('add-tab', handleAddTabEvent as EventListener)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

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
.tab-inactive + .tab-inactive::before {
  content: '';
  position: absolute;
  left: -2.5px;
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(255,255,255,0.1);
}
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
.tab-active::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -8px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at top left, transparent 70%, #32AFFF1F 50%);
  z-index: 1;
}
.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at top right, transparent 70%, #32AFFF1F 50%);
  z-index: 1;
}
.tab-active > span {
  position: relative;
  z-index: 2;
}
.tab-active::before,
.tab-active::after {
  pointer-events: none;
}
div[draggable="true"] {
  cursor: grab;
}
div[draggable="true"]:active {
  cursor: grabbing;
}

.tab-list-move {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>