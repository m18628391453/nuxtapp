<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">{{ title }}</h3>
      <div class="flex rounded-md p-0.5 relative z-10">
        <button 
          v-for="btn in buttons" 
          :key="btn" 
          @click="activeBtn = btn"
          class="px-2 py-0.5 text-[10px] rounded transition-all" 
          :class="btn === activeBtn ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-gray-500 hover:text-gray-300 cursor-pointer'"
        >
          {{ btn }}
        </button>
      </div>
    </div>

    <div class="flex-1 min-h-[180px] w-full relative -mt-3">
      <VueECharts :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts';

// 定义父组件传过来的参数
const props = defineProps({
  title: { type: String, default: '收益分析' },
  buttons: { type: Array, default: () => ['今日', '昨日', '本月', '今年'] },
  xAxisData: { type: Array, default: () => ['光伏', '风电', '储能', '辅助服务'] },
  lineXAxisData: { type: Array, default: () => [] },
  barData: { type: Array, default: () => [] },  
  lineData: { type: Array, default: () => [] }, 
  barColor: { 
    type: Array, 
    default: () => ['#10B981', '#34D399', '#6EE7B7'] 
  },
  barWidth: { type: Number, default: 14 },
  yAxisMax: { type: Number, default: 700 },
  yAxisInterval: { type: Number, default: 100 }
});

const activeBtn = ref(props.buttons[0]);

const chartOption = computed(() => {
  const seriesArray = [];
  const actualLineXAxisData = props.lineXAxisData.length > 0 ? props.lineXAxisData : props.xAxisData;

  // 1. 柱状图配置
  if (props.barData && props.barData.length > 0) {
    seriesArray.push({
      name: '柱状指标',
      data: props.barData,
      type: 'bar',
      xAxisIndex: 0,
      barWidth: props.barWidth,
      showBackground: true,
      backgroundStyle: { color: '#0D1B35', borderRadius: 20 },
      itemStyle: {
        borderRadius: 20,
        // 使用传入的 barColor 进行渐变渲染
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0, color: props.barColor[0] },
          { offset: 0.5, color: props.barColor[1] },
          { offset: 1, color: props.barColor[2] }
        ])
      }
    });
  }

  // 2. 折线图配置
  if (props.lineData && props.lineData.length > 0) {
    seriesArray.push({
      name: '折线指标',
      data: props.lineData,
      type: 'line',
      xAxisIndex: 1,
      smooth: true, 
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: { color: '#F59E0B' }, 
      lineStyle: { color: '#F59E0B', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(245, 158, 11, 0.4)' }, 
          { offset: 1, color: 'rgba(245, 158, 11, 0.0)' }  
        ])
      }
    });
  }

  // 兜底逻辑
  if (seriesArray.length === 0) {
     seriesArray.push({
      data: [380, 550, 380, 550],
      type: 'bar',
      xAxisIndex: 0,
      barWidth: 14,
      showBackground: true,
      backgroundStyle: { color: '#0D1B35', borderRadius: 20 },
      itemStyle: {
        borderRadius: 20,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0, color: props.barColor[0] },
          { offset: 0.5, color: props.barColor[1] },
          { offset: 1, color: props.barColor[2] }
        ])
      }
    });
  }

  return {
    grid: { top: 30, right: 10, bottom: 20, left: 35 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: { show: false }, 
    xAxis: [
      {
        type: 'category',
        data: props.xAxisData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 10, margin: 12 }
      },
      {
        type: 'category',
        data: actualLineXAxisData,
        show: false 
      }
    ],
    yAxis: {
      type: 'value',
      max: props.yAxisMax,
      interval: props.yAxisInterval,
      splitLine: {
        lineStyle: { color: 'rgba(75, 85, 99, 0.4)', type: 'dashed' }
      },
      axisLabel: { color: '#4B5563', fontSize: 10, fontFamily: 'monospace' }
    },
    series: seriesArray
  };
});
</script>