<template>
    <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 0rem 0rem 1.25rem;">
      <!-- 标题栏 完全沿用原有组件样式 一字未改 -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">储能运行数据</h3>
      </div>
      <!-- 内容区域 仅优化样式 核心功能、数据完全保留 -->
      <div class="flex-1 flex flex-col gap-3 justify-start mt-5">
        <div class="flex items-center gap-4 bg-cyan-900/10 p-2.5 rounded border border-cyan-900/30">
          <div class="text-[#00D2FF]">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4h-2V2h-4v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 20V6h8v14H8z" opacity="0.3"/>
              <path d="M8 12h8v8H8z" fill="#00D2FF"/>
            </svg>
          </div>
          <div class="flex-1 flex justify-around text-sm font-medium">
            <div><span class="text-gray-400 mr-1">平均SOH</span> <span class="text-[#00D2FF]">38.25%</span></div>
            <div><span class="text-gray-400 mr-1">平均SOC</span> <span class="text-[#FACC15]">99.25%</span></div>
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div v-for="item in runData" :key="item.title" class="bg-cyan-900/10 p-2.5 rounded border border-cyan-900/20 flex flex-col gap-1.5">
            <div class="text-gray-300 font-medium">{{ item.title }}</div>
            <div class="flex justify-between items-center mt-1">
              <div><span class="text-gray-500 mr-1">{{ item.k1 }}</span> <span :class="item.c1" class="font-medium">{{ item.v1 }}</span></div>
              <div><span class="text-gray-500 mr-1">{{ item.k2 }}</span> <span :class="item.c2" class="font-medium">{{ item.v2 }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  const runData = [
    { title: '电芯温度(℃)', k1: '最高', v1: '30.2', c1: 'text-[#00D2FF]', k2: '最低', v2: '26.2', c2: 'text-[#10B981]' },
    { title: '电芯电压(V)', k1: '最高', v1: '2.92', c1: 'text-[#00D2FF]', k2: '最低', v2: '2.67', c2: 'text-[#10B981]' },
    { title: '电量(万kWh)', k1: '可充', v1: '8.24', c1: 'text-[#00D2FF]', k2: '可放', v2: '0.35', c2: 'text-[#10B981]' },
    { title: '功率(kW)', k1: '可充', v1: '1,300', c1: 'text-[#00D2FF]', k2: '可放', v2: '0', c2: 'text-[#10B981]' },
  ]
  </script>