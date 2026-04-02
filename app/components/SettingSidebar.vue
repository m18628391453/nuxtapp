<template>
    <Teleport to="body">
      <transition name="fade">
        <div 
          v-if="visible" 
          class="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm" 
          @click="closeSidebar"
        ></div>
      </transition>
  
      <transition name="slide">
        <div 
          v-if="visible" 
          class="fixed top-0 right-0 h-full w-80 bg-[#1A1D24] text-gray-200 z-[9999] shadow-2xl flex flex-col border-l border-gray-700/50 font-sans"
        >
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <h2 class="text-base font-medium text-white">项目配置</h2>
            <button @click="closeSidebar" class="text-gray-400 hover:text-[#32AFFF] transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            
            <div>
              <h3 class="text-sm font-bold text-gray-300 mb-4 tracking-wider">主题</h3>
              <div class="grid grid-cols-2 gap-4">
                
                <div class="relative opacity-40 cursor-not-allowed">
                  <div class="h-16 rounded-lg border border-gray-800 bg-gray-900/50 flex items-center justify-center transition-all">
                     <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <p class="text-center text-xs mt-2 text-gray-500">浅色</p>
                </div>
                
                <div @click="tempTheme = 'dark'" class="cursor-pointer group relative">
                  <div :class="['h-16 rounded-lg border flex items-center justify-center transition-all', tempTheme === 'dark' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                     <svg :class="['w-6 h-6', tempTheme === 'dark' ? 'text-[#32AFFF]' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  </div>
                  <p class="text-center text-xs mt-2 text-gray-300">深色</p>
                </div>
  
              </div>
            </div>
  
            <div>
              <h3 class="text-sm font-bold text-gray-300 mb-4 tracking-wider">布局</h3>
              <div class="grid grid-cols-2 gap-4">
                
                <div @click="tempLayout = 'sidebar'" class="cursor-pointer group relative">
                  <div :class="['h-20 rounded-lg border p-1.5 flex gap-1.5 transition-all', tempLayout === 'sidebar' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                     <div class="w-[30%] bg-[#32AFFF] rounded-sm"></div>
                     <div class="flex-1 flex flex-col gap-1.5">
                        <div class="h-3 bg-gray-600 rounded-sm"></div>
                        <div class="flex-1 bg-gray-800 rounded-sm"></div>
                     </div>
                  </div>
                  <p class="text-center text-xs mt-2 text-gray-400">侧边导航</p>
                </div>
  
                <div @click="tempLayout = 'fullscreen'" class="cursor-pointer group relative">
                  <div :class="['h-20 rounded-lg border p-1.5 flex flex-col gap-1.5 transition-all', tempLayout === 'fullscreen' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
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

          <!-- 底部确定/取消按钮区域 -->
          <div class="px-6 py-4 border-t border-gray-800 flex items-center justify-end gap-3">
            <button 
              @click="closeSidebar" 
              class="px-4 py-2 rounded text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 transition-all"
            >
              取消
            </button>
            <button 
              @click="handleConfirm" 
              class="px-4 py-2 rounded text-sm text-white bg-[#32AFFF] hover:bg-[#32AFFF]/90 transition-all"
            >
              确定
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, type LayoutMode, type ThemeMode } from 'vue'
  const { setLayoutMode, setTheme, layoutMode, theme } = useLayout()
  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()
  
  // 关键修复1：初始值同步当前layoutMode，而非固定fullscreen
  const tempLayout = ref<LayoutMode>(layoutMode.value) 
  const tempTheme = ref<ThemeMode>(theme.value)
  
  const closeSidebar = (): void => {
    emit('update:visible', false)
  }
  
  const handleConfirm = (): void => {
    setLayoutMode(tempLayout.value)
    setTheme(tempTheme.value)
    closeSidebar()
  }
  
  // 关键修复2：添加immediate，打开面板立即同步最新状态
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      tempLayout.value = layoutMode.value
      tempTheme.value = theme.value
    }
  }, { immediate: true }) 
  </script>