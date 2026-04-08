<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" :style="customPadding">
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 shrink-0">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
        {{ title }}
      </h3>
    </div>

    <div class="flex items-center gap-4 flex-1 min-h-0 pt-2 -mt-2">
      <div :class="`relative w-[${props.pieSize || '180'}px] min-w-[150px] h-full flex items-center justify-center shrink-0`">
        <VueECharts :option="pieOption" autoresize />
      </div>

      <div class="flex-1 flex flex-col gap-3 justify-center pr-2 overflow-y-auto">
        <div v-for="(item, idx) in pieData" :key="idx" 
             :class="layout === 'row' ? 'flex items-center justify-between -pl-1' : 'flex flex-col gap-0.5'">
          
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }"></div>
            <span class="text-gray-300 font-medium text-[12px] truncate">{{ item.name }}</span>
          </div>

          <span class="flex items-baseline text-white font-bold text-[14px] font-mono" :class="layout === 'row' ? 'ml-2' : 'ml-5'">
            {{ (item.value || 0).toLocaleString() }}
            <span class="text-gray-300 text-[10px] font-normal ml-1">{{ unit }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts';

// 定义 Props
const props = defineProps({
  title: { type: String, default: '各系统用电组成' },
  centerTitle: { type: String, default: '总用电量(kWh)' },
  unit: { type: String, default: 'kWh' },
  layout: { type: String, default: 'column' },
  pieSize: { type: Number, default: 180 },
  pieData: {
    type: Array,
    default: () => [
      { name: '对虾车间', value: 4544, color: '#54D1FF', gradientStart: '#33A8FFC0' },
      { name: '鲈鱼车间', value: 3321, color: '#5DE999', gradientStart: '#3DD17AC0' },
      { name: '水藻车间', value: 3113, color: '#76E8F0', gradientStart: '#55D0E0C0' },
    ]
  },
  customPadding: { type: Object, default: () => ({ padding: '0.5rem 1.2rem 1rem 1.5rem' }) }
});

// 计算总量
const totalValue = computed(() => {
  return props.pieData.reduce((sum, item) => sum + (item.value || 0), 0);
});

// ECharts 配置
const pieOption = computed(() => ({
  backgroundColor: 'transparent',
  series: [{
    name: props.title,
    type: 'pie',
    roseType: props.layout === 'column' ? 'radius' : '',
    clockwise: false,
    startAngle: 90,
    radius: ['55%', '85%'],
    center: ['50%', '50%'],
    itemStyle: {
      borderRadius: 0,
      borderWidth: 1,
      borderColor: '#0A162C',
      shadowBlur: 10,
    },
    label: { show: false },
    labelLine: { show: false },
    data: props.pieData.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: item.gradientStart || item.color + 'C0' },
          { offset: 1, color: item.color }
        ]),
        shadowColor: `${item.color}80`,
      }
    }))
  }],
  graphic: [
    { 
      type: 'circle', left: 'center', top: 'center', 
      shape: { r: 35 }, 
      style: { fill: '#051020' } 
    },
    { 
      type: 'text', left: 'center', top: '44%', 
      style: { 
        text: totalValue.value.toLocaleString(), 
        fontSize: 18, fontWeight: 'bold', fill: '#FFFFFF', 
        fontFamily: 'monospace', textAlign: 'center' 
      } 
    },
    { 
      type: 'text', left: 'center', top: '53%', 
      style: { 
        text: props.centerTitle, 
        fontSize: 9, fill: '#9CA3AF', textAlign: 'center' 
      } 
    }
  ],
  tooltip: {
    show: true,
    formatter: (params) => `${params.name}: ${params.value.toLocaleString()} ${props.unit} <br/> 占比: ${params.percent.toFixed(1)}%`,
    backgroundColor: 'rgba(5, 13, 29, 0.9)',
    borderColor: '#1A2A4A',
    textStyle: { color: '#fff', fontSize: 12 },
    confine: true
  }
}));
</script>