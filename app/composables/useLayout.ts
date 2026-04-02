// composables/useLayout.ts
import type { LayoutMode, ThemeMode, MenuItem } from './types' // 先建个类型文件，也可以直接写在这

// 先定义类型（单独建文件 or 写这里都可以）
export type LayoutMode = 'sidebar' | 'fullscreen'
export type ThemeMode = 'dark' | 'light'
export interface MenuItem {
  name: string
  route: string
  icon: string
  index: number
}

// Nuxt3全局状态：用useState保证唯一实例
export const useLayout = () => {
  // 布局模式：sidebar侧边导航 / fullscreen大屏模式（全局唯一）
  const layoutMode = useState<LayoutMode>('layoutMode', () => 'fullscreen')
  // 主题（全局唯一）
  const theme = useState<ThemeMode>('theme', () => 'dark')
  // 侧边栏折叠状态（全局唯一）
  const sidebarCollapsed = useState<boolean>('sidebarCollapsed', () => false)
  // 当前激活的菜单（全局唯一）
  const activeMenu = useState<MenuItem>('activeMenu', () => ({} as MenuItem))
  // 菜单列表（全局唯一）
  const menuList = useState<MenuItem[]>('menuList', () => [
    { name: '首页', route: '/', icon: 'Home', index: 0 },
    { name: '能源管理', route: '/energy', icon: 'Zap', index: 1 },
    { name: '储能管理', route: '/storage', icon: 'Battery', index: 2 },
    { name: '负荷管理', route: '/load', icon: 'Activity', index: 3 },
    { name: '预测管理', route: '/forecast', icon: 'TrendingUp', index: 4 },
    { name: '策略管理', route: '/strategy', icon: 'Sliders', index: 5 },
    { name: '能碳管理', route: '/carbon', icon: 'Cloud', index: 6 },
    { name: '电力交易', route: '/trade', icon: 'BarChart3', index: 7 },
    { name: '基础设置', route: '/base', icon: 'Settings', index: 8 },
    { name: '系统设置', route: '/system', icon: 'Shield', index: 9 },
  ])

  // 设置布局模式（点击立即生效）
  const setLayoutMode = (mode: LayoutMode) => {
    layoutMode.value = mode
  }
  // 设置主题
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
  }
  // 切换侧边栏展开/收起
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  // 新增标签页
  const addTab = (item: MenuItem) => {
    activeMenu.value = item
  }

  return {
    layoutMode: readonly(layoutMode), // 只读暴露，防止直接修改
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