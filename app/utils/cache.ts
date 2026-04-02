// utils/cache.ts
export const CacheKey = {
    LAYOUT_MODE: 'layoutMode',
    THEME: 'theme',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
    ACTIVE_MENU: 'activeMenu'
  }
  
  // 获取缓存
  export const getCache = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue // 防止服务端报错
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error(`读取缓存失败: ${key}`, e)
      return defaultValue
    }
  }
  
  // 设置缓存
  export const setCache = (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`写入缓存失败: ${key}`, e)
    }
  }