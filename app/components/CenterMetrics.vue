<template>
  <div class="grid grid-cols-6 gap-1 w-full pt-1">
    <div v-for="(item, idx) in metrics" :key="idx" class="flex flex-col justify-center py-1">
      <!-- 标题容器：相对定位，用于悬浮提示 -->
      <div class="relative w-full mb-1 group">
        <p class="w-full" 
           style="font-family: Microsoft YaHei; font-weight: 400; font-size: 11px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: default;">
          {{ item.title }}
        </p>
        <!-- 自定义悬浮提示气泡 -->
        <div v-if="layoutMode === 'sidebar'" class="absolute -bottom-1 left-0 mb-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style="font-family: Microsoft YaHei;cursor: default;">
          {{ item.title }}
        </div>
      </div>
      <div class="mb-1">
        <span class="text-[26px] font-semibold font-mono tracking-wider leading-none text-[#32AFFF]" style="textShadow: '0 0 10px rgba(34,211,238,0.3)';">
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
  { title: '今日用电量(kWh)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '综合电费_风平谷折算(元)', value: '26,814', change: '↓节约', vs: '¥3,280', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '光伏发电量(kWh)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '储能套利收益_今日(元)', value: '4,156', change: 'SOC 74%', vs: '· 充放21次', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
  { title: '碳排放强度_双碳(tCO₂/万元)', value: '0.382', change: '↓11.4%', vs: 'vs 目标', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '绿电消纳占比_GEC(%)', value: '32.1', change: '↑2.4%', vs: 'vs 上月', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
];

 // 从父组件注入状态和方法
 const layoutState = inject('layoutState');
  const { layoutMode } = layoutState;
</script>