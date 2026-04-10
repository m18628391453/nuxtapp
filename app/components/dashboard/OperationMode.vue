<template>
    <div class="bg-[#0A162C]/10 rounded-lg h-[90px] px-4 justify-between shrink-0 relative overflow-hidden"
      style="padding-top: 0.5rem;">
      <!-- 标题部分：用传入的title参数 -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex py-3.5 px-4 relative -ml-1 -mr-4">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
          {{ title }}
        </h3>
      </div>
      <!-- 运行模式文本：用传入的modeText参数 -->
      <div class="w-full text-center mt-4 z-100">
        <span
          class="px-3 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-500/10 rounded-full text-[13px] font-bold">{{ modeText }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  // 定义接收的参数，还加了默认值，不传的话就用默认的～
  const props = defineProps({
    // 标题（比如“系统运行模式”）
    title: {
      type: String,
      default: '运行模式'
    },
    // 运行模式文本（比如“自动模式”）
    modeText: {
      type: String,
      default: '自动模式'
    }
  })
  </script>