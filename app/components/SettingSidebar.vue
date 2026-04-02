<template>
  <Teleport to="body">
    <!-- 蒙层 -->
    <transition name="fade">
      <div 
        v-if="visible" 
        class="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm" 
        @click="closeSidebar"
      ></div>
    </transition>

    <!-- 设置侧边栏主体 -->
    <transition name="slide">
      <div 
        v-if="visible" 
        class="fixed top-0 right-0 h-full w-80 bg-[#1A1D24] text-gray-200 z-[9999] shadow-2xl flex flex-col border-l border-gray-700/50 font-sans"
      >
        <!-- 顶部标题 -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 class="text-base font-medium text-white">项目配置</h2>
          <button @click="closeSidebar" class="text-gray-400 hover:text-[#32AFFF] transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 配置内容 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          <!-- 主题设置 -->
          <div>
            <h3 class="text-sm font-bold text-gray-300 mb-4 tracking-wider">主题</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="relative opacity-40 cursor-not-allowed">
                <div class="h-16 rounded-lg border border-gray-800 bg-gray-900/50 flex items-center justify-center transition-all">
                   <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p class="text-center text-xs mt-2 text-gray-500">浅色</p>
              </div>
              
              <div @click="setTheme('dark')" class="cursor-pointer group relative">
                <div :class="['h-16 rounded-lg border flex items-center justify-center transition-all', theme === 'dark' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                   <svg :class="['w-6 h-6', theme === 'dark' ? 'text-[#32AFFF]' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
                <p class="text-center text-xs mt-2 text-gray-300">深色</p>
              </div>
            </div>
          </div>

          <!-- 布局设置（核心修改！点了就立即生效） -->
          <div>
            <h3 class="text-sm font-bold text-gray-300 mb-4 tracking-wider">布局</h3>
            <div class="grid grid-cols-2 gap-4">
              <!-- 侧边导航模式 -->
              <div @click="setLayoutMode('sidebar')" class="cursor-pointer group relative">
                <div :class="['h-20 rounded-lg border p-1.5 flex gap-1.5 transition-all', layoutMode === 'sidebar' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                   <div class="w-[30%] bg-[#32AFFF] rounded-sm"></div>
                   <div class="flex-1 flex flex-col gap-1.5">
                      <div class="h-3 bg-gray-600 rounded-sm"></div>
                      <div class="flex-1 bg-gray-800 rounded-sm"></div>
                   </div>
                </div>
                <p class="text-center text-xs mt-2 text-gray-400">侧边导航</p>
              </div>

              <!-- 大屏全屏模式 -->
              <div @click="setLayoutMode('fullscreen')" class="cursor-pointer group relative">
                <div :class="['h-20 rounded-lg border p-1.5 flex flex-col gap-1.5 transition-all', layoutMode === 'fullscreen' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                   <div class="h-3 flex gap-1.5">
                       <div class="w-1/4 bg-gray-600 rounded-sm"></div>
                       <div class="flex-1 bg-gray-600 rounded-sm"></div>
                   </div>
                   <div class="flex-1 bg-gray-800 rounded-sm"></div>
                </div>
                <p class="text-center text-xs mt-2 text-gray-400">内容全屏</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useLayout } from '~/composables/useLayout'

// 全局状态（现在是单例了）
const { layoutMode, theme, setLayoutMode, setTheme } = useLayout()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// 关闭侧边栏
const closeSidebar = (): void => {
  emit('update:visible', false)
}
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
</style>