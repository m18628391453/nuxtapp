// composables/useRequest.ts
import type { UseFetchOptions } from 'nuxt/app'

// 定义响应数据的通用类型（根据你后端实际结构改）
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

export function useRequest() {
  const config = useRuntimeConfig()

  // --- 基础请求函数 ---
  const request = async <T>(
    url: string,
    options: UseFetchOptions<ApiResponse<T>> = {}
  ) => {
    // 合并默认配置
    const defaultOptions: UseFetchOptions<ApiResponse<T>> = {
      baseURL: config.public.baseURL as string, // 从配置里拿基础地址
      headers: {
        'Content-Type': 'application/json',
        'version': '9.9.9',
        ...options.headers // 允许覆盖默认头
      },

      // --- 请求拦截器（比如加 Token） ---
      onRequest({ options }) {
        // 假设你的 Token 存在 Cookie 里
        const token = useCookie('auth_token')
        if (token.value) {
          options.headers = options.headers || {}
        }
      },

      // --- 响应拦截器（处理数据） ---
      onResponse({ response }) {
        // 假设后端返回 { code: 200, data: {}, message: 'success' }
        const res = response._data as ApiResponse<T>
        
        // 这里可以根据你后端的 code 判断成功失败
        if (res.code !== 200) {
          console.error('接口报错啦:', res.message)
          // 可以在这里弹个 Toast 提示错误
          throw new Error(res.message || '请求失败')
        }
        
        return res.data // 直接把 data 抛出去，组件里不用再 .data
      },

      // --- 错误处理 ---
      onResponseError({ response }) {
        console.error('网络错误:', response?.statusText || '未知错误')
        // 比如 401 未授权就跳登录页
        if (response?.status === 401) {
          navigateTo('/login')
        }
      }
    }

    // 合并用户传的配置
    const mergedOptions = { ...defaultOptions, ...options }

    // 发起请求（用 $fetch，比 useFetch 更灵活，哪里都能用）
    try {
      return await $fetch<ApiResponse<T>>(url, mergedOptions)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // --- 封装具体的请求方法 ---
  return {
    // GET 请求（参数放 url 后面）
    get: <T>(url: string, params?: Record<string, any>, options?: UseFetchOptions<ApiResponse<T>>) => {
      return request<T>(url, { method: 'GET', params, ...options })
    },

    // POST 请求（参数放 body 里）
    post: <T>(url: string, body?: Record<string, any>, options?: UseFetchOptions<ApiResponse<T>>) => {
      return request<T>(url, { method: 'POST', body, ...options })
    },

    // PUT 请求
    put: <T>(url: string, body?: Record<string, any>, options?: UseFetchOptions<ApiResponse<T>>) => {
      return request<T>(url, { method: 'PUT', body, ...options })
    },

    // DELETE 请求
    delete: <T>(url: string, params?: Record<string, any>, options?: UseFetchOptions<ApiResponse<T>>) => {
      return request<T>(url, { method: 'DELETE', params, ...options })
    }
  }
}