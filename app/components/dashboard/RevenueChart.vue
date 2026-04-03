<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
      <!-- 标题与筛选按钮 -->
      <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">收益分析</h3>
        <div class="flex rounded-md p-0.5 relative z-10">
          <button v-for="btn in ['今日', '昨日', '本月', '今年']" :key="btn" class="px-2 py-0.5 text-[10px] rounded transition-all" :class="btn === '今日' ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-gray-500 hover:text-gray-300 cursor-pointer'">{{ btn }}</button>
        </div>
      </div>
  
      <!-- 图表容器：flex-1 占满剩余空间，min-h-[150px] 保证初始有高度 -->
      <div class="flex-1 min-h-[180px] w-full relative -mt-3">
        <VueECharts :option="option" autoresize />
      </div>
    </div>
  </template>
  
  <script setup>
  import VueECharts from 'vue-echarts';
  import * as echarts from 'echarts';
  
  const option = {
    grid: { top: 30, right: 10, bottom: 20, left: 35 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    xAxis: {
      type: 'category',
      data: ['光伏', '风电', '储能', '辅助服务'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 10, margin: 12 }
    },
    yAxis: {
      type: 'value',
      max: 700,
      interval: 100,
      splitLine: {
        lineStyle: { color: 'rgba(75, 85, 99, 0.4)', type: 'dashed' }
      },
      axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
    },
    series: [{
      data: [380, 550, 380, 550],
      type: 'bar',
      barWidth: 14,
      showBackground: true,
      backgroundStyle: { color: '#0D1B35', borderRadius: 20 },
      itemStyle: {
        borderRadius: 20,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0, color: '#10B981' },
          { offset: 0.5, color: '#34D399' },
          { offset: 1, color: '#6EE7B7' }
        ])
      }
    }]
  };
  </script>