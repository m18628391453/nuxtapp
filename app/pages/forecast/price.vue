<template>
  <div class="price-dashboard w-full h-screen bg-transparent text-white font-sans overflow-hidden flex flex-col relative z-0">
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
      <div class="main-content flex gap-4 px-6 pb-6 h-full min-h-0">
        <div class="left-panel w-[28%] flex flex-col gap-4">
          <div class="price-info bg-[#FFFFFF09] p-0 flex-1 flex flex-col relative">
            <h2 class="text-sm font-bold p-4 border-b border-[#FFFFFF1F] mb-4 text-[#FFFFFF]" style="padding-bottom: 0.8rem;">电价信息</h2>
            
            <div class="flex items-center gap-4 shrink-0 pl-2 mt-1 mb-1.5 px-4">
              <img src="/image/forecastday.png" alt="预测" class="w-16 h-16" />
              <div class="flex items-baseline gap-2">
                <span class="text-[12px] text-gray-300">当前电价(元/kWh)</span>
                <span class="text-[24px] font-bold text-[#FF4D4F]">1.68</span>
                <span class="text-[12px] text-[#FF4D4F] ml-1 font-medium">峰段至12:00</span>
              </div>
            </div>
            <div class="price-stats grid grid-cols-2 gap-4 mb-4 px-4">
              <div class="stat-card p-3" style="background: linear-gradient(90deg, rgba(50,169,255,0.1) 37%, rgba(0,0,0,0) 100%);">
                <div class="text-xs text-[#FFFFFF9F] mb-1">今日平均电价(元/kWh)</div>
                <div class="text-2xl font-bold text-[#00E5FF]">0.88</div>
                <div class="text-[11px] mt-1">
                  <span class="text-red-400">↑1.6%</span> <span class="text-[#FFFFFF80]">VS 昨日</span>
                </div>
              </div>
              <div class="stat-card p-3" style="background: linear-gradient(90deg, rgba(50,169,255,0.1) 37%, rgba(0,0,0,0) 100%);">
                <div class="text-xs text-[#FFFFFF9F] mb-1">峰谷差价(元/kWh)</div>
                <div class="text-2xl font-bold text-[#00E5FF]">1.08</div>
                <div class="text-[11px] mt-1">
                  <span class="text-green-400">↓1.6%</span> <span class="text-[#FFFFFF80]">VS 昨日</span>
                </div>
              </div>
            </div>
            
            <div class="period-tabs flex gap-5 mb-4 px-4 items-center">
              <button class="px-3 py-0.5 rounded text-[12px] bg-[#00B8F330] border border-[#00B8F390] text-[#00B8F3]">丰水期</button>
              <button class="text-[12px] bg-transparent text-gray-300 hover:text-white transition-colors">平水期</button>
              <button class="text-[12px] bg-transparent text-gray-300 hover:text-white transition-colors">谷水期</button>
            </div>
            
            <div class="time-periods flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar px-4 mb-4">
              <div class="period-item bg-[#FF4D4F]/5 border border-[#FF4D4F]/20 rounded p-3 flex flex-col">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <span class="text-[#FF4D4F] text-sm font-bold">↗</span>
                    <span class="text-sm font-bold text-[#FF4D4F]">峰段</span>
                  </div>
                  <span class="text-[10px] bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] px-1.5 py-0.5 rounded">当前时段</span>
                </div>
                <div class="text-lg font-bold text-[#FF4D4F] mb-1">1.38 ~ 1.68 <span class="text-xs font-normal">元/kWh</span></div>
                <div class="text-xs text-[#FFFFFF66] text-right mt-auto">8:00-12:00 / 14:00-17:00 / 19:00-23:00</div>
              </div>
              <div class="period-item bg-[#FAAD14]/5 border border-[#FAAD14]/20 rounded p-3 flex flex-col">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[#FAAD14] text-sm font-bold">→</span>
                  <span class="text-sm font-bold text-[#FAAD14]">平段</span>
                </div>
                <div class="text-lg font-bold text-[#FAAD14] mb-1">0.98 ~ 1.18 <span class="text-xs font-normal">元/kWh</span></div>
                <div class="text-xs text-[#FFFFFF66] text-right mt-auto">7:00-8:00 / 12:00-14:00 / 17:00-19:00</div>
              </div>
              <div class="period-item bg-[#4ADE80]/5 border border-[#4ADE80]/20 rounded p-3 flex flex-col">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[#4ADE80] text-sm font-bold">↘</span>
                  <span class="text-sm font-bold text-[#4ADE80]">谷段</span>
                </div>
                <div class="text-lg font-bold text-[#4ADE80] mb-1">0.30 ~ 0.60 <span class="text-xs font-normal">元/kWh</span></div>
                <div class="text-xs text-[#FFFFFF66] text-right mt-auto">0:00-7:00 / 23:00-24:00</div>
              </div>
            </div>
          </div>
          <div class="risk-warning bg-[#FFFFFF09] flex-[0.8] flex flex-col relative">
            <div class="flex items-center justify-between border-b border-[#FFFFFF1F] pb-3 mb-4 shrink-0  p-4">
              <h2 class="text-sm font-bold text-[#FFFFFF]">风险预警</h2>
              <div class="flex gap-2">
                <span class="text-xs text-gray-400">预警状态:</span>
                <span class="px-2 py-0 rounded text-[10px] bg-[#FF4D4F30] border border-[#FF4D4F90] text-[#FF4D4F]">紧急</span>
                <span class="px-2 py-0 rounded text-[10px] bg-[#FAAD1430] border border-[#FAAD1490] text-[#FAAD14]">重要</span>
                <span class="px-2 py-0 rounded text-[10px] bg-[#4ADE8030] border border-[#4ADE8090] text-[#4ADE80]">通知</span>
              </div>
            </div>
            <div class="warning-list flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar mb-2  pl-4">
              <div class="warning-item bg-[#FF4D4F]/5 border border-[#FF4D4F]/20 rounded p-3 relative pl-4 mr-2">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-bold text-[#FF4D4F]">极端高温</span>
                  <span class="text-xs text-gray-400">通知时间: 7:10:30</span>
                </div>
                <p class="text-xs text-gray-400 leading-relaxed">
                  成都市气象台2024年9月5日10时00分继续发布高温红色预警信号：预计我市武侯区、锦江区、青羊区、成华区、金牛区、高新南区、高新西......
                </p>
              </div>
              <div class="warning-item bg-[#FF4D4F]/5 border border-[#FF4D4F]/20 rounded p-3 relative pl-4 mr-2">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-bold text-[#FF4D4F]">极端高温</span>
                  <span class="text-xs text-gray-400">通知时间: 7:10:30</span>
                </div>
                <p class="text-xs text-gray-400 leading-relaxed">
                  成都市气象台2024年9月5日10时00分继续发布高温红色预警信号：预计我市武侯区、锦江区、青羊区、成华区、金牛区、高新南区、高新西......
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="right-panel w-[72%] flex flex-col gap-4 " style="height: calc(100% - 68px);">
          
          <div class="price-forecast bg-[#FFFFFF09] border border-[#FFFFFF01] pt-2 pb-0 flex flex-col min-h-0" style="height: calc(50% - 8px);">
            <div class="flex items-center justify-between px-4 pb-2 border-b border-[#FFFFFF1F] mb-0 shrink-0">
              <div class="metric-main-title">电价预测</div>
              <div class="flex gap-2 h-[32px]">
                <button class="px-2 my-1 py-0.5 rounded text-[11px] bg-[rgba(50,169,255,0.1)] border border-blue-500 text-blue-400 transition-colors">今日</button>
                <button class="px-2 my-1 py-0.5 rounded text-[11px] bg-transparent text-gray-400 hover:border-gray-400 transition-colors">明日</button>
              </div>
            </div>
            <div class="flex-1 min-h-0 bg-transparent rounded px-2 overflow-hidden relative">
              <div ref="forecastChartRef" class="w-full h-full absolute inset-0"></div>
            </div>
          </div>
          
          <div class="comparison-analysis bg-[#FFFFFF09] border border-[#FFFFFF01] pt-2 pb-0 flex flex-col min-h-0" style="height: calc(50% - 8px);">
            <div class="flex items-center justify-between px-4 pb-2 border-b border-[#FFFFFF1F] mb-0 shrink-0">
              <div class="metric-main-title">对比分析</div>
              <div class="flex items-center gap-3">
                <a-date-picker 
                  v-model:value="compareDate" 
                  valueFormat="YYYY-MM-DD" 
                  class="custom-dark-datepicker min-w-[150px] w-[150px]"
                  placeholder="默认今天" 
                  dropdownClassName="custom-dark-datepicker-dropdown"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode" 
                />
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-300">添加数据:</span>
                  <a-select 
                    v-model:value="compareSelect" 
                    class="custom-dark-select min-w-[150px] w-[150px]"
                    placeholder="请选择"
                    :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  >
                    <a-select-option value="all">请选择</a-select-option>
                    <a-select-option value="history">历史均值</a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
            <div class="flex-1 min-h-0 bg-transparent rounded px-2 overflow-hidden relative">
              <div ref="comparisonChartRef" class="w-full h-full absolute inset-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
definePageMeta({
  layout: 'layout'
})
// === UI 控件状态绑定 ===
const todayStr = new Date().toLocaleDateString('en-CA')
const compareDate = ref(todayStr)
const compareSelect = ref('all') // 默认请选择状态
// === 图表DOM引用 ===
const forecastChartRef = ref(null)
const comparisonChartRef = ref(null)
// === 图表实例 ===
let forecastChart = null
let comparisonChart = null
// ==================== 模拟数据 ====================
const timeAxis = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
// 模拟平滑波动的数据（类似设计稿里的波峰波谷）
const forecastData = [4500, 4800, 4700, 5200, 5500, 4900, 4800, 5800, 5100, 4900, 4600, 4900]
const comparisonData = [4200, 4400, 4600, 4500, 5300, 5000, 4800, 5600, 4900, 4700, 4500, 4600]
// =================================================
/**
 * 初始化电价预测折线图 (绿色系，贴合设计稿上半部分图表)
 */
const initForecastChart = () => {
  if (!forecastChartRef.value) return
  
  // 先销毁旧实例
  if (forecastChart) {
    forecastChart.dispose()
  }
  
  forecastChart = echarts.init(forecastChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#00E5FF',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '8%', // 奶奶把底部边距调大一点，让x轴标签显示完整
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.2)' } },
      axisLabel: { color: '#64748B', fontSize: 10, fontFamily: 'monospace', margin: 8 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 6000,
      interval: 1000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'solid' } }
    },
    series: [
      {
        name: '电价预测',
        type: 'line',
        smooth: 0.4,
        data: forecastData,
        lineStyle: { color: '#00FF9D', width: 1 }, // 奶奶把线加粗一点，更清晰
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 157, 0.3)' },
            { offset: 1, color: 'rgba(0, 255, 157, 0)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  
  forecastChart.setOption(option)
}
/**
 * 初始化对比分析折线图 (蓝色系，贴合设计稿下半部分图表)
 */
const initComparisonChart = () => {
  if (!comparisonChartRef.value) return
  
  // 先销毁旧实例
  if (comparisonChart) {
    comparisonChart.dispose()
  }
  
  comparisonChart = echarts.init(comparisonChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '8%', // 和上面保持一致
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.2)' } },
      axisLabel: { color: '#64748B', fontSize: 10, fontFamily: 'monospace', margin: 8 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 6000,
      interval: 1000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748B', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)', type: 'solid' } }
    },
    series: [
      {
        name: '对比数据',
        type: 'line',
        smooth: 0.4,
        data: comparisonData,
        lineStyle: { color: '#00B8F3', width: 1 }, // 同样加粗
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 184, 243, 0.3)' },
            { offset: 1, color: 'rgba(0, 184, 243, 0)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  
  comparisonChart.setOption(option)
}
/**
 * 窗口大小变化时重绘图表
 */
const handleResize = () => {
  forecastChart?.resize()
  comparisonChart?.resize()
}
// 生命周期
onMounted(() => {
  // 必须等 DOM 完全挂载，并且浏览器完成布局计算
  nextTick(() => {
    // 加个小延迟，确保浏览器已经计算完所有高度
    setTimeout(() => {
      initForecastChart()
      initComparisonChart()
    }, 100)
  })
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  // 销毁图表实例 防止内存泄漏
  forecastChart?.dispose()
  comparisonChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
// 奶奶额外加了个监听，当日期选择器变化时重绘图表
watch(compareDate, () => {
  nextTick(() => {
    initComparisonChart()
  })
})
</script>
<style scoped>
@import url(@/assets/css/antd.css);
.hud-bg {
  background-image: 
    radial-gradient(circle at 50% 60%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
    repeating-radial-gradient(circle at 50% 60%, transparent 0, transparent 20px, rgba(0, 229, 255, 0.02) 21px, rgba(0, 229, 255, 0.02) 21px);
  background-size: 100% 100%;
}
.metric-main-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #FFFFFF;
}
.stat-card, .period-item, .warning-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover, .period-item:hover, .warning-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.3);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
/* 奶奶加的关键样式：确保图表容器不会被内容撑开 */
.price-forecast > div:last-child,
.comparison-analysis > div:last-child {
  height: 0 !important;
  flex-grow: 1 !important;
}
</style>