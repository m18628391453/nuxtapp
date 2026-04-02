<template>
  <aside
    class="fixed left-0 top-0 h-full w-60 bg-[#0A162C] border-r border-gray-800/50 z-[999] flex flex-col transition-all duration-300"
    :class="{ '-translate-x-full': sidebarCollapsed }"
  >
    <!-- 顶部Logo区域：保留原有样式 -->
    <div class="h-15 flex items-center justify-center py-2 px-2 border-b border-gray-800/50 shrink-0 ">
      <img
        src="/image/logo.png"
        alt="综合能碳Logo"
        class="object-contain"
        style="width: 160px; height: 35px"
      />
    </div>

    <!-- 菜单列表：只显示当前激活菜单的子菜单 -->
    <nav v-if="currentSubMenu.length > 0" class="flex-1 overflow-y-auto py-4 px-3">
      <div
        v-for="item in currentSubMenu"
        :key="item.route"
        class="relative mb-1 rounded-lg cursor-pointer group transition-all duration-200"
        :class="[
          activeSubMenu.route === item.route
            ? 'bg-[#32AFFF]/15 text-[#32AFFF]'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        ]"
        @click="handleSubMenuClick(item)"
      >
        <div class="flex items-center gap-3 px-4 py-3">
          <!-- 子菜单名称 -->
          <span class="text-sm font-medium">
            {{ item.name }}
          </span>
        </div>
      </div>
    </nav>
    <!-- 没有子菜单时显示提示 -->
    <div v-else class="flex-1 flex items-center justify-center text-gray-500 text-sm">
      暂无子菜单
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { useRouter } from 'vue-router'

// 从父组件注入状态
const layoutState = inject('layoutState') as any
const { activeMenu, sidebarCollapsed } = layoutState

const router = useRouter()

// 保留原有激活子菜单逻辑
const activeSubMenu = ref<any>({} as any)

// 保留原有计算属性
const currentSubMenu = computed(() => {
  if (!activeMenu.value || !activeMenu.value.subMenu) return []
  return activeMenu.value.subMenu
})

// 保留原有子菜单点击逻辑
const handleSubMenuClick = (subItem: any) => {
  activeSubMenu.value = subItem
  router.push(subItem.route)
}

// 保留原有初始化逻辑
const initActiveSubMenu = () => {
  if (currentSubMenu.value.length > 0) {
    activeSubMenu.value = currentSubMenu.value[0]
  }
}

// 保留原有监听逻辑
watch([activeMenu, currentSubMenu], () => {
  initActiveSubMenu()
}, { immediate: true })
</script>

<style scoped>
/* 滚动条美化：保留原有样式 */
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