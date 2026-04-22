<template>
  <div class="price-dashboard w-full h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
    <!-- 顶部天气栏 直接复用负荷预测页面代码 -->
    <div class="weather-bar flex justify-end items-center gap-6 px-6 py-3 text-sm">
      <div class="flex items-center gap-2">
        <span>今日：</span>
        <span class="text-yellow-400">☁️ 28℃</span>
        <span>湿度 70%</span>
      </div>
      <div class="flex items-center gap-2">
        <span>明日：</span>
        <span class="text-yellow-400">☁️ 28℃</span>
        <span>湿度 70%</span>
      </div>
      <div class="text-orange-400 text-xs">
        最近7天天气预警：4月15日橙色高温预警38℃ 、4月20日大风蓝色预警7级
      </div>
    </div>

    <!-- 主内容区 左右布局 -->
    <div class="main-content flex gap-4 px-6 py-4 h-[calc(100vh-60px)]">
      <!-- 左侧面板 约30%宽度 -->
      <div class="left-panel w-[30%] flex flex-col gap-4">
        <!-- 上部电价信息 -->
        <div class="price-info bg-[#1E293B] rounded-lg p-4 flex-1">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2 mb-4">电价信息</h2>
          
          <!-- 当前电价 -->
          <div class="current-price flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-blue-400 text-2xl">⚡</span>
              <span class="text-sm opacity-80">当前电价(元/kWh)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-bold text-red-400">1.68</span>
              <span class="text-xs opacity-60">峰段至12:00</span>
            </div>
          </div>

          <!-- 今日平均电价 & 峰谷差价 -->
          <div class="price-stats grid grid-cols-2 gap-4 mb-4">
            <div class="stat-card bg-[#0F172A] rounded-lg p-3">
              <div class="text-sm opacity-80 mb-1">今日平均电价(元/kWh)</div>
              <div class="text-2xl font-bold text-blue-400">0.88</div>
              <div class="text-xs">
                <span class="text-red-400">↑1.6%</span> VS 昨日
              </div>
            </div>
            <div class="stat-card bg-[#0F172A] rounded-lg p-3">
              <div class="text-sm opacity-80 mb-1">峰谷差价(元/kWh)</div>
              <div class="text-2xl font-bold text-green-400">1.08</div>
              <div class="text-xs">
                <span class="text-green-400">↓1.6%</span> VS 昨日
              </div>
            </div>
          </div>

          <!-- 丰水期/平水期/谷水期标签 -->
          <div class="period-tabs flex gap-2 mb-4">
            <button class="px-3 py-1 rounded text-xs bg-blue-500">丰水期</button>
            <button class="px-3 py-1 rounded text-xs bg-[#0F172A] opacity-70">平水期</button>
            <button class="px-3 py-1 rounded text-xs bg-[#0F172A] opacity-70">谷水期</button>
          </div>

          <!-- 峰平谷时段 -->
          <div class="time-periods flex flex-col gap-3">
            <!-- 峰段 -->
            <div class="period-item bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="text-red-400">↗</span>
                  <span class="text-sm font-bold text-red-400">峰段</span>
                </div>
                <span class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">当前时段</span>
              </div>
              <div class="text-xl font-bold text-red-400 mb-1">1.38 ~ 1.68 元/kWh</div>
              <div class="text-xs opacity-60">8:00-12:00 / 14:00-17:00 / 19:00-23:00</div>
            </div>

            <!-- 平段 -->
            <div class="period-item bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-yellow-400">→</span>
                <span class="text-sm font-bold text-yellow-400">平段</span>
              </div>
              <div class="text-xl font-bold text-yellow-400 mb-1">0.98 ~ 1.18 元/kWh</div>
              <div class="text-xs opacity-60">7:00-8:00 / 12:00-14:00 / 17:00-19:00</div>
            </div>

            <!-- 谷段 -->
            <div class="period-item bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-green-400">↘</span>
                <span class="text-sm font-bold text-green-400">谷段</span>
              </div>
              <div class="text-xl font-bold text-green-400 mb-1">1.38 ~ 1.68 元/kWh</div>
              <div class="text-xs opacity-60">0:00-7:00 / 23:00-24:00</div>
            </div>
          </div>
        </div>

        <!-- 下部风险预警 -->
        <div class="risk-warning bg-[#1E293B] rounded-lg p-4 flex-1">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2 mb-4">
            <h2 class="text-lg font-bold">风险预警</h2>
            <div class="flex gap-2">
              <span class="text-xs">预警状态:</span>
              <span class="px-2 py-0.5 rounded text-xs bg-purple-500">紧急</span>
              <span class="px-2 py-0.5 rounded text-xs bg-red-500">重要</span>
              <span class="px-2 py-0.5 rounded text-xs bg-blue-500">通知</span>
            </div>
          </div>

          <!-- 预警列表 -->
          <div class="warning-list flex flex-col gap-3">
            <div class="warning-item bg-[#0F172A] rounded-lg p-3 border-l-4 border-red-500">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-red-400">极端高温</span>
                <span class="text-xs opacity-60">通知时间: 7:10:30</span>
              </div>
              <p class="text-xs opacity-70 leading-relaxed">
                成都市气象台2024年9月5日10时00分继续发布高温红色预警信号：预计我市武侯区、锦江区、青羊区、成华区、金牛区、高新南区、高新西......
              </p>
            </div>

            <div class="warning-item bg-[#0F172A] rounded-lg p-3 border-l-4 border-red-500">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-red-400">极端高温</span>
                <span class="text-xs opacity-60">通知时间: 7:10:30</span>
              </div>
              <p class="text-xs opacity-70 leading-relaxed">
                成都市气象台2024年9月5日10时00分继续发布高温红色预警信号：预计我市武侯区、锦江区、青羊区、成华区、金牛区、高新南区、高新西......
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 约70%宽度 上下两个等高图表 -->
      <div class="right-panel w-[70%] flex flex-col gap-4">
        <!-- 上部电价预测图表 -->
        <div class="price-forecast bg-[#1E293B] rounded-lg p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2 mb-4">
            <h2 class="text-lg font-bold">电价预测</h2>
            <div class="flex gap-2">
              <button class="px-3 py-1 rounded text-xs bg-blue-500">今日</button>
              <button class="px-3 py-1 rounded text-xs bg-[#0F172A] opacity-70">明日</button>
            </div>
          </div>
          <div ref="forecastChartRef" class="flex-1"></div>
        </div>

        <!-- 下部对比分析图表 -->
        <div class="comparison-analysis bg-[#1E293B] rounded-lg p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2 mb-4">
            <h2 class="text-lg font-bold">对比分析</h2>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <input type="date" class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none" value="2026-04-22">
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm opacity-80">添加数据:</span>
                <select class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none">
                  <option>请选择</option>
                </select>
              </div>
            </div>
          </div>
          <div ref="comparisonChartRef" class="flex-1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

definePageMeta({
  layout: 'layout'
})

// 图表DOM引用
const forecastChartRef = ref(null)
const comparisonChartRef = ref(null)

// 图表实例
let forecastChart = null
let comparisonChart = null

// ==================== 模拟数据 替换成真实接口数据即可 ====================
const timeAxis = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

// 电价预测数据
const forecastData = [4500, 4800, 4700, 5000, 5500, 5200, 5000, 5800, 5200, 5000, 4800, 4900]

// 对比分析数据
const comparisonData = [4200, 4400, 4600, 4500, 5300, 5000, 4800, 5600, 4900, 4700, 4500, 4600]
// ======================================================================

/**
 * 初始化电价预测折线图
 */
const initForecastChart = () => {
  if (!forecastChartRef.value) return
  
  forecastChart = echarts.init(forecastChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#10B981',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 6000,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: '电价预测',
        type: 'line',
        smooth: true,
        data: forecastData,
        lineStyle: { color: '#10B981', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  
  forecastChart.setOption(option)
}

/**
 * 初始化对比分析折线图
 */
const initComparisonChart = () => {
  if (!comparisonChartRef.value) return
  
  comparisonChart = echarts.init(comparisonChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#3B82F6',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 6000,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: '对比数据',
        type: 'line',
        smooth: true,
        data: comparisonData,
        lineStyle: { color: '#3B82F6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
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
  initForecastChart()
  initComparisonChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例 防止内存泄漏
  forecastChart?.dispose()
  comparisonChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 科技感背景 与负荷预测页面保持一致 */
.price-dashboard {
  background: 
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
}

/* 卡片悬浮效果 */
.stat-card, .period-item, .warning-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover, .period-item:hover, .warning-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.2);
}
</style>661