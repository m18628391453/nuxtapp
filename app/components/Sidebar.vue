<template>
  <aside
    class="fixed left-0 top-0 h-full border-r border-gray-800/80 z-[999] flex flex-col transition-all duration-300"
    :class="{ '-translate-x-full': sidebarCollapsed }"
    :style="{ 
      backgroundImage: `url('/image/matrix.png')`, 
      backgroundSize: '98%',  
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      width: '210px',
      opacity: 0.99 
    }"
  >
    <!-- 顶部Logo：完全保留原有样式 -->
    <div class="h-14 flex items-center justify-center py-2 px-2 shrink-0 bg-transparent">
      <img
        src="/image/logo.png"
        alt="综合能碳Logo"
        class="object-contain"
        style="width: 160px; height: 33px"
      />
    </div>

    <!-- 菜单列表：只显示当前Header选中菜单的子菜单 -->
    <nav v-if="currentSubMenu.length > 0" class="flex-1 overflow-y-auto py-0 px-3 bg-transparent -mt-[2px]">
      <div
        v-for="item in currentSubMenu"
        :key="item.route"
        class="relative mb-1 w-full"
      >
        <!-- 有子菜单的项：点击折叠/展开 -->
        <template v-if="item.subMenu && item.subMenu.length">
          <div
            class="flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200"
            :class="[
              isParentActive(item) 
                ? 'text-white bg-white/5' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            ]"
            @click="handleParentClick(item)"
          >
            <div class="flex items-center gap-3">
              <component v-if="item.icon" :is="menuIconMap[item.icon]" class="w-[14px] h-[14px] shrink-0" />
              <span class="text-sm font-medium -ml-1">{{ item.name }}</span>
            </div>
            <!-- 折叠箭头 -->
            <svg 
              class="w-4 h-4 transition-transform duration-200"
              :class="expandedMenus.includes(item.route) ? 'rotate-0' : '-rotate-90'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- 二级子菜单：展开时显示 -->
          <transition name="menu-expand">
            <div 
              v-if="expandedMenus.includes(item.route)"
              class="mt-1 ml-4 flex flex-col gap-1"
            >
              <div
                v-for="subItem in item.subMenu"
                :key="subItem.route"
                class="relative w-full px-4 py-2 rounded-lg cursor-pointer group transition-all duration-200"
                :class="[
                  activeSubMenuRoute === subItem.route
                    ? 'bg-[#00B0FF] text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                ]"
                @click="handleLeafNodeClick(subItem)"
              >
                <span class="text-sm">{{ subItem.name }}</span>
              </div>
            </div>
          </transition>
        </template>

        <!-- 没有子菜单的叶子节点：直接点击跳转 -->
        <div
          v-else
          class="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200"
          :class="[
            activeSubMenuRoute === item.route
              ? 'bg-[#32AFFF] text-[#FFFFFF] text-[14px]'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          ]"
          @click="handleLeafNodeClick(item)"
        >
          <component :is="menuIconMap[item.icon]" class="w-[14px] h-[14px] shrink-0" />
          <span class="text-sm font-medium -ml-1">{{ item.name }}</span>
        </div>
      </div>
    </nav>

    <div v-else class="flex-1 flex items-center justify-center text-gray-500 text-sm">
      暂无子菜单
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, Zap, Battery, Activity, TrendingUp, Sliders, Cloud, BarChart3, Settings, Shield, TvMinimal, Monitor, Sun, Wind } from 'lucide-vue-next'

const menuIconMap: Record<string, any> = {
  Home, Zap, Battery, Activity, TrendingUp, Sliders, Cloud, BarChart3, Settings, Shield, TvMinimal, Monitor, Sun, Wind
}

const layoutState = inject('layoutState') as any
const layoutActions = inject('layoutActions') as any
const { activeMenu, sidebarCollapsed, menuList } = layoutState
const { forceRefreshPage } = layoutActions
const router = useRouter()
const route = useRoute()

// 当前选中的子菜单路由（只记录叶子节点）
const activeSubMenuRoute = ref<string>('')
// 展开的菜单路由集合（各自独立）
const expandedMenus = ref<string[]>([])

// ========== 核心逻辑：只显示当前Header选中菜单的子菜单 ==========
const currentSubMenu = computed(() => {
  if (!activeMenu.value) return []
  const currentMenu = menuList.value.find((m: any) => m.route === activeMenu.value.route)
  if (!currentMenu || !currentMenu.subMenu) return []
  return currentMenu.subMenu
})

// 判断父菜单是否高亮（如果它的子菜单被选中）
const isParentActive = (item: any) => {
  if (!item.subMenu) return activeSubMenuRoute.value === item.route
  return item.subMenu.some((sub: any) => sub.route === activeSubMenuRoute.value)
}

// 切换父菜单折叠/展开（各自独立，不影响其他）
const toggleMenuExpand = (route: string) => {
  const index = expandedMenus.value.indexOf(route)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(route)
  }
}

// 点击父菜单：只做折叠/展开，不自动跳转
const handleParentClick = (item: any) => {
  toggleMenuExpand(item.route)
}

// 点击叶子节点：跳转路由 + 通知MenuTabs添加/切换Tab
const handleLeafNodeClick = (subItem: any) => {
  // 更新选中状态
  activeSubMenuRoute.value = subItem.route
  
  // 触发自定义事件，让父组件（layout）通知MenuTabs添加Tab
  // 使用window事件或者通过provide/inject
  const event = new CustomEvent('add-tab', { 
    detail: { 
      name: subItem.name, 
      route: subItem.route, 
      index: subItem.index 
    } 
  })
  window.dispatchEvent(event)
  
  // 跳转路由
  router.push(subItem.route)
}

// 监听路由变化，更新activeSubMenuRoute
watch(() => route.path, (newPath) => {
  // 在currentSubMenu中查找匹配的路由
  let found = false
  
  for (const item of currentSubMenu.value) {
    // 检查一级叶子节点
    if (item.route === newPath && (!item.subMenu || !item.subMenu.length)) {
      activeSubMenuRoute.value = newPath
      found = true
      break
    }
    // 检查二级子菜单
    if (item.subMenu && item.subMenu.length) {
      const subFound = item.subMenu.find((sub: any) => sub.route === newPath)
      if (subFound) {
        activeSubMenuRoute.value = newPath
        found = true
        break
      }
    }
  }
  
  // 如果没找到，清空选中状态（不清空，保持上次）
  // 不自动选中任何菜单，让用户手动选择
}, { immediate: true })

// 监听activeMenu变化：只更新Sidebar内容，不做自动跳转
watch(() => activeMenu.value, (newMenu, oldMenu) => {
  if (newMenu && newMenu.route !== oldMenu?.route) {
    // 清空展开状态（可选：保留或者清空）
    // expandedMenus.value = []
    // 清空选中状态，让用户重新选择
    activeSubMenuRoute.value = ''
  }
})

// 初始化：根据当前路由设置选中状态（但不要自动跳转）
onMounted(() => {
  const currentPath = route.path
  
  for (const item of currentSubMenu.value) {
    if (item.route === currentPath && (!item.subMenu || !item.subMenu.length)) {
      activeSubMenuRoute.value = currentPath
      break
    }
    if (item.subMenu && item.subMenu.length) {
      const subFound = item.subMenu.find((sub: any) => sub.route === currentPath)
      if (subFound) {
        activeSubMenuRoute.value = currentPath
        break
      }
    }
  }
})
</script>

<style scoped>
/* 原有滚动条样式完全保留 */
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

/* 折叠动画 */
.menu-expand-enter-from,
.menu-expand-leave-to {
  opacity: 0;
  height: 0;
  overflow: hidden;
}
.menu-expand-enter-active,
.menu-expand-leave-active {
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}
</style>