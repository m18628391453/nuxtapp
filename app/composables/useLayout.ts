// composables/useLayout.ts
import { onMounted } from 'vue'
import type { LayoutMode, ThemeMode, MenuItem, SubMenuItem } from './types'

export type LayoutMode = 'sidebar' | 'fullscreen'
export type ThemeMode = 'dark' | 'light'

export interface SubMenuItem {
  name: string
  route: string
  index: number
}

export interface MenuItem {
  name: string
  route: string
  icon: string
  index: number
  subMenu?: SubMenuItem[]
}

// 内部工具：安全读取 localStorage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (process.client) {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item) as T
      }
    } catch (e) {
      console.error(`读取存储失败: ${key}`, e)
    }
  }
  return defaultValue
}

// 内部工具：安全写入 localStorage
const setStorageItem = (key: string, value: any) => {
  if (process.client) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`写入存储失败: ${key}`, e)
    }
  }
}

// 定义一个全局变量记录是否已经同步过本地数据，防止重复触发
let isSynced = false

export const useLayout = () => {
  // 1. 使用 Nuxt 的 useState 定义响应式状态
  // 初始值务必与服务端渲染保持一致，防止水合报错
  const layoutMode = useState<LayoutMode>('layoutMode', () => 'fullscreen')
  const theme = useState<ThemeMode>('theme', () => 'dark')
  const sidebarCollapsed = useState<boolean>('sidebarCollapsed', () => false)
  
  const activeMenu = useState<MenuItem>('activeMenu', () => ({ 
    name: '首页', 
    route: '/', 
    icon: 'Home', 
    index: 0,
    subMenu: [
      { name: '综合看板', route: '/dashboard/overview', index: 0 },
      { name: '能源看板', route: '/dashboard/energy', index: 1 }
    ]
  }))

  const menuList = useState<MenuItem[]>('menuList', () => [
    { 
      name: '首页', 
      route: '/', 
      icon: 'Home', 
      index: 0,
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

  // 2. 关键修复：在组件挂载前或挂载时，强制同步本地缓存
  // 这能确保客户端渲染时，Dashboard 布局能拿到正确的值来计算 ml-60
  const initFromStorage = () => {
    if (process.client && !isSynced) {
      layoutMode.value = getStorageItem<LayoutMode>('layoutMode', 'fullscreen')
      theme.value = getStorageItem<ThemeMode>('theme', 'dark')
      sidebarCollapsed.value = getStorageItem<boolean>('sidebarCollapsed', false)
      
      const storedActive = getStorageItem<MenuItem | null>('activeMenu', null)
      if (storedActive) {
        activeMenu.value = storedActive
      }
      isSynced = true
    }
  }

  // 在初始化时尝试同步（针对后续调用）
  initFromStorage()

  // 3. 操作方法
  const setLayoutMode = (mode: LayoutMode) => {
    layoutMode.value = mode
    setStorageItem('layoutMode', mode)
  }
  
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    setStorageItem('theme', mode)
  }
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    setStorageItem('sidebarCollapsed', sidebarCollapsed.value)
  }
  
  const addTab = (item: MenuItem) => {
    activeMenu.value = item
    setStorageItem('activeMenu', item)
  }

  return {
    layoutMode, // 这里不使用 readonly，确保在 layout 中能保持高度响应
    theme,
    sidebarCollapsed,
    activeMenu,
    menuList,
    setLayoutMode,
    setTheme,
    toggleSidebar,
    addTab,
    initFromStorage // 导出初始化函数，备用
  }
}