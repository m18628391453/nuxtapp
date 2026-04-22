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
    <div class="h-14 flex items-center justify-center py-2 px-2 shrink-0 bg-transparent">
      <img
        src="/image/logo.png"
        alt="综合能碳Logo"
        class="object-contain"
        style="width: 160px; height: 33px"
      />
    </div>

    <nav v-if="currentSubMenu.length > 0" class="flex-1 overflow-y-auto py-0 px-3 bg-transparent -mt-[2px]">
      <div
        v-for="item in currentSubMenu"
        :key="item.route"
        class="relative mb-1 w-full"
      >
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

          <transition name="menu-expand">
            <div 
              v-if="expandedMenus.includes(item.route)"
              class="mt-1 ml-4 flex flex-col gap-1"
            >
              <div
                v-for="subItem in item.subMenu"
                :key="subItem.route"
                class="relative w-full px-4 py-1.5 rounded-lg cursor-pointer group transition-all duration-200"
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
import { ref, computed, watch, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Home, Zap, Battery, Activity, TrendingUp, Sliders, Cloud, BarChart3, Settings, Shield, TvMinimal, Boxes, Monitor, Sun, Wind, ChartNoAxesCombined, SolarPanel, Atom, GalleryThumbnails } from 'lucide-vue-next'

const menuIconMap: Record<string, any> = {
  Home, Zap, Battery, Activity, TrendingUp, Sliders, Cloud, BarChart3, Settings, Shield, TvMinimal, Boxes, Monitor, Sun, Wind, ChartNoAxesCombined, SolarPanel, Atom, GalleryThumbnails
}

const layoutState = inject('layoutState') as any
const layoutActions = inject('layoutActions') as any
const { activeMenu, sidebarCollapsed, menuList } = layoutState
// 引入 updateActiveMenu 动作进行 Header 联动同步
const { forceRefreshPage, updateActiveMenu } = layoutActions
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

// ========== 全局菜单递归查找工具 ==========
// 根据当前路由，在完整的 menuList 中深度查出 [顶级模块, 父级菜单, 叶子菜单]
const findMenuPathByRoute = (targetRoute: string) => {
  if (!menuList.value || !menuList.value.length) return null;

  for (const topMenu of menuList.value) {
    // 1. 如果顶级菜单自身即为目标
    if (topMenu.route === targetRoute) {
      return { topMenu, parentRoute: null, leafRoute: targetRoute };
    }
    if (!topMenu.subMenu || !topMenu.subMenu.length) continue;

    for (const subMenu of topMenu.subMenu) {
      // 2. 如果二级菜单是目标
      if (subMenu.route === targetRoute && (!subMenu.subMenu || !subMenu.subMenu.length)) {
        return { topMenu, parentRoute: null, leafRoute: targetRoute };
      }
      if (!subMenu.subMenu || !subMenu.subMenu.length) continue;

      for (const leaf of subMenu.subMenu) {
        // 3. 如果三级菜单（最深层叶子）是目标
        if (leaf.route === targetRoute) {
          return { topMenu, parentRoute: subMenu.route, leafRoute: targetRoute };
        }
      }
    }
  }
  return null;
}

// ========== 监听路由变化，实现 MenuTabs 与 Sidebar/Header 多端联动 ==========
watch(() => route.path, (newPath) => {
  const match = findMenuPathByRoute(newPath);
  
  if (match) {
    // 1. 联动 Header 切换：如果在 Tabs 点击引发的路由模块发生跨越，主动修正全局 activeMenu
    if (!activeMenu.value || activeMenu.value.route !== match.topMenu.route) {
      updateActiveMenu(match.topMenu);
    }

    // 2. 联动 Sidebar 选中状态
    activeSubMenuRoute.value = match.leafRoute;

    // 3. 联动 Sidebar 展开状态：如果该菜单拥有父级菜单，则自动展开它
    if (match.parentRoute && !expandedMenus.value.includes(match.parentRoute)) {
      expandedMenus.value.push(match.parentRoute);
    }
  }
}, { immediate: true }) // immediate 参数取代了原本 onMounted 中的重复冗余初始化

// ========== 监听 activeMenu (即 Header 顶部切换) 的变化 ==========
watch(() => activeMenu.value, (newMenu, oldMenu) => {
  if (newMenu && newMenu.route !== oldMenu?.route) {
    // 如果是通过点击 Header 切换的菜单，由于 Header 组件设计为“只切换菜单，不改变路由”，
    // 此时我们需要清空左侧树当前的选中状态以等待用户重新选择。
    // 但是，如果是通过 MenuTabs 跨模块引发的 activeMenu 被动修正，就不应该清空状态。
    // 通过判断当前路劲是否属于新 Header 模块来进行拦截判断：
    const match = findMenuPathByRoute(route.path);
    if (!match || match.topMenu.route !== newMenu.route) {
      activeSubMenuRoute.value = '';
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