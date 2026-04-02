<template>
    <div
      v-if="layoutMode === 'sidebar'"
      class="h-10 bg-[#0D1B32] border-b border-gray-800/50 flex items-center gap-1 px-2 overflow-x-auto whitespace-nowrap z-20"
    >
      <div
        v-for="tab in tabsList"
        :key="tab.route"
        class="relative h-8 flex items-center px-3 rounded cursor-pointer text-sm transition-all"
        :class="[
          activeTabRoute === tab.route
            ? 'bg-[#32AFFF]/20 text-[#32AFFF]'
            : 'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white'
        ]"
        @click="goToTab(tab.route)"
        @contextmenu.prevent="openContextMenu($event, tab.route)"
      >
        <span>{{ tab.name }}</span>
        <!-- 关闭按钮（首页不显示） -->
        <button
          v-if="tab.route !== '/'"
          @click.stop="closeTab(tab.route)"
          class="ml-1.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  
      <!-- 右键菜单 -->
      <div
        v-if="contextMenu.show"
        class="fixed z-50 w-32 bg-[#1A1D24] border border-gray-700 rounded shadow-lg text-sm overflow-hidden"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      >
        <div
          class="px-3 py-2 hover:bg-[#32AFFF]/20 hover:text-white cursor-pointer"
          @click="closeOtherTabs(contextMenu.route)"
        >
          关闭其他
        </div>
        <div
          class="px-3 py-2 hover:bg-[#32AFFF]/20 hover:text-white cursor-pointer"
          @click="closeAllTabs"
        >
          关闭全部
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const {
    layoutMode,
    tabsList,
    activeTabRoute,
    removeTab,
    closeOtherTabs,
    closeAllTabs
  } = useLayout()
  
  // 右键菜单
  const contextMenu = ref({
    show: false,
    x: 0,
    y: 0,
    route: ''
  })
  
  const goToTab = (route: string) => {
    router.push(route)
  }
  
  const closeTab = (route: string) => {
    removeTab(route)
  }
  
  const openContextMenu = (e: MouseEvent, route: string) => {
    contextMenu.value = {
      show: true,
      x: e.clientX,
      y: e.clientY,
      route
    }
  }
  
  // 【关键修正】：点击任意处关闭右键菜单
  // 必须放在 onMounted 里，确保是在浏览器端执行
  const handleClickOutside = () => {
    contextMenu.value.show = false
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  ::-webkit-scrollbar {
    height: 2px;
  }
  ::-webkit-scrollbar-thumb {
    background: #32AFFF;
    border-radius: 1px;
  }
  </style>