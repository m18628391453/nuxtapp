<template>
    <header class="relative flex items-center justify-between h-16 px-6 bg-transparent text-white overflow-hidden">
      <!-- 左侧：Logo区域 -->
      <div class="flex items-center gap-10 mt-1">
        <img src="/image/logo.png" alt="综合能碳Logo" class="object-contain shrink-0" style="width: 200px; height: 45px;" />
      </div>
  
      <!-- 菜单+操作区整体容器 -->
      <div class="relative flex items-center justify-between h-full flex-1 ml-50" style="margin-left: 120px;">
        <!-- 底部贯穿下划线 -->
        <div class="absolute bottom-3 -left-3 right-0 h-[1px] bg-gradient-to-r from-blue-500/15 via-blue-500/15 to-blue-500/10 z-0" />
  
        <!-- 中间：导航菜单 -->
        <nav class="flex items-center h-full space-x-1 z-10 -mt-3">
          <div 
            v-for="(item, idx) in navItems" 
            :key="item" 
            class="relative flex items-center h-4/5 m-auto cursor-pointer"
            @click="handleMenuClick(item, idx)"
          >
            <a
              href="javascript:void(0)"
              class="px-4 text-[15px] font-medium italic z-10 relative cursor-pointer font-['PingFang_SC','Microsoft_YaHei_UI',sans-serif] transition-colors duration-200"
              :class="activeIndex === idx ? 'text-cyan-400' : 'text-gray-100 hover:text-cyan-300'"
            >
              {{ item }}
            </a>
            <!-- 选中项背景微光效果 -->
            <div
              v-if="activeIndex === idx"
              class="absolute inset-0 left-[0%] w-7/5 h-full bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent cursor-pointer"
            />
          </div>
        </nav>
  
        <!-- 右侧：操作区与个人信息 -->
        <div class="flex items-center gap-6 z-10 -mt-3 -ml-1">
          <!-- 搜索按钮 -->
          <button 
            class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
            @click="handleSearch"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <!-- 全屏按钮 -->
          <button 
            class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
            @click="toggleFullscreen"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          
          <!-- 用户信息 -->
          <div class="flex items-center gap-2 cursor-pointer group">
            <div class="w-6 h-6 rounded-full overflow-hidden border border-blue-400 group-hover:border-blue-400 transition-colors duration-200">
              <div class="w-full h-full bg-blue-400 flex items-center justify-center text-xs text-[#fefefe] font-bold">
                <UserRound class="w-4 h-4" />
              </div>
            </div>
            <span class="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">管理员</span>
          </div>
          
          <!-- 设置按钮 -->
          <button 
            class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
            @click="handleSettings"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 21.33 21.33">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { UserRound } from 'lucide-vue-next'
  
  // 定义事件
  const emit = defineEmits(['menu-change', 'search', 'settings'])
  
  const navItems = [
    '首页', '能源管理', '储能管理', '负荷管理', '预测管理',
    '策略管理', '能碳管理', '电力交易', '基础设置', '管理设置'
  ]
  
  // 当前选中的菜单索引
  const activeIndex = ref(0)
  
  // 处理菜单点击
  const handleMenuClick = (item, index) => {
    if (activeIndex.value === index) return // 已选中则不做处理
    
    // 更新选中状态
    activeIndex.value = index
    
    // 触发 change 事件，传递菜单名称和索引
    emit('menu-change', { 
      name: item, 
      index: index,
      // 如果需要路由映射，可以在这里添加
      route: getRoutePath(item)
    })
  }
  
  // 菜单到路由的映射（可根据实际需求调整）
  const getRoutePath = (menuName) => {
    const routeMap = {
      '首页': '/',
      '能源管理': '/energy',
      '储能管理': '/storage',
      '负荷管理': '/load',
      '预测管理': '/forecast',
      '策略管理': '/strategy',
      '能碳管理': '/carbon',
      '电力交易': '/trading',
      '基础设置': '/settings/basic',
      '管理设置': '/settings/management'
    }
    return routeMap[menuName] || '/'
  }
  
  // 处理搜索
  const handleSearch = () => {
    // 触发搜索事件，父组件可以监听并处理
    emit('search')
    
    // 也可以直接在这里实现搜索逻辑
    console.log('搜索按钮被点击')
    // 示例：打开搜索弹窗或跳转到搜索页面
    // navigateTo('/search')
  }
  
  // 处理全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // 进入全屏
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`全屏请求失败: ${err.message}`)
      })
    } else {
      // 退出全屏
      document.exitFullscreen()
    }
  }
  
  // 处理设置
  const handleSettings = () => {
    // 触发设置事件
    emit('settings')
    
    // 也可以直接在这里实现设置逻辑
    console.log('设置按钮被点击')
    // 示例：打开设置弹窗或跳转到设置页面
    // navigateTo('/settings')
  }
  
  // 可选：监听全屏变化事件，更新按钮图标样式
  if (typeof window !== 'undefined') {
    document.addEventListener('fullscreenchange', () => {
      // 可以在这里更新全屏按钮的图标样式
      const isFullscreen = !!document.fullscreenElement
      // 你可以通过 ref 来切换图标，这里简单打印
      console.log('全屏状态:', isFullscreen ? '全屏' : '退出全屏')
    })
  }
  </script>
  
  <style scoped>
  /* 添加平滑过渡效果 */
  a, button {
    transition: all 0.2s ease;
  }
  </style>