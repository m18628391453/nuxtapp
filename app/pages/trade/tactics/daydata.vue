<template>
  <div class="day-data-dashboard w-full h-screen bg-transparent text-white font-sans flex flex-col relative z-0 overflow-hidden">
    <div class="relative z-10 flex flex-col h-full p-4 gap-2 mb-20">
      
      <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">当前日:</span>
              <a-date-picker v-model:value="currentDate" size="small" :disabled="true" class="custom-dark-datepicker w-40" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">位置:</span>
              <a-select v-model:value="location" size="small" :disabled="true" class="custom-dark-select w-40">
                <a-select-option value="center">中心区域</a-select-option>
              </a-select>
            </div>
            <div class="flex items-center gap-4">
              <a-checkbox :checked="isWorkday" :disabled="true" class="custom-dark-checkbox">工作日</a-checkbox>
              <a-checkbox :checked="isWeekend" :disabled="true" class="custom-dark-checkbox">双休日</a-checkbox>
              <a-checkbox :checked="isHoliday" :disabled="true" class="custom-dark-checkbox">法定节假日</a-checkbox>
            </div>
          </div>
          </div>
      </div>

      <div class="flex-[1] flex min-h-0">
        <div class="chart-card w-full flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">日内量价曲线</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="intradayOption" autoresize />
          </div>
        </div>
      </div>

      <div class="flex-[1] flex gap-2 min-h-0">
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">现货价格曲线</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="spotPriceOption" autoresize />
          </div>
        </div>
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">交易量数据</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="volumeOption" autoresize />
          </div>
        </div>
      </div>

      <div class="flex-[1] flex gap-2 min-h-0">
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">最大负荷与温度</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="loadTempOption" autoresize />
          </div>
        </div>
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">网供电量分布</h3>
            <div class="chart-legend-custom">
               <span v-for="item in gridLegend" :key="item.label" class="legend-item">
                 <i :style="{ backgroundColor: item.color }"></i> {{ item.label }}
               </span>
            </div>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="gridDistOption" autoresize />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'
import dayjs from 'dayjs' // 奶奶提醒你，这里需要引用 dayjs 来处理日期

definePageMeta({
  layout: 'layout'
})

// --- 筛选栏固定变量 ---
const currentDate = ref(dayjs('2026-05-13')) // 锁定今天
const location = ref('center')
const isWorkday = ref(true)  // 2026-05-13 是周三
const isWeekend = ref(false)
const isHoliday = ref(false)

// --- 原有图表逻辑 ---
const commonAxisLabel = { color: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }
const commonSplitLine = { lineStyle: { color: 'rgba(75, 85, 99, 0.2)', type: 'dashed' } }
const xAxisData = Array.from({ length: 20 }, (_, i) => i.toString())

const intradayOption = ref({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  grid: { top: '15%', bottom: '3%', left: '1%', right: '1%', containLabel: true },
  xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel, axisTick: { show: false } },
  yAxis: [
    { type: 'value', name: '量', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
    { type: 'value', name: '价', splitLine: { show: false }, axisLabel: commonAxisLabel }
  ],
  series: [
    {
      name: '电量',
      type: 'bar',
      barWidth: '30%',
      itemStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#32AFFF' },
          { offset: 1, color: '#32AFFF' }
        ]) 
      },
      data: [80, 95, 40, 50, 20, 30, 90, 100, 95, 100, 70, 85, 40, 25, 98, 45, 95, 45, 98, 40]
    },
    {
      name: '价格',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      showSymbol: true,
      symbolSize: 6,
      lineStyle: { color: '#67E8F9', width: 2 },
      itemStyle: { color: '#67E8F9' },
      data: [30, 45, 20, 15, 10, 18, 15, 18, 20, 22, 25, 30, 20, 15, 5, 15, 25, 35, 45, 30]
    }
  ]
})

const spotPriceOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
  yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [
    { type: 'bar', barWidth: '30%', itemStyle: { color: '#32AFFF' }, data: [35, 52, 45, 15, 40, 35, 90, 105, 55, 60, 78, 85, 35, 25, 102, 50, 48, 55, 68, 42] },
    { type: 'line', smooth: true, lineStyle: { color: '#67E8F9' }, symbolSize: 6, data: [15, 45, 25, 10, 32, 28, 30, 40, 75, 82, 35, 25, 10, 5, 65, 55, 15, 55, 65, 40] }
  ]
})

const volumeOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
  yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [{ type: 'bar', barWidth: '40%', itemStyle: { color: '#3B82F6' }, data: [30, 48, 52, 35, 25, 15, 88, 102, 95, 60, 85, 70, 28, 20, 95, 45, 100, 50, 48, 35] }]
})

const loadTempOption = ref({
  tooltip: { trigger: 'axis' },
  grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
  yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [
    { type: 'bar', barWidth: '35%', itemStyle: { color: '#32AFFF' }, data: [40, 105, 52, 48, 25, 15, 85, 108, 105, 75, 82, 35, 28, 105, 48, 105, 50, 105, 42, 35] },
    { type: 'line', smooth: true, lineStyle: { color: '#67E8F9' }, symbolSize: 6, data: [45, 55, 35, 20, 15, 35, 45, 80, 45, 25, 10, 68, 55, 45, 70, 35, 40, 25, 45, 30] }
  ]
})

const gridLegend = [
  { label: '水电', color: '#3B82F6' }, { label: '火电', color: '#EF4444' },
  { label: '风光', color: '#10B981' }, { label: '外购', color: '#8B5CF6' }, { label: '留川', color: '#F59E0B' }
]

const gridDistOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['2026/3/20', '2026/3/21', '2026/3/22', '2026/3/23', '2026/3/24', '2026/3/25', '2026/3/26'], axisLabel: commonAxisLabel },
  yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [
    { name: '水电', type: 'bar', stack: 'total', barWidth: 14, itemStyle: { color: '#3B82F6' }, data: [2, 2.5, 2, 2.2, 2.5, 2.3, 2.4] },
    { name: '火电', type: 'bar', stack: 'total', itemStyle: { color: '#EF4444' }, data: [3.5, 2.8, 3.2, 3.5, 3, 3.1, 3.2] },
    { name: '风光', type: 'bar', stack: 'total', itemStyle: { color: '#10B981' }, data: [1.2, 1.5, 1.3, 1.4, 1.2, 1.3, 1.4] },
    { name: '外购', type: 'bar', stack: 'total', itemStyle: { color: '#8B5CF6' }, data: [0.5, 0.8, 0.6, 0.7, 0.5, 0.6, 0.5] },
    { name: '留川', type: 'bar', stack: 'total', itemStyle: { color: '#F59E0B' }, data: [1.1, 1.3, 1.2, 1.1, 1.2, 1.3, 1.4] }
  ]
})
</script>

<style scoped>
@import url(@/assets/css/antd.css);

.chart-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  padding: 16px;
  position: relative;
}

.chart-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-left: 10px;
  height: 18px;
}

.chart-title {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  margin: 0;
  line-height: 1;
}

.chart-legend-custom {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #9CA3AF;
}

.legend-item i {
  width: 8px;
  height: 8px;
  border-radius: 1px;
  margin-right: 4px;
}
</style>