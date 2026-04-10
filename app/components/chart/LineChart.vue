<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full">
    <!-- 标题栏 -->
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-2">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">{{ title }}</h3>
    </div>

    <!-- 图表容器 -->
    <div class="flex-1 min-h-[200px] w-full relative">
      <VueECharts :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup>
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts';

// 定义接收父组件的参数
const props = defineProps({
  // 图表标题
  title: {
    type: String,
    required: true
  },
  // x轴数据
  xAxisData: {
    type: Array,
    default: () => ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '21:00', '24:00']
  },
  // y轴配置
  yAxisConfig: {
    type: Object,
    default: () => ({
      max: 35,
      interval: 5
    })
  },
  // 系列数据（核心：每条线的完整配置）
  seriesData: {
    type: Array,
    required: true
  }
});

// 组装图表配置
const chartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(5, 13, 29, 0.9)',
    borderColor: '#1A2A4A',
    textStyle: { color: '#fff', fontSize: 12 }
  },
  legend: {
    data: props.seriesData.map(item => item.name),
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
    data: props.xAxisData,
    axisLine: { lineStyle: { color: '#1F2937' } },
    axisTick: { show: false },
    axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
  },
  yAxis: {
    type: 'value',
    ...props.yAxisConfig,
    splitLine: { show: false },
    axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
  },
  // 直接用父组件传的完整series数据
  series: props.seriesData
};
</script>