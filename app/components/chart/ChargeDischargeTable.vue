<template>
    <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 0rem 0rem 1.25rem;">
      <!-- 标题栏 完全沿用原有组件样式 一字未改 -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">储能运行数据</h3>
      </div>
      <!-- 内容区域 仅优化样式 核心功能、数据完全保留 -->
      <div class="flex-1 flex flex-col gap-3 justify-start mt-2">
        <div class="flex text-gray-400 py-2 mb-1 bg-cyan-900/20 font-normal text-[14px]">
          <div class="flex-1 text-center">指标</div>
          <div class="flex-1 text-center">数据</div>
          <div class="flex-[0.8] text-center">同比</div>
          <div class="flex-[0.8] text-center">环比</div>
        </div>
        <div class="flex-1 flex flex-col gap-1 justify-between text-[13px]">
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