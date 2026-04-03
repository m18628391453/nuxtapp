
export type LayoutMode = 'sidebar' | 'fullscreen'
export type ThemeMode = 'dark' | 'light'

export interface SubMenuItem {
  name: string
  route: string
  index: number
  icon?: string
}

export interface MenuItem {
  name: string
  route: string
  index: number
  icon?: string
  subMenu?: SubMenuItem[]
}