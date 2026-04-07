<template>
    <div class="bg-[#0A162C]/10 rounded-lg flex flex-col gap-4" style="padding: 1rem 1.2rem 1rem 1.5rem;">
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
          各系统用电组成
        </h3>
      </div>
  
      <div class="flex items-center gap-4 h-full pt-2 -mt-5">
        <div class="relative w-[200px] h-[220px] flex items-center justify-center shrink-0">
          <VueECharts :option="pieOption" autoresize />
        </div>
        <div class="flex-1 flex flex-col gap-3 justify-center">
          <div v-for="(item, idx) in pieData" :key="idx" class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }"></div>
              <span class="text-gray-300 font-medium text-[10px]">{{ item.name }}</span>
            </div>
            <span class="flex text-white font-bold text-[14px] font-mono ml-5">
              {{ item.value.toLocaleString() }}
              <span class="block text-gray-300 text-[10px] font-normal mt-1 ml-1">{{ item.unit }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import VueECharts from 'vue-echarts';
  import * as echarts from 'echarts';
  
  const pieData = [
    { name: '对虾车间', value: 4544, color: '#54D1FF', unit: 'kWh', gradientStart: '#33A8FFC0' },
    { name: '鲈鱼车间', value: 3321, color: '#5DE999', unit: 'kWh', gradientStart: '#3DD17AC0' },
    { name: '水藻车间', value: 3113, color: '#76E8F0', unit: 'kWh', gradientStart: '#55D0E0C0' },
  ];
  const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
  
  const pieOption = {
    backgroundColor: 'transparent',
    series: [{
      name: '用电量',
      type: 'pie',
      roseType: 'radius',
      clockwise: false,
      startAngle: 90,
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      itemStyle: {
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#0A162C',
        shadowBlur: 10,
      },
      label: { show: false },
      labelLine: { show: false },
      data: pieData.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: item.gradientStart },
            { offset: 1, color: item.color }
          ]),
          shadowColor: `${item.color}80`,
        }
      }))
    }],
    graphic: [
      { type: 'circle', left: 'center', top: 'center', shape: { r: 38 }, style: { fill: '#051020' } },
      { type: 'text', left: 'center', top: '45%', style: { text: totalValue.toLocaleString(), fontSize: 18, fontWeight: 'bold', fill: '#FFFFFF', fontFamily: 'monospace', textAlign: 'center' } },
      { type: 'text', left: 'center', top: '55%', style: { text: '总用电量(kWh)', fontSize: 8, fill: '#9CA3AF', textAlign: 'center' } }
    ],
    tooltip: {
      show: true,
      formatter: (params) => `${params.name}: ${params.value.toLocaleString()} kWh <br/> 占比: ${params.percent.toFixed(1)}%`,
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 },
      position: (point) => [point[0] + 30, point[1] + 15],
      confine: true,
      offset: [10, 0]
    }
  };
  </script>