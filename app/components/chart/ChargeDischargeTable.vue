<template>
    <div class="w-full h-full flex flex-col">
      <div class="flex items-center justify-between mb-3 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-1 h-4 bg-[#00D2FF]"></div>
          <span class="font-bold text-base tracking-wider">充放电分析</span>
        </div>
        <div class="flex bg-cyan-900/30 rounded border border-cyan-800/50 text-xs">
          <span class="px-2 py-1 text-cyan-400 bg-cyan-800/40 cursor-pointer">日</span>
          <span class="px-2 py-1 text-gray-400 cursor-pointer hover:text-cyan-400 transition-colors">月</span>
          <span class="px-2 py-1 text-gray-400 cursor-pointer hover:text-cyan-400 transition-colors">年</span>
        </div>
      </div>
  
      <div class="flex-1 flex flex-col text-xs">
        <div class="flex text-gray-400 py-2 mb-1 bg-cyan-900/20 font-medium">
          <div class="flex-1 text-center">指标</div>
          <div class="flex-1 text-center">数据</div>
          <div class="flex-[0.8] text-center">同比</div>
          <div class="flex-[0.8] text-center">环比</div>
        </div>
        <div class="flex-1 flex flex-col gap-1 justify-between">
          <div v-for="(row, idx) in tableData" :key="idx" class="flex items-center py-1.5 border-b border-cyan-900/30 hover:bg-cyan-900/20 transition-colors">
            <div class="flex-1 text-center text-gray-300">{{ row.indicator }}</div>
            <div class="flex-1 text-center text-[#00D2FF] font-medium">{{ row.data }} <span class="text-[10px] text-gray-500 font-normal">{{ row.unit }}</span></div>
            <div class="flex-[0.8] text-center text-emerald-400">{{ row.yoy }}</div>
            <div class="flex-[0.8] text-center text-red-500">{{ row.mom }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const tableData = [
    { indicator: '光伏充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
    { indicator: '市电充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
    { indicator: '充电次数', data: '5', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
    { indicator: '放电次数', data: '3', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
    { indicator: '放电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
    { indicator: '充电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  ]
  </script>