<template>
  <div class="load-dashboard w-full h-screen bg-transparent text-white font-sans overflow-hidden flex flex-col relative z-0">
    <div class="absolute inset-0 z-0 pointer-events-none hud-bg"></div>
    <div class="relative z-10 flex flex-col h-full">
      <div class="weather-bar flex justify-end items-center gap-6 px-6 py-3 text-sm shrink-0">
        <div class="flex items-center gap-2 text-[14px]">
          <span>今日：☁️</span>
          <span class="text-[#00B8F3]">28℃</span>
          <span class="ml-1">湿度：</span>
          <span class="text-[#00B8F3]">70%</span>
        </div>
        <div class="flex items-center gap-2 text-[14px] ml-2">
          <span>明日：☁️</span>
          <span class="text-[#00B8F3]">28℃</span>
          <span class="ml-1">湿度：</span>
          <span class="text-[#00B8F3]">70%</span>
        </div>
        <div class="text-[#FFFFFFCF] text-[14px] ml-1">
          最近7天天气预警：4月15日橙色高温预警38℃ 、4月20日大风蓝色预警7级
        </div>
      </div>
      <div class="flex gap-2 h-[90px] shrink-0 w-full mb-3 px-6">
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #428EF4 0%, #3859E8 100%); border-radius: 2px;">
          <img src="/image/loadmonitor1.png" alt="当前总负荷" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">当前总负荷(kW)</span>
            <span class="metric-values mb-0.5">38,642</span>
            <span class="text-[11px]"><span class="text-[#FF4D4F]">↑1.6%</span> <span class="text-[#FFFFFF80]">vs 预测</span></span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #6C6AFF 0%, #4D27D5 100%); border-radius: 2px;">
          <img src="/image/loadmonitor3.png" alt="今日用电量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">今日用电量(kWh)</span>
            <span class="metric-values mb-0.5">126,814</span>
            <span class="text-[11px]"><span class="text-[#52C41A]">↓1.4%</span> <span class="text-[#FFFFFF80]">vs 昨日</span></span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #65C7F8 0%, #4491E2 100%); border-radius: 2px;">
          <img src="/image/loadmonitor2.png" alt="关键负荷" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">关键负荷(kW)</span>
            <span class="metric-values mb-0.5">12,380</span>
            <span class="text-[11px] text-[#FFFFFF80]">97%</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #52A9DE 0%, #6CDDB1 100%); border-radius: 2px;">
          <img src="/image/loadmonitor5.png" alt="可调负荷" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">可调负荷(kW)</span>
            <span class="metric-values mb-0.5">256</span>
            <span class="text-[11px] text-[#FFFFFF80]">97%</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #EF898B 0%, #F2CA69 100%); border-radius: 2px;">
          <img src="/image/loadmonitor5.png" alt="可断负荷" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">可断负荷(kW)</span>
            <span class="metric-values mb-0.5">182</span>
            <span class="text-[11px] text-[#FFFFFF80]">89%</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #5B64FF 0%, #353DD4 100%); border-radius: 2px;">
          <img src="/image/forecastload1.png" alt="今日负荷高点" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">今日负荷高点(kW)</span>
            <span class="metric-values mb-0.5">32.1</span>
            <span class="text-[11px] text-[#FFFFFF80]">10.85</span>
          </div>
        </div>
      </div>
      <div class="flex-1 px-6 pb-6 w-full overflow-hidden flex flex-col min-h-0">  
        <div class="flex-1 bg-transparent rounded border border-[#FFFFFF1F] pt-3 pb-4 flex flex-col min-h-0">
          <div class="metric-main-title px-4 pb-3 border-b border-[#FFFFFF1F] mb-4 shrink-0">
            负荷预测
          </div>
          <div class="flex-1 flex gap-4 min-h-0 px-4">
            <div class="w-1/3 flex flex-col min-h-0">
              <div class="flex items-center gap-5 mb-4 shrink-0 pl-2 mt-3 mb-1">
                <img src="/image/forecastday.png" alt="预测" class="w-16 h-16" />
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-300">预测明日用电量(kWh)</span>
                  <span class="text-[18px] font-bold text-blue-400">58,845</span>
                </div>
              </div>
              
              <div class="flex gap-3 mb-4 shrink-0">
                <div class="flex-1 round p-3" style="background: linear-gradient(90deg, rgba(50,169,255,0.06) 37%, rgba(0,0,0,0) 100%);">
                  <div class="text-xs text-gray-300 mb-1"><span class="middle-metric-text text-[14px] !text-[#FFFFFF]">今日负荷峰值(kW)</span></div>
                  <div class="text-xs text-gray-300 mb-1"><span class="middle-metric-text text-[14px]">最高</span><span class="text-blue-400 ml-1 text-[15px]">821.20</span></div>
                  <div class="text-xs text-gray-300"><span class="middle-metric-text text-[14px]">预计明日 15:05</span></div>
                </div>
                <div class="flex-1 round p-3" style="background: linear-gradient(90deg, rgba(50,169,255,0.06) 37%, rgba(0,0,0,0) 100%);">
                  <div class="text-xs text-gray-300 mb-1"><span class="middle-metric-text text-[14px] !text-[#FFFFFF]">明日负荷峰值(kW)</span></div>
                  <div class="text-xs text-gray-300 mb-1"><span class="middle-metric-text text-[14px]">最高</span><span class="text-blue-400 ml-1 text-[15px]">821.20</span></div>
                  <div class="text-xs text-gray-300"><span class="middle-metric-text text-[14px]">预计明日 15:05</span></div>
                </div>
              </div>
              
              <div class="middle-metric-title mb-3.5 shrink-0">
                预测精度
              </div>
              
              <div class="flex gap-3 mb-4 shrink-0">
                <div class="flex-1 bg-blue-900/10 rounded flex items-center gap-3 p-3">
                  <img src="/image/wifi.png" alt="NRMSE" class="w-8 h-7" onerror="this.style.display='none'" />
                  <div class="flex flex-col">
                    <span class="text-[12px] text-gray-300">今日光伏NRMSE</span>
                    <span class="text-[20px] font-normal text-blue-400">4.5%</span>
                  </div>
                </div>
                <div class="flex-1 bg-green-900/10 rounded flex items-center gap-3 p-3">
                  <img src="/image/electricity.png" alt="MAPE" class="w-6 h-8" onerror="this.style.display='none'" />
                  <div class="flex flex-col">
                    <span class="text-[12px] text-gray-300">今日光伏MAPE</span>
                    <span class="text-[20px] font-normal text-green-400">5.5%</span>
                  </div>
                </div>
              </div>
              
              <div class="flex-1 min-h-0 bg-transparent rounded p-2 overflow-hidden">
                <div ref="accuracyChartRef" class="w-full h-full"></div>
              </div>
            </div>
            
            <div class="flex-1 flex flex-col min-h-0">
              <div class="flex justify-between items-center pb-2 mb-4 shrink-0">
                <div class="forecast-line-title">发电预测曲线</div>
                
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-300">级别：</span>
                  <a-select v-model:value="levelSelect" class="custom-dark-select min-w-[130px] w-[130px]"
                    :getPopupContainer="(triggerNode) => triggerNode.parentNode">
                    <a-select-option value="all">请选择</a-select-option>
                  </a-select>
                  
                  <a-date-picker v-model:value="forecastDate" valueFormat="YYYY-MM-DD" class="custom-dark-datepicker min-w-[130px] w-[130px]"
                    placeholder="请选择日期" dropdownClassName="custom-dark-datepicker-dropdown"
                    :getPopupContainer="(triggerNode) => triggerNode.parentNode" />
                    
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-300">对比：</span>
                    <a-date-picker v-model:value="compareDate" valueFormat="YYYY-MM-DD" class="custom-dark-datepicker min-w-[130px] w-[130px]"
                      placeholder="请选择日期" dropdownClassName="custom-dark-datepicker-dropdown"
                      :getPopupContainer="(triggerNode) => triggerNode.parentNode" />
                      
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">添加</button>
                  </div>
                </div>
                </div>
              <div class="flex-1 min-h-0 bg-transparent rounded p-2 overflow-hidden">
                <div ref="generationChartRef" class="w-full h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
definePageMeta({
  layout: 'layout'
})
// 图表DOM引用
const accuracyChartRef = ref(null)
const generationChartRef = ref(null)
// 图表实例
let accuracyChart = null
let generationChart = null

// 当前日期
const todayStr = new Date().toLocaleDateString('en-CA')

// 下拉框和时间选择绑定的变量：
const levelSelect = ref('all')
const forecastDate = ref(todayStr)
const compareDate = ref(todayStr)

// 数据模拟
const accuracyData = {
  times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
  nrmse: [280, 200, 260, 210, 250, 190, 220, 200],
  payment: [220, 180, 220, 190, 200, 170, 200, 150]
}
const generationData = {
  times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  ultraShort: [4500, 4600, 4700, 4800, 5200, 4800, 4900, 5300, 4700, 4600, 4500, 4400],
  actual: [4200, 4300, 4400, 4500, 4900, 4500, 4600, 5000, 4400, 4300, 4200, 4100]
}
/**
 * 预测精度折线图 (左侧底部)
 */
const initAccuracyChart = () => {
  if (!accuracyChartRef.value) return
  accuracyChart = echarts.init(accuracyChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: {
      data: ['NRMSE', '支付笔数'],
      textStyle: { color: '#94A3B8', fontSize: 10 },
      itemWidth: 16,
      itemHeight: 10,
      top: 0,
      right: 0,
      itemGap: 12
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: accuracyData.times,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.2)' } },
      axisLabel: { color: '#64748B', fontSize: 10, fontFamily: 'monospace', margin: 12 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 350,
      interval: 50,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'solid' } }
    },
    series: [
      {
        name: 'NRMSE',
        type: 'line',
        color: 'rgba(0, 228, 255, 1)',
        smooth: true,
        showSymbol: false,
        data: accuracyData.nrmse,
        lineStyle: { color: '#00E5FF', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 228, 255, 0.2)' },
            { offset: 1, color: 'rgba(0, 228, 255, 0)' }
          ])
        },
        symbol: 'none',
      },
      {
        name: '支付笔数',
        type: 'line',
        color: 'rgba(16, 185, 128, 1)',
        smooth: true,
        showSymbol: false,
        data: accuracyData.payment,
        lineStyle: { color: '#10B981', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 128, 0.2)' },
            { offset: 1, color: 'rgba(16, 185, 128, 0)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  accuracyChart.setOption(option)
}
/**
 * 发电预测渐变折线图 (右侧)
 */
const initGenerationChart = () => {
  if (!generationChartRef.value) return
  generationChart = echarts.init(generationChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: {
      data: ['超短期', '实际功率'],
      textStyle: { color: '#94A3B8', fontSize: 11 },
      itemWidth: 16,
      itemHeight: 10,
      top: 0,
      right: 0,
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '8.75%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generationData.times,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.2)' } },
      axisLabel: { color: '#64748B', fontSize: 10, fontFamily: 'monospace', margin: 12 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 6000,
      interval: 500,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'solid' } }
    },
    series: [
      {
        name: '超短期',
        type: 'line',
        color: 'rgba(255, 107, 0, 1)',
        smooth: 0.4,
        data: generationData.ultraShort,
        lineStyle: { color: '#FF6B00', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 107, 0, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 0, 0)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '实际功率',
        type: 'line',
        color: 'rgba(0, 229, 255,  1)',
        smooth: 0.4,
        data: generationData.actual,
        lineStyle: { color: '#00E5FF', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 229, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 229, 255, 0)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  generationChart.setOption(option)
}
const handleResize = () => {
  accuracyChart?.resize()
  generationChart?.resize()
}
onMounted(() => {
  nextTick(() => {
    initAccuracyChart()
    initGenerationChart()
  })
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  accuracyChart?.dispose()
  generationChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>
<style scoped>
@import url(@/assets/css/antd.css);

.hud-bg {
  background-image: 
    radial-gradient(circle at 50% 60%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
    repeating-radial-gradient(circle at 50% 60%, transparent 0, transparent 20px, rgba(0, 229, 255, 0.03) 21px, rgba(0, 229, 255, 0.03) 21px);
  background-size: 100% 100%;
}

.metric-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 13px;
  color: #FFFFFFCC;
}

.metric-values {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 24px;
  color: #FFFFFF;
  line-height: 1.2;
}

.middle-metric-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF9F;
  line-height: 19px;
}

.middle-metric-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #32AFFF;
}

.metric-main-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
}

.forecast-line-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #32AFFF;
}
</style>