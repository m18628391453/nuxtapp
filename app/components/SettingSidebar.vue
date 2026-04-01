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
              <div class="flex gap-4">
                <button 
                  @click="theme = 'light'" 
                  :class="['flex-1 flex flex-col items-center justify-center py-4 rounded-lg border transition-all cursor-pointer', theme === 'light' ? 'border-[#32AFFF] bg-[#32AFFF]/10 text-[#32AFFF]' : 'border-gray-700 hover:border-gray-500 text-gray-400']"
                >
                   <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   <span class="text-xs font-medium">浅色</span>
                </button>
                
                <button 
                  @click="theme = 'dark'" 
                  :class="['flex-1 flex flex-col items-center justify-center py-4 rounded-lg border transition-all cursor-pointer', theme === 'dark' ? 'border-[#32AFFF] bg-[#32AFFF]/10 text-[#32AFFF]' : 'border-gray-700 hover:border-gray-500 text-gray-400']"
                >
                   <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                   <span class="text-xs font-medium">深色</span>
                </button>
              </div>
            </div>
  
            <div>
              <h3 class="text-sm font-bold text-gray-300 mb-4 tracking-wider">布局</h3>
              <div class="grid grid-cols-2 gap-4">
                
                <div @click="layout = 'sidebar'" class="cursor-pointer group relative">
                  <div :class="['h-20 rounded-lg border p-1.5 flex gap-1.5 transition-all', layout === 'sidebar' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                     <div class="w-[30%] bg-[#32AFFF] rounded-sm"></div>
                     <div class="flex-1 flex flex-col gap-1.5">
                        <div class="h-3 bg-gray-600 rounded-sm"></div>
                        <div class="flex-1 bg-gray-800 rounded-sm"></div>
                     </div>
                  </div>
                  <div v-if="layout === 'sidebar'" class="absolute -bottom-1 -right-1 bg-[#32AFFF] text-white rounded-full p-0.5">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p class="text-center text-xs mt-2 text-gray-400">侧边导航</p>
                </div>
  
                <div @click="layout = 'fullscreen'" class="cursor-pointer group relative">
                  <div :class="['h-20 rounded-lg border p-1.5 flex flex-col gap-1.5 transition-all', layout === 'fullscreen' ? 'border-[#32AFFF] bg-[#32AFFF]/5' : 'border-gray-700 group-hover:border-gray-500']">
                     <div class="h-3 flex gap-1.5">
                         <div class="w-1/4 bg-gray-600 rounded-sm"></div>
                         <div class="flex-1 bg-gray-600 rounded-sm"></div>
                     </div>
                     <div class="flex-1 bg-gray-800 rounded-sm"></div>
                  </div>
                  <div v-if="layout === 'fullscreen'" class="absolute -bottom-1 -right-1 bg-[#32AFFF] text-white rounded-full p-0.5">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
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
  
  <script setup>
  import { ref } from 'vue'
  
  // 接收父组件通过 v-model 传进来的显示状态
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })
  
  // 触发更新事件
  const emit = defineEmits(['update:visible'])
  
  // 默认的主题和布局状态
  const theme = ref('dark')
  const layout = ref('sidebar')
  
  // 关闭侧边栏的方法
  const closeSidebar = () => {
    emit('update:visible', false)
  }
  </script>
  
  <style scoped>
  /* 遮罩层渐隐渐现动画 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  /* 侧边栏平滑划入划出动画 */
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateX(100%);
  }
  </style>