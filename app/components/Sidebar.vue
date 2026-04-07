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

    <!-- 菜单列表：恢复原有逻辑，只显示当前Header选中菜单的子菜单 -->
    <nav v-if="currentSubMenu.length > 0" class="flex-1 overflow-y-auto py-0 px-3 bg-transparent -mt-[2px]">
      <div
        v-for="item in currentSubMenu"
        :key="item.route"
        class="relative mb-1 w-full"
      >
        <!-- 没有子菜单的项（如原来的储能监测）：直接点击跳转 -->
        <div
          v-if="!item.subMenu || !item.subMenu.length"
          class="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200"
          :class="[
            activeSubMenu.route === item.route
              ? 'bg-[#32AFFF] text-[#FFFFFF] text-[14px]'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          ]"
          @click="handleSubMenuClick(item)"
        >
          <component :is="menuIconMap[item.icon]" class="w-[14px] h-[14px] shrink-0" />
          <span class="text-sm font-medium -ml-1">{{ item.name }}</span>
        </div>

        <!-- 一级子菜单（如光伏监测）：有子菜单则可折叠 -->
        <template v-else >
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
          <!-- 折叠箭头：仅当有下一级子菜单时显示 -->
          <svg 
            v-if="item.subMenu && item.subMenu.length"
            class="w-4 h-4 transition-transform duration-200"
            :class="expandedMenus.includes(item.route) ? 'rotate-0' : 'rotate-180'"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <!-- 二级子菜单（如光伏总览）：展开时显示 -->
        <transition name="menu-expand">
          <div 
            v-if="item.subMenu && item.subMenu.length && expandedMenus.includes(item.route)"
            class="mt-1 ml-2 flex flex-col gap-1"
          >
            <div
              v-for="subItem in item.subMenu"
              :key="subItem.route"
              class="relative w-full px-4 py-2 rounded-lg cursor-pointer group transition-all duration-200"
              :class="[
                activeSubMenu.route === subItem.route
                  ? 'bg-[#00B0FF] text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              ]"
              @click="handleSubMenuClick(subItem)"
            >
              <span class="text-sm">{{ subItem.name }}</span>
            </div>
          </div>
        </transition>
        </template>

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
const { activeMenu, sidebarCollapsed, menuList } = layoutState
const router = useRouter()
const route = useRoute()

const activeSubMenu = ref<any>({} as any)
const expandedMenus = ref<string[]>([])

// ========== 恢复原有核心逻辑：只显示当前Header选中菜单的子菜单 ==========
const currentSubMenu = computed(() => {
  if (!activeMenu.value) return []
  const currentMenu = menuList.value.find((m: any) => m.route === activeMenu.value.route)
  if (!currentMenu || !currentMenu.subMenu) return []
  return currentMenu.subMenu
})

// 切换父菜单折叠/展开
const toggleMenuExpand = (route: string) => {
  const index = expandedMenus.value.indexOf(route)
  index > -1 ? expandedMenus.value.splice(index, 1) : expandedMenus.value.push(route)
}

// 点击父菜单（如光伏监测）：如果有子菜单则折叠，没有则跳转
const handleParentClick = (item: any) => {
  if (item.subMenu && item.subMenu.length) {
    toggleMenuExpand(item.route)
    // 如果有默认子路由，也可以自动跳转到第一个子菜单
    if (!expandedMenus.value.includes(item.route)) return
    const firstChild = item.subMenu[0]
    if (firstChild) {
      handleSubMenuClick(firstChild)
    }
  } else {
    handleSubMenuClick(item)
  }
}

// 点击子菜单（如光伏总览）：跳转路由
const handleSubMenuClick = (subItem: any) => {
  activeSubMenu.value = subItem
  router.push(subItem.route)
}

// 判断父菜单是否高亮（如果它的子菜单被选中）
const isParentActive = (item: any) => {
  if (!item.subMenu) return activeSubMenu.value.route === item.route
  return item.subMenu.some((sub: any) => sub.route === activeSubMenu.value.route)
}

// 初始化：根据路由自动匹配并展开对应菜单
const initActiveSubMenu = () => {
  const currentPath = route.path
  let findItem: any = null
  let findParent: any = null

  // 在当前显示的子菜单中查找
  for (const item of currentSubMenu.value) {
    if (item.route === currentPath) {
      findItem = item
      break
    }
    if (item.subMenu) {
      const sub = item.subMenu.find((s: any) => s.route === currentPath)
      if (sub) {
        findItem = sub
        findParent = item
        break
      }
    }
  }

  if (findItem) {
    activeSubMenu.value = findItem
    if (findParent && !expandedMenus.value.includes(findParent.route)) {
      expandedMenus.value.push(findParent.route)
    }
  } else if (currentSubMenu.value.length > 0) {
    // 默认选中第一个
    const firstItem = currentSubMenu.value[0]
    if (firstItem.subMenu && firstItem.subMenu.length) {
      activeSubMenu.value = firstItem.subMenu[0]
      expandedMenus.value.push(firstItem.route)
      router.push(firstItem.subMenu[0].route)
    } else {
      activeSubMenu.value = firstItem
      router.push(firstItem.route)
    }
  }
}

// 监听逻辑完全保留
watch([activeMenu, currentSubMenu], () => {
  // initActiveSubMenu()
}, { immediate: true })

watch(() => route.path, () => {
  // initActiveSubMenu()
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