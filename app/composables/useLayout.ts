import { ref, computed } from 'vue'

// 定义菜单项的类型接口
export interface MenuItem {
  name: string
  index: number
  route: string
  icon: string
}

// 定义布局模式的联合类型
export type LayoutMode = 'fullscreen' | 'sidebar'
export type ThemeMode = 'dark' | 'light'

// 全局布局状态
export const useLayout = () => {
  // ===================== 核心状态 =====================
  const layoutMode = ref<LayoutMode>('fullscreen')
  const theme = ref<ThemeMode>('dark')
  const sidebarCollapsed = ref<boolean>(false)

  // ===================== 统一菜单数据 =====================
  const menuList = ref<MenuItem[]>([
    { name: '首页', index: 0, route: '/', icon: 'Home' },
    { name: '能源管理', index: 1, route: '/energy', icon: 'Zap' },
    { name: '储能管理', index: 2, route: '/storage', icon: 'Battery' },
    { name: '负荷管理', index: 3, route: '/load', icon: 'Activity' },
    { name: '预测管理', index: 4, route: '/forecast', icon: 'TrendingUp' },
    { name: '策略管理', index: 5, route: '/strategy', icon: 'Sliders' },
    { name: '能碳管理', index: 6, route: '/carbon', icon: 'Cloud' },
    { name: '电力交易', index: 7, route: '/trading', icon: 'BarChart3' },
    { name: '基础设置', index: 8, route: '/settings/basic', icon: 'Settings' },
    { name: '管理设置', index: 9, route: '/settings/management', icon: 'Shield' }
  ])

  // ===================== 标签页(Tab栏)相关状态 =====================
  const tabsList = ref<MenuItem[]>([])
  const activeTabRoute = ref<string>('')

  // ===================== 计算属性 =====================
  const activeMenu = computed<MenuItem>(() => {
    return menuList.value.find(item => item.route === activeTabRoute.value) || menuList.value[0]
  })

  // ===================== 核心方法 =====================
  const setLayoutMode = (mode: LayoutMode): void => {
    layoutMode.value = mode
  }

  const setTheme = (mode: ThemeMode): void => {
    theme.value = mode
  }

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // ===================== 标签页操作方法 =====================
  const addTab = (menuItem: MenuItem): void => {
    if (menuItem.route === '/') {
      activeTabRoute.value = '/'
      return
    }
    const hasTab = tabsList.value.some(tab => tab.route === menuItem.route)
    if (!hasTab) {
      tabsList.value.push({ ...menuItem })
    }
    activeTabRoute.value = menuItem.route
  }

  const removeTab = (route: string): void => {
    if (route === '/') return
    const tabIndex = tabsList.value.findIndex(tab => tab.route === route)
    if (tabIndex === -1) return

    tabsList.value.splice(tabIndex, 1)

    if (route === activeTabRoute.value) {
      const lastTab = tabsList.value[tabsList.value.length - 1]
      activeTabRoute.value = lastTab ? lastTab.route : '/'
    }
  }

  const closeOtherTabs = (route: string): void => {
    const targetTab = tabsList.value.find(tab => tab.route === route)
    if (targetTab) {
      tabsList.value = [targetTab]
      activeTabRoute.value = targetTab.route
    }
  }

  const closeAllTabs = (): void => {
    tabsList.value = []
    activeTabRoute.value = '/'
  }

  const initTabs = (): void => {
    tabsList.value = [menuList.value[0]]
    activeTabRoute.value = '/'
  }

  return {
    // 状态
    layoutMode,
    theme,
    sidebarCollapsed,
    menuList,
    tabsList,
    activeTabRoute,
    // 计算属性
    activeMenu,
    // 方法
    setLayoutMode,
    setTheme,
    toggleSidebar,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
    initTabs
  }
}