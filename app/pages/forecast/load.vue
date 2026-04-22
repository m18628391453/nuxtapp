<template>
  <div class="load-dashboard w-full h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
    <!-- 顶部天气栏 居右 -->
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

    <!-- 中部6个等宽指标卡片 -->
    <div class="metrics-grid flex gap-4 px-6 py-4">
      <!-- 当前总负荷 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#165DFF] to-[#4080FF] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">当前总负荷(kW)</span>
          <span class="text-2xl">⚡</span>
        </div>
        <div class="text-3xl font-bold mb-1">38,642</div>
        <div class="text-sm">
          <span class="text-red-400">↑1.6%</span> vs 预测
        </div>
      </div>

      <!-- 今日用电量 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#722ED1] to-[#9254DE] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">今日用电量(kWh)</span>
          <span class="text-2xl">⚡</span>
        </div>
        <div class="text-3xl font-bold mb-1">126,814</div>
        <div class="text-sm">
          <span class="text-green-400">↓1.4%</span> vs 昨日
        </div>
      </div>

      <!-- 关键负荷 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#00B4FF] to-[#36CFC9] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">关键负荷(kW)</span>
          <span class="text-2xl">📊</span>
        </div>
        <div class="text-3xl font-bold mb-1">12,380</div>
        <div class="text-sm">
          <span class="opacity-80">97%</span>
        </div>
      </div>

      <!-- 可调负荷 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#00B42A] to-[#36CFC9] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">可调负荷(kW)</span>
          <span class="text-2xl">🔋</span>
        </div>
        <div class="text-3xl font-bold mb-1">256</div>
        <div class="text-sm">
          <span class="opacity-80">97%</span>
        </div>
      </div>

      <!-- 可断负荷 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#FF7D00] to-[#FF9A2E] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">可断负荷(kW)</span>
          <span class="text-2xl">🔌</span>
        </div>
        <div class="text-3xl font-bold mb-1">182</div>
        <div class="text-sm">
          <span class="opacity-80">89%</span>
        </div>
      </div>

      <!-- 今日负荷高点 -->
      <div class="metric-card flex-1 bg-gradient-to-r from-[#2F54EB] to-[#722ED1] rounded-lg p-4 shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-80">今日负荷高点(kW)</span>
          <span class="text-2xl">📦</span>
        </div>
        <div class="text-3xl font-bold mb-1">32.1</div>
        <div class="text-sm">
          <span class="opacity-80">10.85</span>
        </div>
      </div>
    </div>

    <!-- 下部主内容区 左右35%/65%布局 -->
    <div class="main-content flex gap-4 px-6 py-4 h-[calc(100vh-180px)]">
      <!-- 左侧负荷预测 35% -->
      <div class="left-panel w-[35%] bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4">
        <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2">负荷预测</h2>
        
        <!-- 左侧上部指标卡片 -->
        <div class="left-metrics grid grid-cols-2 gap-4">
          <div class="metric-small bg-[#0F172A] rounded-lg p-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-blue-400">⚡</span>
              <span class="text-sm opacity-80">预测明日用电量(kWh)</span>
            </div>
            <div class="text-2xl font-bold text-blue-400">58,845</div>
          </div>

          <div class="metric-small bg-[#0F172A] rounded-lg p-3">
            <div class="text-sm opacity-80 mb-2">今日负荷峰值(kW)</div>
            <div class="text-xl font-bold">最高 821.20</div>
            <div class="text-xs opacity-60">预计 15:05</div>
          </div>

          <div class="metric-small bg-[#0F172A] rounded-lg p-3">
            <div class="text-sm opacity-80 mb-2">明日负荷峰值(kW)</div>
            <div class="text-xl font-bold">最高 821.20</div>
            <div class="text-xs opacity-60">预计明日 15:05</div>
          </div>

          <div class="metric-small grid grid-cols-2 gap-2">
            <div class="bg-[#0F172A] rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-blue-400">📶</span>
                <span class="text-xs opacity-80">今日光伏NRMSE</span>
              </div>
              <div class="text-xl font-bold text-blue-400">4.5%</div>
            </div>
            <div class="bg-[#0F172A] rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-green-400">📈</span>
                <span class="text-xs opacity-80">今日光伏MAPE</span>
              </div>
              <div class="text-xl font-bold text-green-400">5.5%</div>
            </div>
          </div>
        </div>

        <!-- 左侧下部预测精度折线图 -->
        <div class="chart-container flex-1">
          <h3 class="text-sm font-bold mb-2">预测精度</h3>
          <div ref="accuracyChartRef" class="w-full h-full"></div>
        </div>
      </div>

      <!-- 右侧发电预测 65% -->
      <div class="right-panel w-[65%] bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4">
        <!-- 顶部筛选栏 -->
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2">发电预测曲线</h2>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm opacity-80">级别：</span>
              <select class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none">
                <option>请选择</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input type="date" class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none" value="2026-04-22">
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm opacity-80">对比：</span>
              <input type="date" class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none" value="2026-04-22">
            </div>
            <button class="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors">添加</button>
          </div>
        </div>

        <!-- 右侧渐变折线图 -->
        <div ref="generationChartRef" class="flex-1"></div>

        <!-- 底部时间滑块 -->
        <div class="time-slider flex items-center gap-4">
          <span class="text-xs opacity-60">7:50</span>
          <input type="range" min="0" max="100" value="50" class="flex-1 accent-blue-500">
          <span class="text-xs opacity-60">19:00</span>
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
const accuracyChartRef = ref(null)
const generationChartRef = ref(null)

// 图表实例
let accuracyChart = null
let generationChart = null

// ==================== 模拟数据 替换成真实接口数据即可 ====================
// 预测精度图表数据
const accuracyData = {
  times: ['8:00', '9:00', '10:00', '11:00'],
  nrmse: [280, 220, 250, 210],
  payment: [250, 210, 230, 200]
}

// 发电预测图表数据
const generationData = {
  times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
  ultraShort: [4500, 4600, 4700, 4800, 5100, 4900, 5000, 5400, 4800, 4700, 4600, 4700],
  actual: [4300, 4400, 4500, 4600, 4800, 4600, 4700, 5100, 4500, 4400, 4300, 4400]
}
// ======================================================================

/**
 * 初始化预测精度折线图
 */
const initAccuracyChart = () => {
  if (!accuracyChartRef.value) return
  
  accuracyChart = echarts.init(accuracyChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#3B82F6',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['NRMSE', '支付笔数'],
      textStyle: { color: '#fff', fontSize: 10 },
      top: 0,
      right: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: accuracyData.times,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 350,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: 'NRMSE',
        type: 'line',
        smooth: true,
        data: accuracyData.nrmse,
        lineStyle: { color: '#3B82F6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '支付笔数',
        type: 'line',
        smooth: true,
        data: accuracyData.payment,
        lineStyle: { color: '#10B981', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  
  accuracyChart.setOption(option)
}

/**
 * 初始化发电预测渐变折线图
 */
const initGenerationChart = () => {
  if (!generationChartRef.value) return
  
  generationChart = echarts.init(generationChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#3B82F6',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['超短期', '实际功率'],
      textStyle: { color: '#fff', fontSize: 10 },
      top: 0,
      right: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generationData.times,
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
        name: '超短期',
        type: 'line',
        smooth: true,
        data: generationData.ultraShort,
        lineStyle: { color: '#F97316', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(249, 115, 22, 0.2)' },
            { offset: 1, color: 'rgba(249, 115, 22, 0.02)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '实际功率',
        type: 'line',
        smooth: true,
        data: generationData.actual,
        lineStyle: { color: '#06B6D4', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 182, 212, 0.2)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.02)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }
  
  generationChart.setOption(option)
}

/**
 * 窗口大小变化时重绘图表
 */
const handleResize = () => {
  accuracyChart?.resize()
  generationChart?.resize()
}

// 生命周期
onMounted(() => {
  initAccuracyChart()
  initGenerationChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例 防止内存泄漏
  accuracyChart?.dispose()
  generationChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 科技感背景 */
.load-dashboard {
  background: 
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
}

/* 卡片悬浮效果 */
.metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.metric-small {
  transition: transform 0.2s ease;
}

.metric-small:hover {
  transform: translateY(-1px);
}

/* 自定义滑块样式 */
.time-slider input[type="range"] {
  height: 6px;
  border-radius: 3px;
  background: #334155;
  outline: none;
  -webkit-appearance: none;
}

.time-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
</style>