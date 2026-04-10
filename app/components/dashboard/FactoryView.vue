<template>
    <div 
      class="flex-[2.5] min-h-0 relative flex items-center justify-center rounded-lg overflow-hidden z-1000"
      :style="customStyle"
    >
      <div class="absolute w-full h-full pointer-events-none">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-pulse"
        >
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 定义组件属性：接收自定义样式对象
  const props = defineProps({
    customStyle: {
      type: Object,
      required: true,
      description: "厂房视图"
    }
  })
  </script>