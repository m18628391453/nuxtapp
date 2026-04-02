<template>
  <aside
    class="fixed left-0 top-0 h-full w-60 bg-[#0A162C] border-r border-gray-800/50 z-[999] flex flex-col transition-all duration-300"
    :class="{ '-translate-x-full': sidebarCollapsed }"
  >
    <!-- 顶部Logo区域（和Header保持一致） -->
    <div class="h-16 flex items-center justify-center px-4 border-b border-gray-800/50 shrink-0">
      <img
        src="/image/logo.png"
        alt="综合能碳Logo"
        class="object-contain"
        style="width: 160px; height: 40px"
      />
    </div>

    <!-- 子菜单列表：只显示当前选中父菜单的子菜单 -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <!-- 有子菜单的情况 -->
      <template v-if="activeParentMenu.children && activeParentMenu.children.length > 0">
        <div
          v-for="item in activeParentMenu.children"
          :key="item.route"
          class="relative mb-1 rounded-lg cursor-pointer group transition-all duration-200"
          :class="[
            activeChildMenu.route === item.route
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
            v-if="activeChildMenu.route === item.route"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#32AFFF] rounded-r-full"
          />
        </div>
      </template>

      <!-- 无子女菜单的空状态 -->
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
        <svg class="w-12 h-12 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>暂无子菜单</p>
      </div>
    </nav>

    <!-- 底部折叠按钮 -->
    <div class="h-14 border-t border-gray-800/50 flex items-center justify-center px-4 shrink-0">
      <button
        @click="toggleSidebar"
        class="w-full py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        <span class="text-sm">{{ sidebarCollapsed ? '展开菜单' : '收起菜单' }}</span>
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
  Shield,
  LayoutDashboard
} from 'lucide-vue-next'
import { useLayout } from '~/composables/useLayout'
import type { ChildMenuItem } from '~/composables/useLayout'

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
  Shield,
  LayoutDashboard
}

// 全局布局状态
const { activeParentMenu, activeChildMenu, toggleSidebar, sidebarCollapsed, selectChildMenu } = useLayout()

// 处理子菜单点击
const handleMenuClick = (menuItem: ChildMenuItem) => {
  selectChildMenu(menuItem)
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