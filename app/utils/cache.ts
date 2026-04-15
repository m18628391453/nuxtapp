// utils/cache.ts
export enum CacheKey {
  LAYOUT_MODE = 'LAYOUT_MODE',
  SIDEBAR_COLLAPSED = 'SIDEBAR_COLLAPSED',
  THEME = 'THEME',
  ACTIVE_MENU = 'ACTIVE_MENU'
}

export enum SessionCacheKey {
  TABS_LIST =  'TABS_LIST',
  ACTIVE_TAB_ROUTE = 'ACTIVE_TAB_ROUTE'
}

export const getCache = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  let item: string | null = localStorage.getItem(key)
  try {
    if (item && ((item.startsWith("{") && item.endsWith("}")) || (item.startsWith(`"`) && item.endsWith(`"`)) || (item === 'true' || item === 'false'))) {
      return item ? JSON.parse(item) : item as T;
    } else if (typeof item === 'undefined' || item === null) {
      return defaultValue;
    }
    return item as T;
  } catch (e) {
    console.error(`读取缓存失败: ${key}`, e)
    return defaultValue
  }
}

export const setCache = (key: string, value: any) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`写入缓存失败: ${key}`, e)
  }
}

export const getSessionCache = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error(`读取 sessionStorage 失败: ${key}`, e)
    return defaultValue
  }
}

export const setSessionCache = (key: string, value: any) => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`写入 sessionStorage 失败: ${key}`, e)
  }
}

export const clearTabsSession = () => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(SessionCacheKey.TABS_LIST)
    sessionStorage.removeItem(SessionCacheKey.ACTIVE_TAB_ROUTE)
  } catch (e) {
    console.error(`清除 Tabs sessionStorage 失败`, e)
  }
}