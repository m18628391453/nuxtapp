<template>
    <header class="relative flex items-center justify-between h-16 px-6 bg-transparent text-white overflow-hidden">
        <!-- 左侧：Logo区域 + 侧边栏展开按钮（仅侧边模式显示） -->
        <div class="flex items-center gap-4 mt-1 ml-1">
            <!-- 侧边栏展开按钮（仅侧边导航模式显示） -->
            <button
                v-if="layoutMode === 'sidebar'"
                @click="toggleSidebar"
                class="text-gray-300 hover:text-white transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <!-- Logo -->
            <img src="/image/logo.png" alt="综合能碳Logo" class="object-contain shrink-0"
                style="width: 180px; height: 45px;" />
        </div>

        <!-- 菜单+操作区整体容器（仅全屏模式显示菜单） -->
        <div class="relative flex items-center justify-between h-full flex-1" :class="layoutMode === 'fullscreen' ? 'ml-[120px]' : 'ml-auto'">
            <!-- 底部贯穿下划线 -->
            <div class="absolute bottom-3 -left-3 right-0 h-[1px] bg-gradient-to-r from-blue-500/15 via-blue-500/15 to-blue-500/10 z-0" />
            
            <!-- 中间：导航菜单（仅全屏模式显示） -->
            <nav v-if="layoutMode === 'fullscreen'" class="flex items-center h-full space-x-1 z-10 -mt-3">
                <div v-for="(item, idx) in menuList" :key="item.route"
                    class="relative flex items-center h-4/5 m-auto cursor-pointer"@click="handleMenuClick(item, idx)">
                    <a href="javascript:void(0)"
                        class="px-4 text-[15px] font-medium italic z-10 relative cursor-pointer font-['PingFang_SC','Microsoft_YaHei_UI',sans-serif] transition-colors duration-200"
                        :class="activeIndex === idx ? 'text-[#32AFFF]' : 'text-gray-100 hover:text-[#32AFFF]/95'"  style="text-align: center;" >
                        {{ item.name }}
                    </a>
                    <!-- 选中项背景微光效果 -->
                    <div v-if="activeIndex === idx"
                        :class="`absolute min-w-[88px] inset-0 ${idx == 0 ? 'left-[-20%]' : 'left-[0%]' }  w-14/5 h-full bg-gradient-to-r from-transparent via-[#318DC8]/30 to-transparent cursor-pointer`" />
                </div>
            </nav>

            <!-- 右侧：操作区与个人信息 -->
            <div class="flex items-center gap-6 z-10 -mt-3 -ml-1">
                <!-- 搜索按钮 -->
                <button class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
                    @click="handleSearch">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <!-- 全屏按钮 -->
                <button class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
                    @click="toggleFullscreen">
                    <!-- 未全屏：全屏图标 -->
                    <svg v-if="!isFullscreen" class="w-4 h-4 icon" fill="#D1D5DB" stroke="currentColor"
                        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5516">
                        <path
                            d="M629.557 391.972c17.329 17.32 47.028 17.32 66.815 0l168.302-165.814v133.637c0 19.806 14.85 34.647 34.637 34.647h24.743c19.806 0 34.657-12.372 34.657-29.692V119.733h-2.479l2.479-17.318c0-9.904-2.479-17.33-7.436-24.752-4.936-4.948-14.848-9.895-24.743-9.895h-17.327L664.211 65.29c-19.805 0-34.654 17.329-34.654 34.646v24.752c2.478 22.274 19.789 34.646 39.593 34.646h128.69L632.036 325.149c-22.283 17.319-22.283 47.026-2.478 66.823zM394.44 629.557c-17.31-17.327-47.009-17.327-66.815 0l-168.3 165.807V664.195c0-19.787-14.833-34.638-34.638-34.638h-24.76c-19.788 0-34.639 12.372-34.639 29.699v242.533h2.478l-2.478 17.327c0 9.894 2.478 17.31 7.416 24.744 4.956 4.956 14.868 9.894 24.761 9.894h17.328l244.993 2.478c19.823 0 34.655-17.328 34.655-34.638v-24.76c-2.478-22.266-19.788-34.638-39.593-34.638H226.16l168.283-165.824c17.327-17.327 17.327-47.027-0.001-66.815z m561.79 274.709v-242.55c0-19.787-17.329-29.68-34.639-29.68h-24.759c-19.788 0-34.639 17.31-34.639 34.638v131.168l-168.3-165.806c-17.309-17.329-47.01-17.329-66.816 0-17.326 17.31-17.326 47.009 0 66.814l168.284 165.806h-128.69c-19.787 0-37.116 12.388-39.594 34.654v24.745c0 19.805 17.33 34.654 34.64 34.654l240.071-2.478h17.329c9.893 0 17.31-2.478 24.743-9.894 4.955-4.956 7.415-14.85 7.415-24.744l4.955-17.327c-2.478 0 0 0 0 0zM228.636 159.335h128.69c19.806 0 37.116-12.373 39.593-34.646V99.936c0-19.797-17.309-34.646-34.654-34.646l-244.993 2.478H99.927c-9.876 0-17.31 2.478-24.743 9.895-4.939 4.956-7.416 14.849-7.416 24.752l2.477 17.318h-2.477v245.018c0 19.797 14.85 29.692 34.638 29.692h24.743c19.823 0 34.655-14.841 34.655-34.646v-133.64l168.283 165.815c17.345 17.32 47.045 17.32 66.832 0 17.33-17.327 17.33-47.026 0-66.823L228.636 159.335z m0 0"
                            p-id="5517"></path>
                    </svg>
                    <!-- 全屏：退出全屏图标 -->
                    <svg v-else class="w-4 h-4 icon" fill="#D1D5DB" stroke="currentColor" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1067">
                        <path
                            d="M400.595 345.365l-0.948-245.022c-0.42-18.881-16.018-30.215-34.956-30.637h-25.406c-18.88-0.42-33.874 16.018-33.457 34.881l1.061 133.251L138.772 72.417c-18.274-18.311-47.844-18.311-66.119 0-18.218 18.314-18.218 47.907 0 66.236l166.575 164.885-127.697 0.512c-18.88-0.477-36.394 12.606-39.26 34.899v24.08c0.477 18.917 16.077 34.558 34.957 34.972l243.826-1.438c0.362 0.035 0.608 0.171 0.928 0.171l17.1 0.378c9.441 0.226 17.9-3.467 23.923-9.593 6.124-6.083 8.382-14.58 8.131-24.078l-1.821-17.138c0.001-0.335 1.27-0.562 1.27-0.945zM766.211 701.451l127.524-0.512c18.88 0.421 36.357-11.183 39.26-33.474v-24.077c-0.478-18.922-16.134-34.558-34.957-35.037l-240.702 1.458c-0.378 0-0.605-0.151-0.967-0.151l-17.062-0.42c-9.441-0.226-17.95 3.469-23.98 9.611-6.159 6.03-8.361 14.559-8.173 24.057l1.881 17.1c0.033 0.42-1.234 0.661-1.234 0.986l0.986 241.248c0.477 18.863 16.078 30.162 34.957 30.576l24.017 0.037c18.827 0.433 33.874-16.055 33.403-34.941l-1.062-130.388 168.117 166.502c18.276 18.314 47.809 18.314 66.085 0 18.255-18.31 18.255-47.906 0-66.218L766.209 701.442zM392.992 618.855c-6.028-6.14-14.541-9.834-23.923-9.61l-17.104 0.42c-0.346 0-0.566 0.151-0.948 0.151l-243.81-1.458c-18.881 0.478-34.503 16.112-34.956 35.034v24.078c2.843 22.292 20.357 33.892 39.206 33.474l129.158 0.42-167.983 166.37c-18.234 18.255-18.234 47.906 0 66.218 18.256 18.314 47.845 18.314 66.102 0l168.137-165.418-1.079 131.185c-0.42 18.922 14.579 35.413 33.424 34.938h25.406c18.937-0.477 34.54-11.713 34.956-30.637l0.987-243.05c0-0.346-1.267-0.571-1.267-0.949l1.821-17.104c0.206-9.495-1.993-18.025-8.116-24.053zM615.434 387.559c6.03 6.123 14.541 9.819 23.965 9.553l17.06-0.378c0.378 0 0.608-0.132 0.986-0.19l244.19 1.457c18.88-0.434 34.482-16.078 34.956-34.994l0.058-24.078c-2.898-22.331-20.439-35.355-39.26-34.939l-129.573-0.511 166.483-164.893c18.31-18.235 18.31-47.83 0.054-66.143-18.276-18.311-47.809-18.311-66.084 0L700.152 238.89l1.079-134.276c0.454-18.863-14.598-35.355-33.424-34.939H643.79c-18.881 0.477-34.484 11.773-34.957 30.637l-0.967 245.075c0 0.378 1.251 0.608 1.251 0.948l-1.859 17.138c-0.192 9.499 2.007 17.991 8.173 24.078z"
                            p-id="1068"></path>
                    </svg>
                </button>
                <!-- 用户信息 -->
                <div class="flex items-center gap-2 cursor-pointer group">
                    <div
                        class="w-6 h-6 rounded-full overflow-hidden border border-blue-400 group-hover:border-blue-400 transition-colors duration-200">
                        <div
                            class="w-full h-full bg-blue-400 flex items-center justify-center text-xs text-[#fefefe] font-bold">
                            <UserRound class="w-4 h-4" />
                        </div>
                    </div>
                    <span class="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">管理员</span>
                </div>
                <!-- 设置按钮 -->
                <button class="text-gray-300 hover:text-gray-100 cursor-pointer transition-colors duration-200"
                    @click="handleSettings">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 21 21">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </div>
        <!-- 菜单搜索弹窗 -->
        <MSearchModal
          v-model:visible="showSearchModal"
          :menu-list="menuSearchList"
          @select="handleSearchMenuSelect"
        />
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLayout } from '~/composables/useLayout'
import { UserRound } from 'lucide-vue-next'
import MSearchModal from './MSearchModal.vue'
import type { MenuItem } from '~/composables/useLayout'

// 全局布局状态（单例）
const { layoutMode, menuList, setLayoutMode, toggleSidebar, addTab } = useLayout()

// 定义事件
const emit = defineEmits<{
  (e: 'menu-change', payload: { name: string, index: number, route: string }): void
  (e: 'search'): void
  (e: 'settings'): void
}>()

// 当前选中的菜单索引
const activeIndex = ref(0)
// 全屏状态
const isFullscreen = ref(false)
// 搜索弹窗显示状态
const showSearchModal = ref(false)

// 搜索弹窗用的菜单列表
const menuSearchList = computed(() => {
  return menuList.value.map((item) => ({
    name: item.name,
    index: item.index,
    route: item.route
  }))
})

// 处理菜单点击
const handleMenuClick = (item: MenuItem, index: number) => {
    if (activeIndex.value === index) return
    activeIndex.value = index
    addTab(item)
    emit('menu-change', {
        name: item.name,
        index: index,
        route: item.route
    })
}

// 处理搜索
const handleSearch = () => {
    emit('search')
    showSearchModal.value = true
}

// 处理搜索弹窗选中菜单
const handleSearchMenuSelect = (menuItem: { name: string, index: number, route: string }) => {
  activeIndex.value = menuItem.index
  const targetMenu = menuList.value.find(item => item.route === menuItem.route)
  if (targetMenu) addTab(targetMenu)
  emit('menu-change', menuItem)
}

// 更新全屏状态
const updateFullscreenStatus = () => {
    isFullscreen.value = !!document.fullscreenElement
}

// 处理全屏切换
const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
        } else {
            await document.exitFullscreen()
        }
        updateFullscreenStatus()
    } catch (err) {
        console.error(`全屏操作失败: ${err.message}`)
    }
}

// 处理设置
const handleSettings = () => {
    emit('settings')
}

// 监听全屏变化事件
onMounted(() => {
    updateFullscreenStatus()
    document.addEventListener('fullscreenchange', updateFullscreenStatus)
})
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenStatus)
})
</script>

<style scoped>
a,
button {
    transition: all 0.2s ease;
}
svg {
    transition: transform 0.2s ease;
}
button:hover svg {
    transform: scale(1.1);
}
</style>