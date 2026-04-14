<template>
    <div class="w-full h-full flex flex-col">
      <div class="flex items-center justify-between mb-3 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-1 h-4 bg-[#00D2FF]"></div>
          <span class="font-bold text-base tracking-wider">尖峰平谷占比</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <div class="flex bg-cyan-900/30 rounded border border-cyan-800/50">
            <span class="px-2 py-1 text-cyan-400 bg-cyan-800/40 cursor-pointer">充电</span>
            <span class="px-2 py-1 text-gray-400 cursor-pointer transition-colors hover:text-cyan-400">放电</span>
          </div>
          <select class="bg-cyan-900/30 border border-cyan-800/50 text-gray-300 outline-none rounded px-2 py-1 cursor-pointer">
            <option>当月</option>
          </select>
        </div>
      </div>
  
      <div class="flex-1 flex items-center justify-between px-2">
        <div class="relative w-28 h-28 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.15)]"
             style="background: conic-gradient(#0075FF 0% 18.12%, #00D2FF 18.12% 42.27%, #FACC15 42.27% 67.6%, #F97316 67.6% 100%)">
          <div class="w-20 h-20 bg-[#070b14] rounded-full flex flex-col items-center justify-center relative z-10 shadow-inner">
            <span class="text-lg font-bold text-white leading-tight">236,84</span>
            <span class="text-[10px] text-gray-400 scale-90">总量(万kW)</span>
          </div>
        </div>
  
        <div class="flex flex-col gap-2.5 w-[55%]">
          <div v-for="item in legendData" :key="item.name" class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></span>
              <span class="text-gray-300">{{ item.name }} {{ item.percent }}</span>
            </div>
            <div class="text-gray-200 text-right font-medium">{{ item.value }} kW</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const legendData = [
    { name: '峰', percent: '18.12%', value: '2,658.5', color: '#0075FF' },
    { name: '尖', percent: '24.15%', value: '1,358.5', color: '#00D2FF' },
    { name: '谷', percent: '25.33%', value: '3,723.5', color: '#FACC15' },
    { name: '平', percent: '33.32%', value: '1,658.6', color: '#F97316' },
  ]
  </script>