<template>
  <div class="energy-dashboard w-full h-screen bg-transparent text-white font-sans flex flex-col relative z-0 overflow-hidden">
    <div class="relative z-10 flex flex-col h-full p-4 gap-2 mb-20">
      
      <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">统计维度:</span>
              <a-select v-model:value="statDimension" placeholder="请选择" size="small" class="custom-dark-select w-40">
                <a-select-option value="workshop">按车间</a-select-option>
                <a-select-option value="company">按公司</a-select-option>
              </a-select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">时间范围:</span>
              <a-range-picker size="small" class="custom-dark-datepicker w-64" />
            </div>
          </div>
          <div class="flex gap-2">
            <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80 w-[64px]">查询</a-button>
            <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white w-[64px]">重置</a-button>
          </div>
        </div>
      </div>

      <div class="flex-[1] flex gap-2 min-h-0">
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">用电统计排名（单位：kWH）</h3>
            <div class="chart-legend-custom">
              <div class="flex bg-transparent border border-[#00A2FF]/10 rounded overflow-hidden">
                <button v-for="btn in ['车间', '公司', '地域']" :key="btn" 
                  @click="rankBtn1 = btn"
                  :class="btn === rankBtn1 ? 'bg-cyan-600/30 text-[#32AFFF] border-cyan-500/50' : 'text-[#FFFFFFCC]'"
                  class="px-2 py-0.5 text-[10px] transition-all border border-transparent">
                  {{ btn }}
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="elecRankOption" autoresize />
          </div>
        </div>

        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">综合能耗排名（单位：tce）</h3>
            <div class="chart-legend-custom">
              <div class="flex bg-transparent border border-[#00A2FF]/10 rounded overflow-hidden">
                <button v-for="btn in ['车间', '公司', '地域']" :key="btn" 
                  @click="rankBtn2 = btn"
                  :class="btn === rankBtn2 ? 'bg-cyan-600/30 text-[#32AFFF] border-cyan-500/50' : 'text-[#FFFFFFCC]'"
                  class="px-2 py-0.5 text-[10px] transition-all border border-transparent">
                  {{ btn }}
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="energyRankOption" autoresize />
          </div>
        </div>
      </div>

      <div class="flex-[1] flex gap-2 min-h-0">
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">用能占比分析</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="energyPieOption" autoresize />
          </div>
        </div>
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">综合能耗占比分析（单位：tce）</h3>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="consumptionPieOption" autoresize />
          </div>
        </div>
      </div>

      <div class="flex-[1] flex gap-2 min-h-0">
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">产品电单耗趋势(kWH/t)</h3>
            <div class="chart-legend-custom">
               <div class="flex bg-transparent border border-[#00A2FF]/10 rounded overflow-hidden">
                <button v-for="btn in ['对虾', '成都公司']" :key="btn" 
                  @click="trendBtn1 = btn"
                  :class="btn === trendBtn1 ? 'bg-cyan-600/30 text-[#32AFFF] border-cyan-500/50' : 'text-[#FFFFFFCC]'"
                  class="px-2 py-0.5 text-[10px] transition-all border border-transparent">
                  {{ btn }}
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="elecTrendOption" autoresize />
          </div>
        </div>
        <div class="flex-1 chart-card flex flex-col">
          <div class="chart-header">
            <h3 class="chart-title">产品水单耗趋势(t/t)</h3>
             <div class="chart-legend-custom">
               <div class="flex bg-transparent border border-[#00A2FF]/10 rounded overflow-hidden">
                <button v-for="btn in ['对虾', '成都公司']" :key="btn" 
                  @click="trendBtn2 = btn"
                  :class="btn === trendBtn2 ? 'bg-cyan-600/30 text-[#32AFFF] border-cyan-500/50' : 'text-[#FFFFFFCC]'"
                  class="px-2 py-0.5 text-[10px] transition-all border border-transparent">
                  {{ btn }}
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full min-h-0">
            <VueECharts :option="waterTrendOption" autoresize />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'

definePageMeta({
  layout: 'layout'
})

// 状态管理
const statDimension = ref('workshop')
const rankBtn1 = ref('车间')
const rankBtn2 = ref('车间')
const trendBtn1 = ref('对虾')
const trendBtn2 = ref('对虾')

// 通用配置项 (抄袭自 smldaydata 标准)
const commonAxisLabel = { color: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }
const commonSplitLine = { lineStyle: { color: 'rgba(75, 85, 99, 0.2)', type: 'dashed' } }
const rankXData = ['对虾车间', '鲈鱼车间', '烘干车间', '包装车间', '加工车间', '速冻车间']

// 1.1 用电排名图表配置
const elecRankOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  grid: { top: '15%', bottom: '10%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: rankXData, axisLabel: commonAxisLabel, axisLine: { show: false }, axisTick: { show: false } },
  yAxis: { type: 'value', max: 1200, interval: 200, splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [{
    type: 'bar',
    barWidth: 14,
    itemStyle: {
      borderRadius: [7, 7, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        { offset: 0, color: '#1677FF' },
        { offset: 1, color: '#00D0FF' }
      ])
    },
    data: [620, 280, 480, 1050, 200, 820]
  }]
}))

// 1.2 综合能耗排名
const energyRankOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  grid: { top: '15%', bottom: '10%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', data: rankXData, axisLabel: commonAxisLabel, axisLine: { show: false } },
  yAxis: { type: 'value', max: 1200, interval: 200, splitLine: commonSplitLine, axisLabel: commonAxisLabel },
  series: [{
    type: 'bar',
    barWidth: 14,
    itemStyle: {
      borderRadius: [7, 7, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        { offset: 0, color: '#1677FF' },
        { offset: 1, color: '#00D0FF' }
      ])
    },
    data: [620, 280, 480, 1050, 200, 820]
  }]
}))

// 2.1 用能占比 (饼图)
const energyPieOption = computed(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  legend: { orient: 'vertical', right: '10%', top: 'center', textStyle: { color: '#9CA3AF', fontSize: 11 }, itemGap: 10 },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#051020', borderWidth: 2 },
    label: { show: false },
    data: [
      { name: '网电（煤）', value: 4544, itemStyle: { color: '#1677FF' } },
      { name: '光伏自发', value: 3321, itemStyle: { color: '#34D399' } },
      { name: '风电自发', value: 3113, itemStyle: { color: '#10B981' } },
      { name: '网电（水电）', value: 2341, itemStyle: { color: '#FCD34D' } },
      { name: '网电（光伏）', value: 1231, itemStyle: { color: '#EF4444' } }
    ]
  }]
}))

// 2.2 综合能耗占比
const consumptionPieOption = computed(() => ({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  legend: { orient: 'vertical', right: '10%', top: 'center', textStyle: { color: '#9CA3AF', fontSize: 11 }, itemGap: 10 },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['35%', '50%'],
    itemStyle: { borderRadius: 4, borderColor: '#051020', borderWidth: 2 },
    label: { show: false },
    data: [
      { name: '网电（煤）', value: 4544, itemStyle: { color: '#1677FF' } },
      { name: '天然气', value: 3321, itemStyle: { color: '#34D399' } },
      { name: '柴油', value: 3113, itemStyle: { color: '#10B981' } },
      { name: '汽油', value: 2341, itemStyle: { color: '#FCD34D' } },
      { name: '光伏', value: 1231, itemStyle: { color: '#EF4444' } }
    ]
  }]
}))

// 3.1 电单耗趋势 (折线图)
const elecTrendOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  grid: { top: '15%', bottom: '10%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: commonAxisLabel },
  yAxis: { type: 'value', max: 1200, interval: 200, splitLine: { show: false }, axisLabel: commonAxisLabel },
  series: [
    { name: '系列1', type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#32AFFF', width: 2 }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(50, 175, 255, 0.2)' }, { offset: 1, color: 'transparent' }]) }, data: [620, 280, 480, 1050, 200, 820] },
    { name: '系列2', type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#34D399', width: 2 }, data: [800, 400, 650, 450, 900, 650] }
  ]
}))

// 3.2 水单耗趋势
const waterTrendOption = computed(() => ({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', borderColor: '#1A2A4A', textStyle: { color: '#fff' } },
  grid: { top: '15%', bottom: '10%', left: '3%', right: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: commonAxisLabel },
  yAxis: { type: 'value', max: 1200, interval: 200, splitLine: { show: false }, axisLabel: commonAxisLabel },
  series: [
    { name: '系列1', type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#32AFFF', width: 2 }, data: [620, 280, 480, 1050, 200, 820] },
    { name: '系列2', type: 'line', smooth: true, showSymbol: false, lineStyle: { color: '#34D399', width: 2 }, data: [800, 400, 650, 450, 900, 650] }
  ]
}))
</script>

<style scoped>
@import url(@/assets/css/antd.css);

.chart-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 12px;
}

.chart-header {
  padding-left: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  position: relative;
}

.chart-title {
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.chart-legend-custom {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

:deep(.ant-select-selector),
:deep(.ant-input),
:deep(.ant-picker) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

:deep(.ant-select-selection-placeholder),
:deep(.ant-picker-input > input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}

button {
  cursor: pointer;
}
</style>