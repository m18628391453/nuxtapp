// composables/useLayout.ts
import { ref, computed } from 'vue'

// 定义类型，不乱码
export type LayoutMode = 'sidebar' | 'fullscreen'
export type ThemeMode = 'dark' | 'light'
export interface MenuItem {
  name: string
  route: string
  icon: string
  index: number
}

// 全局响应式状态，全项目通用
export const useLayout = () => {
  // 布局模式：sidebar侧边导航 / fullscreen大屏模式
  const layoutMode = ref<LayoutMode>('fullscreen')
  // 主题
  const theme = ref<ThemeMode>('dark')
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)
  // 当前激活的菜单
  const activeMenu = ref<MenuItem>({} as MenuItem)
  // 菜单列表（你原来的菜单，直接用就行）
  const menuList = ref<MenuItem[]>([
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

  // 设置布局模式（点击就直接改，立即生效）
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
  // 新增标签页（你原来的逻辑，保留不动）
  const addTab = (item: MenuItem) => {
    activeMenu.value = item
  }

  return {
    layoutMode,
    theme,
    sidebarCollapsed,
    activeMenu,
    menuList,
    setLayoutMode,
    setTheme,
    toggleSidebar,
    addTab
  }
}