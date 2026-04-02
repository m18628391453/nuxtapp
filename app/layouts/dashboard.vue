<template>
  <div class="relative min-h-screen text-white font-sans" 
      :style="{ 
      backgroundImage: `url('/image/background.png')`, 
      backgroundSize: 'auto',  
      backgroundPosition: 'center -120px',
      backgroundRepeat: 'repeat-y',
      opacity: 0.99 
  }"
  >
      <div class="relative z-10 flex flex-col min-h-screen">
          <!-- 顶部导航 -->
          <Header @settings="showSettings = true" />
          
          <div class="flex flex-1 overflow-hidden">
              <!-- 左侧侧边栏：只有侧边导航模式才显示！ -->
              <Sidebar v-if="layoutMode === 'sidebar'" />
              
              <!-- 主内容区：侧边模式自动给左边距，不被菜单盖住 -->
              <main 
                  class="flex-1 h-[calc(100vh-56px)] overflow-hidden transition-all duration-300"
                  :class="layoutMode === 'sidebar' && !sidebarCollapsed ? 'ml-60' : 'ml-0'"
              >
                  <slot />
              </main>
          </div>
      </div>
      <!-- 设置侧边栏 -->
      <SettingSidebar v-model:visible="showSettings" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLayout } from '~/composables/useLayout'
import Header from '../components/Header.vue' 
import Sidebar from '../components/Sidebar.vue'
import SettingSidebar from '../components/SettingSidebar.vue'

// 全局状态，控制布局
const { layoutMode, sidebarCollapsed } = useLayout()

// 控制设置侧边栏显示
const showSettings = ref(false)
</script>