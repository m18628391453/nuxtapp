<template>
    <aside
      class="fixed left-0 top-0 h-full w-60 bg-[#0A162C] border-r border-gray-800/50 z-[999] flex flex-col transition-all duration-300"
      :class="{ '-translate-x-full': sidebarCollapsed }"
    >
      <!-- 顶部Logo区域 -->
      <div class="h-16 flex items-center justify-center px-4 border-b border-gray-800/50 shrink-0">
        <img
          src="/image/logo.png"
          alt="综合能碳Logo"
          class="object-contain"
          style="width: 160px; height: 40px"
        />
      </div>
  
      <!-- 菜单列表 -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <div
          v-for="item in menuList"
          :key="item.route"
          class="relative mb-1 rounded-lg cursor-pointer group transition-all duration-200"
          :class="[
            activeMenu.route === item.route
              ? 'bg-[#32AFFF]/15 text-[#32AFFF]'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          ]"
          @click="handleMenuClick(item)"
        >
          <div class="flex items-center gap-3 px-4 py-3">
            <!-- 菜单图标 -->
            <component
              :is="menuIconMap[item.icon]"
              class="w-4 h-4 shrink-0"
            />
            <!-- 菜单名称 -->
            <span class="text-sm font-medium">
              {{ item.name }}
            </span>
          </div>
          <!-- 选中项左侧高亮条 -->
          <div
            v-if="activeMenu.route === item.route"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#32AFFF] rounded-r-full"
          />
        </div>
      </nav>
  
      <!-- 底部折叠按钮（后续扩展用） -->
      <div class="h-14 border-t border-gray-800/50 flex items-center justify-center px-4 shrink-0">
        <button
          @click="toggleSidebar"
          class="w-full py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <span class="text-sm">收起菜单</span>
        </button>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  // 导入菜单用到的所有图标（和useLayout里的icon一一对应）
  import {
    Home,
    Zap,
    Battery,
    Activity,
    TrendingUp,
    Sliders,
    Cloud,
    BarChart3,
    Settings,
    Shield
  } from 'lucide-vue-next'
  import { useRouter } from 'vue-router'
  import type { MenuItem } from '~/composables/useLayout'
  
  // 图标映射表，和useLayout里的icon字段完全对应
  const menuIconMap: Record<string, any> = {
    Home,
    Zap,
    Battery,
    Activity,
    TrendingUp,
    Sliders,
    Cloud,
    BarChart3,
    Settings,
    Shield
  }
  
  // 全局布局状态
  const { menuList, activeMenu, addTab, toggleSidebar, sidebarCollapsed } = useLayout()
  // 路由实例
  const router = useRouter()
  
  // 处理菜单点击
  const handleMenuClick = (menuItem: MenuItem) => {
    // 添加标签页
    addTab(menuItem)
    // 跳转路由
    router.push(menuItem.route)
  }
  </script>
  
  <style scoped>
  /* 滚动条美化 */
  nav::-webkit-scrollbar {
    width: 4px;
  }
  nav::-webkit-scrollbar-track {
    background: transparent;
  }
  nav::-webkit-scrollbar-thumb {
    background: rgba(50, 175, 255, 0.2);
    border-radius: 4px;
  }
  nav::-webkit-scrollbar-thumb:hover {
    background: rgba(50, 175, 255, 0.4);
  }
  </style>