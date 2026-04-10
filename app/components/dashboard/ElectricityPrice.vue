<template>
    <div class="bg-[#0A162C]/10 rounded-lg px-4 py-2 flex flex-col h-full w-full relative overflow-hidden shrink-0">
      <div class="flex items-center justify-between mb-2 shrink-0 relative py-1 h-[33px]">
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">电价信息</h3>
      </div>
      <!-- 电价列表 -->
      <div class="flex-1 flex flex-col justify-center gap-4 px-4">
        <div class="flex flex-col gap-1 mt-1">
          <div v-for="(item, index) in loadData" :key="index"
            class="grid grid-cols-[1fr_1fr__1.2fr] items-center justify-between bg-gradient-to-r from-[#071123]/50 to-transparent rounded-full px-3 py-2 border-b border-cyan-800/20 shadow-[0_2px_8px_rgba(6,182,212,0.1)]">
            <div class="flex items-center gap-2 text-center justify-between ml-5">
              <div class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.7)]"></div>
              <span class="flex-1 text-[12px] font-medium text-white text-left ">{{ item.name }}</span>
            </div>
            <span class="text-[14px] font-bold text-white font-mono text-center ml-10">{{ item.time }}</span>
            <span class="text-[14px] font-bold text-[#32AFFF] font-mono text-right">{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  const loadData = [
  { name: '峰', time: '10-13', price: '0.86'  },
  { name: '尖', time: '13-18', price: '0.76' },
  { name: '平', time: '18-24', price: '0.66' },
  { name: '谷', time: '0-10', price: '0.56' },
];
  </script>