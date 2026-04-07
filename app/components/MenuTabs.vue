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
    @dragover.prevent="handleContainerDragOver"
    @drop="handleContainerDrop"
  >
    <!-- 使用 transition-group 实现列表动画 -->
    <transition-group name="tab-list" tag="div" class="flex items-center h-full">
      <div
        v-for="tab in renderTabsList"
        :key="tab.route"
        class="relative h-full flex items-center px-3 mx-0.5 cursor-pointer text-sm transition-all duration-200 group"
        :class="[
          activeTabRoute === tab.route
            ? 'tab-active text-white'
            : 'tab-inactive text-gray-200 hover:text-white'
        ]"
        @click="goToTab(tab.route)"
        @contextmenu.prevent="openContextMenu($event, tab.route)"
        :draggable="!(tab.route === '/dashboard/overview' || tab.route === '/')"
        @dragstart="handleDragStart(tab, $event)"
        @dragover.prevent="handleDragOver($event, tab)"
        @drop="handleDrop(tab, $event)"
        @dragend="handleDragEnd"
      >
        <!-- 首页显示房子图标，其他显示名称 -->
        <span v-if="tab.route === '/dashboard/overview' || tab.route === '/'">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </span>
        <span v-else>{{ tab.name }}</span>
        <!-- 固定标签显示图钉按钮，非固定标签显示关闭按钮（首页不显示） -->
        <button
          v-if="tab.route !== '/dashboard/overview' && tab.route !== '/'"
          @click.stop="tab.isFixed ? toggleFixed(tab.route) : closeTab(tab.route)"
          class="ml-2 -mr-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#32AFFF1F] hover:text-white transition-all duration-200 opacity-100 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          :class="[
            activeTabRoute === tab.route ? 'opacity-100 pointer-events-auto' : ''
          ]"
        >
          <!-- 固定标签显示图钉图标 -->
          <svg v-if="tab.isFixed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <!-- 非固定标签显示关闭图标 -->
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition-group>
    <!-- 右键菜单 - 完整功能版 -->
    <div
      v-if="contextMenu.show"
      class="fixed z-50 w-40 bg-[#0F172A] border border-gray-700 rounded shadow-lg text-sm overflow-hidden"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y - 15 }px` }"
    >
      <!-- 关闭 -->
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
      <!-- 固定/取消固定 -->
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
      <!-- 重新加载 -->
      <div
        class="px-3 py-2 hover:bg-[#0F3B6E] hover:text-white cursor-pointer transition-colors flex items-center gap-2"
        @click="reloadTab(contextMenu.route)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重新加载
      </div>
      <!-- 分割线 -->
      <div class="h-px bg-gray-700 my-1"></div>
      <!-- 关闭左侧标签 -->
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
      <!-- 关闭右侧标签 -->
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
      <!-- 关闭其他标签 -->
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
      <!-- 关闭全部标签 -->
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
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
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

// ==================== 新增拖拽相关状态 ====================
const draggingTab = ref<TabItem | null>(null)

// ==================== 新增核心计算属性 ====================
// 渲染用的Tab列表：Home永远在前 → 固定标签 → 非固定标签
const renderTabsList = computed(() => {
  const homeTab = tabsList.value.find(t => t.route === '/dashboard/overview' || t.route === '/')
  const fixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && t.isFixed)
  const unfixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && !t.isFixed)
  const result = []
  if (homeTab) result.push(homeTab)
  result.push(...fixedTabs)
  result.push(...unfixedTabs)
  return result
})
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

// ==================== 原有方法保留，适配新需求 ====================
// 保存 Tabs 到 sessionStorage
const saveTabsToSession = () => {
  setSessionCache(SessionCacheKey.TABS_LIST, tabsList.value)
  setSessionCache(SessionCacheKey.ACTIVE_TAB_ROUTE, activeTabRoute.value)
}
// 从 sessionStorage 加载 Tabs - 适配固定字段
const loadTabsFromSession = () => {
  const savedTabs = getSessionCache<TabItem[]>(SessionCacheKey.TABS_LIST, [])
  const savedActiveRoute = getSessionCache<string>(SessionCacheKey.ACTIVE_TAB_ROUTE, '')
  
  if (savedTabs.length > 0) {
    // 给历史数据补全固定字段默认值
    tabsList.value = savedTabs.map(t => ({ isFixed: false, ...t }))
    activeTabRoute.value = savedActiveRoute
  } else {
    // 初始化默认 Tab（取第一个菜单的第一个子菜单）
    const defaultMenu = menuList.value[0]
    const defaultTab = defaultMenu.subMenu && defaultMenu.subMenu.length > 0 
      ? { name: defaultMenu.subMenu[0].name, route: defaultMenu.subMenu[0].route, index: defaultMenu.subMenu[0].index, isFixed: false }
      : { name: defaultMenu.name, route: defaultMenu.route, index: defaultMenu.index, isFixed: false }
    tabsList.value = [defaultTab]
    activeTabRoute.value = defaultTab.route
  }
}
// 添加 Tab - 新增默认固定字段
const addTab = (tab: TabItem) => {
  // 检查是否已存在
  const existingTab = tabsList.value.find(t => t.route === tab.route)
  if (!existingTab) {
    tabsList.value.push({ ...tab, isFixed: false })
  }
  // 切换到该 Tab
  activeTabRoute.value = tab.route
  saveTabsToSession()
}
// 移除 Tab - 新增固定标签不可移除逻辑
const removeTab = (route: string) => {
  const index = tabsList.value.findIndex(t => t.route === route)
  if (index === -1) return
  
  // 首页、固定标签不允许移除
  if (route === '/dashboard/overview' || route === '/') return
  const targetTab = tabsList.value[index]
  if (targetTab.isFixed) return
  
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
  contextMenu.value.show = false
}
// 关闭其他 Tabs - 适配固定标签逻辑
const closeOtherTabs = (route: string) => {
  // 保留首页、固定标签、当前标签
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
// 关闭所有Tabs页 - 适配固定标签逻辑
const closeAllTabs = () => {
  // 保留首页、所有固定标签
  const reservedTabs = tabsList.value.filter(t => {
    const isHome = t.route === '/dashboard/overview' || t.route === '/'
    const isFixed = t.isFixed
    return isHome || isFixed
  })
  tabsList.value = reservedTabs
  // 切换到第一个保留的标签
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
// 右键菜单 - 重写位置计算，贴合需求
const openContextMenu = (e: MouseEvent, route: string) => {
  e.preventDefault()
  // 获取当前点击的标签元素，计算精准位置
  const targetElement = e.currentTarget as HTMLElement
  const rect = targetElement.getBoundingClientRect()
  // left位于标签中间，top位于标签底部+10px
  const menuLeft = rect.left + rect.width / 2
  const menuTop = rect.bottom + 10
  contextMenu.value = {
    show: true,
    x: menuLeft,
    y: menuTop,
    route
  }
}
// 点击外部关闭右键菜单
const handleClickOutside = () => {
  contextMenu.value.show = false
}

// ==================== 新增需求方法 ====================
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
  // 先标记一下当前要刷新的路由
  const targetRoute = route
  // 如果当前就在这个路由上，直接强制刷新组件
  if (activeTabRoute.value === targetRoute) {
    forceRefreshPage()
  } else {
    // 如果不在，先跳过去再刷新 (双重保险)
    router.push(targetRoute).then(() => {
      // 等路由跳转完成后，强制刷新页面组件
      setTimeout(() => {
        forceRefreshPage()
      }, 50)
    })
  }
}

// 关闭左侧标签
const closeLeftTabs = (route: string) => {
  const currentIndex = contextTabUnfixedIndex.value
  if (currentIndex <= 0) return
  // 关闭当前标签左侧所有非固定标签
  const toCloseRoutes = unfixedTabs.value.slice(0, currentIndex).map(t => t.route)
  toCloseRoutes.forEach(routeKey => removeTab(routeKey))
  contextMenu.value.show = false
}
// 关闭右侧标签
const closeRightTabs = (route: string) => {
  const currentIndex = contextTabUnfixedIndex.value
  if (currentIndex === -1 || currentIndex >= unfixedTabs.value.length - 1) return
  // 关闭当前标签右侧所有非固定标签
  const toCloseRoutes = unfixedTabs.value.slice(currentIndex + 1).map(t => t.route)
  toCloseRoutes.forEach(routeKey => removeTab(routeKey))
  contextMenu.value.show = false
}

// ==================== 拖拽相关方法 - 完全优化版 ====================
// 开始拖拽
const handleDragStart = (tab: TabItem, e: DragEvent) => {
  draggingTab.value = tab
  ;(e.target as HTMLElement).style.opacity = '0.5'
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

// 拖拽悬浮（在标签上）
const handleDragOver = (e: DragEvent, targetTab: TabItem) => {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  // 仅允许同类型标签（固定/非固定）之间拖拽
  if (draggingTab.value?.isFixed !== targetTab.isFixed) return
  // 首页标签不允许被拖拽覆盖
  if (targetTab.route === '/dashboard/overview' || targetTab.route === '/') return
}

// 拖拽放下（在标签上）- 优化：根据鼠标位置判断插左边还是右边
const handleDrop = (targetTab: TabItem, e: DragEvent) => {
  if (!draggingTab.value) return
  
  // 校验：1. 不是自己 2. 类型相同（固定/非固定） 3. 不是首页
  if (
    draggingTab.value.route === targetTab.route ||
    draggingTab.value.isFixed !== targetTab.isFixed ||
    targetTab.route === '/dashboard/overview' || targetTab.route === '/'
  ) {
    return
  }

  // 获取目标元素的位置信息
  const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  // 计算鼠标在目标标签中的水平中心位置
  const mouseX = e.clientX
  const targetMiddleX = targetRect.left + targetRect.width / 2
  
  // 1. 先找到拖拽标签在原数组中的位置
  const dragIndex = tabsList.value.findIndex(t => t.route === draggingTab.value!.route)
  // 2. 找到目标标签在原数组中的位置
  const targetIndex = tabsList.value.findIndex(t => t.route === targetTab.route)

  if (dragIndex === -1 || targetIndex === -1) return

  // 3. 把拖拽标签从原位置取出来
  const [movedTab] = tabsList.value.splice(dragIndex, 1)
  
  // 4. 计算插入位置
  let insertIndex: number
  // 如果原来的位置在目标前面，取出来后数组长度变了，目标索引要先减1
  const adjustedTargetIndex = dragIndex < targetIndex ? targetIndex - 1 : targetIndex
  
  // 5. 根据鼠标位置决定插左边还是右边
  if (mouseX < targetMiddleX) {
    // 鼠标在目标左半部分，插入到目标左边
    insertIndex = adjustedTargetIndex
  } else {
    // 鼠标在目标右半部分，插入到目标右边
    insertIndex = adjustedTargetIndex + 1
  }
  
  // 6. 把拖拽标签插入到新位置
  tabsList.value.splice(insertIndex, 0, movedTab)
  
  // 7. 保存到sessionStorage
  saveTabsToSession()
}

// 拖拽悬浮（在容器空白处）
const handleContainerDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!draggingTab.value) return
  e.dataTransfer!.dropEffect = 'move'
}

// 拖拽放下（在容器空白处）- 新增：拖到最后
const handleContainerDrop = (e: DragEvent) => {
  if (!draggingTab.value) return
  
  // 首页不处理
  if (draggingTab.value.route === '/dashboard/overview' || draggingTab.value.route === '/') return
  
  // 1. 找到拖拽标签在原数组中的位置
  const dragIndex = tabsList.value.findIndex(t => t.route === draggingTab.value!.route)
  if (dragIndex === -1) return

  // 2. 把拖拽标签从原位置取出来
  const [movedTab] = tabsList.value.splice(dragIndex, 1)
  
  // 3. 找到对应区域的最后位置插入
  // 先重新获取一下当前的列表状态（因为上面splice改变了数组）
  const currentHomeTab = tabsList.value.find(t => t.route === '/dashboard/overview' || t.route === '/')
  const currentFixedTabs = tabsList.value.filter(t => !(t.route === '/dashboard/overview' || t.route === '/') && t.isFixed)
  
  let insertIndex: number
  if (movedTab.isFixed) {
    // 如果是固定标签，插入到固定标签区域的最后（也就是Home后面 + 固定标签数量）
    insertIndex = (currentHomeTab ? 1 : 0) + currentFixedTabs.length
  } else {
    // 如果是非固定标签，插入到整个数组的最后
    insertIndex = tabsList.value.length
  }
  
  // 4. 插入
  tabsList.value.splice(insertIndex, 0, movedTab)
  
  // 5. 保存
  saveTabsToSession()
}

// 拖拽结束
const handleDragEnd = (e: DragEvent) => {
  ;(e.target as HTMLElement).style.opacity = '1'
  draggingTab.value = null
}

// 监听路由变化，添加新 Tab
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