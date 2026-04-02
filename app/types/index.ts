
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