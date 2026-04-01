<template>
    <div class="grid grid-cols-6 gap-1 w-full pt-2">
      <div v-for="(item, idx) in metrics" :key="idx" class="flex flex-col justify-center py-1">
        <p class="text-gray-400 text-[11px] mb-1 font-medium">{{ item.title }}</p>
        <div class="mb-1">
          <span class="text-[26px] font-semibold font-mono tracking-wider leading-none text-cyan-400" style="textShadow: '0 0 10px rgba(34,211,238,0.3)';">
            {{ item.value }}
          </span>
        </div>
        <div class="flex items-center gap-1 text-[10px]">
          <span :class="`font-semibold ${item.arrowColor}`">{{ item.change }}</span>
          <span class="text-gray-500">{{ item.vs }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const metrics = [
    { title: '今日用电量(kWh)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-cyan-400', arrowColor: 'text-red-500' },
    { title: '综合电费_风平谷折算(元)', value: '26,814', change: '↓节约', vs: '¥3,280', valueColor: 'text-cyan-400', arrowColor: 'text-emerald-400' },
    { title: '光伏发电量(kWh)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-cyan-400', arrowColor: 'text-red-500' },
    { title: '储能套利收益_今日(元)', value: '4,156', change: 'SOC 74%', vs: '· 充放21次', valueColor: 'text-cyan-400', arrowColor: 'text-gray-400' },
    { title: '碳排放强度_双碳(tCO₂/万元)', value: '0.382', change: '↓11.4%', vs: 'vs 目标', valueColor: 'text-cyan-400', arrowColor: 'text-emerald-400' },
    { title: '绿电消纳占比_GEC(%)', value: '32.1', change: '↑2.4%', vs: 'vs 上月', valueColor: 'text-cyan-400', arrowColor: 'text-red-500' },
  ];
  </script>