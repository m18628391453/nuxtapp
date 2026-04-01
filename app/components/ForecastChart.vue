<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full">
      <!-- 标题栏 -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-2">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">{{ title }}</h3>
      </div>
  
      <!-- 图表容器：flex-1 占满剩余空间，min-h-[150px] 保证初始有高度 -->
      <div class="flex-1 min-h-[200px] w-full relative">
        <VueECharts :option="option" autoresize />
      </div>
    </div>
  </template>
  
  <script setup>
  import VueECharts from 'vue-echarts';
  import * as echarts from 'echarts';
  
  const props = defineProps({
    title: String
  });
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: {
      data: ['中期', '短期', '中短期', '超短期', '实际'],
      itemWidth: 12,
      itemHeight: 6,
      textStyle: { color: '#9CA3AF', fontSize: 10 },
      top: 0,
      right: 10,
      itemGap: 12
    },
    grid: { top: 35, right: 10, bottom: 20, left: 30 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '21:00', '24:00'],
      axisLine: { lineStyle: { color: '#1F2937' } },
      axisTick: { show: false },
      axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      max: 35,
      interval: 5,
      splitLine: { show: false },
      axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
    },
    series: [
      {
        name: '中期',
        type: 'line',
        color: '#00D0FF',
        smooth: true,
        showSymbol: false,
        data: [20, 15, 22, 18, 25, 12, 10, 20],
        lineStyle: { width: 1.0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 208, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 208, 255, 0)' }
          ])
        }
      },
      {
        name: '短期',
        type: 'line',
        color: '#1DFF8B',
        smooth: true,
        showSymbol: false,
        data: [22, 18, 15, 20, 28, 15, 8, 15],
        lineStyle: { width: 1.0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(29, 255, 139, 0.3)' },
            { offset: 1, color: 'rgba(29, 255, 139, 0)' }
          ])
        }
      },
      {
        name: '中短期',
        type: 'line',
        color: '#FFB800',
        smooth: true,
        showSymbol: false,
        data: [18, 20, 12, 15, 22, 20, 15, 18],
        lineStyle: { width: 1.0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 184, 0, 0.25)' },
            { offset: 1, color: 'rgba(255, 184, 0, 0)' }
          ])
        }
      },
      {
        name: '超短期',
        type: 'line',
        color: '#F03900F0',
        smooth: true,
        showSymbol: false,
        data: [25, 22, 18, 25, 20, 18, 12, 10],
        lineStyle: { width: 1.0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 0, 0.25)' },
            { offset: 1, color: 'rgba(255, 77, 0, 0)' }
          ])
        }
      },
      {
        name: '实际',
        type: 'line',
        color: '#00FFFF',
        smooth: true,
        showSymbol: false,
        data: [15, 10, 20, 12, 30, 20, 16, 25],
        lineStyle: {
          width: 1.0,
          shadowColor: 'rgba(0, 255, 255, 0.6)',
          shadowBlur: 10
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 255, 255, 0)' }
          ])
        }
      }
    ]
  };
  </script>