<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden shrink-0">
      <div class="flex items-center justify-between mb-2 shrink-0 relative py-1 h-[33px]">
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">电价信息</h3>
      </div>
      <!-- 电价列表 -->
      <div class="flex-1 flex flex-col justify-center gap-4 px-4">
        <div v-for="item in priceList" :key="item.type" class="flex items-center justify-between text-[13px]">
          <div class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span class="text-[#9CA3AF]">{{ item.type }}</span>
            <span class="text-[#6B7280]">{{ item.time }}</span>
          </div>
          <span class="text-cyan-400 font-mono font-bold">{{ item.price }}</span>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  // 电价数据（后续可以改成props从父组件传入）
  const priceList = [
    { type: '峰', time: '10-13', price: '0.86' },
    { type: '尖', time: '13-18', price: '0.76' },
    { type: '平', time: '18-24', price: '0.66' },
    { type: '谷', time: '0-10', price: '0.56' }
  ];
  </script>