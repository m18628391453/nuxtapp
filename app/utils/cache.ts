// utils/cache.ts
export const CacheKey = {
    LAYOUT_MODE: 'layoutMode',
    THEME: 'theme',
    SIDEBAR_COLLAPSED: 'sidebarCollapsed',
    ACTIVE_MENU: 'activeMenu'
}

// sessionStorage 的 key
export const SessionCacheKey = {
    TABS_LIST: 'tabsList',
    ACTIVE_TAB_ROUTE: 'activeTabRoute'
}

// 获取 localStorage 缓存
export const getCache = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (e) {
        console.error(`读取缓存失败: ${key}`, e)
        return defaultValue
    }
}

// 设置 localStorage 缓存
export const setCache = (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error(`写入缓存失败: ${key}`, e)
    }
}

// 获取 sessionStorage 缓存
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

// 设置 sessionStorage 缓存
export const setSessionCache = (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
        sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error(`写入 sessionStorage 失败: ${key}`, e)
    }
}

// 清除 sessionStorage 中的 Tabs 相关数据
export const clearTabsSession = () => {
    if (typeof window === 'undefined') return
    try {
        sessionStorage.removeItem(SessionCacheKey.TABS_LIST)
        sessionStorage.removeItem(SessionCacheKey.ACTIVE_TAB_ROUTE)
    } catch (e) {
        console.error(`清除 Tabs sessionStorage 失败`, e)
    }
}