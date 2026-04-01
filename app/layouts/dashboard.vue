<template>
    <div
      class="relative min-h-screen text-white font-sans"
      :style="{ backgroundImage: `url('/image/background.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
    >
      <div class="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div class="flex flex-1 overflow-hidden">
          <!-- 侧边栏占位（以后放开 hidden） -->
          <!-- <aside class="w-64 bg-[#050D1D] border-r border-[#1A2A4A] p-4 hidden">...</aside> -->
          <main class="flex-1 h-[calc(100vh-56px)] overflow-hidden">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 布局组件无需额外逻辑
  </script>