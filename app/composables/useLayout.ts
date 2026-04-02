// composables/useLayout.ts
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

// 从localStorage读取数据的工具函数
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (process.client) { // 仅客户端执行localStorage操作
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error(`读取localStorage失败: ${key}`, e)
      return defaultValue
    }
  }
  return defaultValue
}

// 写入localStorage的工具函数
const setStorageItem = (key: string, value: any) => {
  if (process.client) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`写入localStorage失败: ${key}`, e)
    }
  }
}

export const useLayout = () => {
  // 布局模式：从localStorage读取初始值
  const layoutMode = useState<LayoutMode>('layoutMode', () => 
    getStorageItem<LayoutMode>('layoutMode', 'fullscreen')
  )
  
  // 主题：从localStorage读取初始值
  const theme = useState<ThemeMode>('theme', () => 
    getStorageItem<ThemeMode>('theme', 'dark')
  )
  
  // 侧边栏折叠状态：从localStorage读取初始值
  const sidebarCollapsed = useState<boolean>('sidebarCollapsed', () => 
    getStorageItem<boolean>('sidebarCollapsed', false)
  )
  
  // 当前激活的菜单：从localStorage读取初始值
  const activeMenu = useState<MenuItem>('activeMenu', () => 
    getStorageItem<MenuItem>('activeMenu', { 
      name: '首页', 
      route: '/', 
      icon: 'Home', 
      index: 0,
      subMenu: [
        { name: '综合看板', route: '/dashboard/overview', index: 0 },
        { name: '能源看板', route: '/dashboard/energy', index: 1 }
      ]
    })
  )
  
  // 菜单列表（全局唯一）
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

  // 设置布局模式（同步到localStorage）
  const setLayoutMode = (mode: LayoutMode) => {
    layoutMode.value = mode
    setStorageItem('layoutMode', mode)
  }
  
  // 设置主题（同步到localStorage）
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    setStorageItem('theme', mode)
  }
  
  // 切换侧边栏展开/收起（同步到localStorage）
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    setStorageItem('sidebarCollapsed', sidebarCollapsed.value)
  }
  
  // 新增标签页（设置激活菜单，同步到localStorage）
  const addTab = (item: MenuItem) => {
    activeMenu.value = item
    setStorageItem('activeMenu', item)
  }

  return {
    layoutMode: readonly(layoutMode), 
    theme: readonly(theme),
    sidebarCollapsed: readonly(sidebarCollapsed),
    activeMenu: readonly(activeMenu),
    menuList: readonly(menuList),
    setLayoutMode,
    setTheme,
    toggleSidebar,
    addTab
  }
}