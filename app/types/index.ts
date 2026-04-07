
export type LayoutMode = 'sidebar' | 'fullscreen'
export type ThemeMode = 'dark' | 'light'

export interface MenuItem {
  name: string
  route: string
  icon?: string
  index: number
  subMenu?: SubMenuItem[]
}

export interface SubMenuItem {
  name: string
  route: string
  icon?: string
  index: number
  subMenu?: SubMenuItem[]
}