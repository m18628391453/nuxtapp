<template>
  <div class="pv-dashboard w-full h-full bg-[#0F172A] text-white font-sans overflow-hidden flex flex-col">
    <!-- 内容容器 上下等分布局 -->
    <div class="content-container w-full h-full flex flex-col gap-3 px-3 py-3 overflow-hidden">
      <!-- 上部区域 左中右1:2:1布局 -->
      <div class="upper-section flex gap-3 flex-[1] min-h-0 overflow-hidden max-h-[50%] h-[50%]">
        <!-- 左侧 负荷模型列表+系统实时运行概括 -->
        <div class="left-panel flex-1 bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2 flex-shrink-0">
            <h2 class="text-lg font-bold">负荷模型列表</h2>
            <select class="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-1 text-sm outline-none">
              <option>请选择项目</option>
            </select>
          </div>

          <div class="system-overview flex flex-col gap-3 overflow-y-auto">
            <h3 class="text-sm font-bold text-blue-400 flex-shrink-0">系统实时运行概括</h3>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">装机容量(MW)</span>
              </div>
              <span class="text-lg font-bold">800</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">当前功率(kW)</span>
              </div>
              <span class="text-lg font-bold">200</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">今日发电量(kWh)</span>
              </div>
              <span class="text-lg font-bold">1,340.00</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">逆变器(个)</span>
              </div>
              <span class="text-lg font-bold">20</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">汇流箱(个)</span>
              </div>
              <span class="text-lg font-bold">52</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">组串(个)</span>
              </div>
              <span class="text-lg font-bold">362</span>
            </div>

            <div class="overview-item flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-blue-400">◆</span>
                <span class="text-sm opacity-80">组间热斑(个)</span>
              </div>
              <span class="text-lg font-bold">36</span>
            </div>
          </div>
        </div>

        <!-- 中间 天气信息区域 -->
        <div class="middle-panel flex-[2] bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2 flex-shrink-0">天气信息</h2>

          <!-- 今日天气卡片 -->
          <div class="today-weather relative rounded-lg overflow-hidden h-32 bg-cover bg-center flex-shrink-0"
            style="background-image: url('https://picsum.photos/id/1002/800/300');">
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative z-10 flex items-center justify-between h-full px-6">
              <div class="flex items-center gap-4">
                <span class="text-6xl">⛅</span>
                <div>
                  <div class="text-4xl font-bold">32℃</div>
                  <div class="text-sm opacity-80">多云 26-32℃</div>
                  <div class="text-xs opacity-60">星期一</div>
                </div>
              </div>
              <div class="flex flex-col gap-2 text-sm">
                <div>降水概率: <span class="text-blue-400">20%</span></div>
                <div>湿度: <span class="text-blue-400">60%</span></div>
                <div>风速: <span class="text-blue-400">4米/秒</span></div>
              </div>
            </div>
          </div>

          <!-- 温度曲线 -->
          <div ref="tempChartRef" class="h-24 flex-shrink-0"></div>

          <!-- 7天预报 -->
          <div class="seven-day-forecast flex gap-2 flex-shrink-0">
            <div v-for="(day, index) in sevenDayWeather" :key="index"
              class="forecast-item flex-1 bg-[#0F172A]/50 rounded-lg p-2 text-center">
              <div class="text-xs opacity-60 mb-1">{{ day.week }}</div>
              <div class="text-2xl mb-1">{{ day.icon }}</div>
              <div class="text-xs">{{ day.temp }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧 历史相似日列表 -->
        <div class="right-panel flex-1 bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2 text-blue-400 flex-shrink-0">历史相似日</h2>

          <div class="similar-days-table overflow-auto flex-1 min-h-0">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-blue-500/30">
                  <th class="text-left py-2 opacity-80">日期</th>
                  <th class="text-right py-2 opacity-80">相似度</th>
                  <th class="text-right py-2 opacity-80">发电量(kWh)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in similarDays" :key="index"
                  class="border-b border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                  <td class="py-2 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    {{ item.date }}
                  </td>
                  <td class="text-right py-2">{{ item.similarity }}</td>
                  <td class="text-right py-2">{{ item.power }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 下部区域 左中右1:2:1布局 -->
      <div class="lower-section flex gap-3 flex-[1] min-h-0 overflow-hidden max-h-[50%] h-[50%]">
        <!-- 左侧 预测精度 -->
        <div class="left-panel flex-1 bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2 flex-shrink-0">发电预测</h2>

          <div class="accuracy-metrics flex-shrink-0">
            <h3 class="text-sm font-bold text-blue-400 mb-3">预测精度</h3>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="metric-small bg-[#0F172A] rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-blue-400">📶</span>
                  <span class="text-xs opacity-80">今日光伏NRMSE</span>
                </div>
                <div class="text-xl font-bold text-blue-400">4.5%</div>
              </div>
              <div class="metric-small bg-[#0F172A] rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-green-400">📈</span>
                  <span class="text-xs opacity-80">今日光伏MAPE</span>
                </div>
                <div class="text-xl font-bold text-green-400">5.5%</div>
              </div>
            </div>
          </div>

          <!-- 关键：图表容器加上 min-h-0 -->
          <div ref="accuracyChartRef" class="flex-1 min-h-0"></div>
        </div>

        <!-- 中间 光伏发电预测曲线 -->
        <div class="middle-panel flex-[2] bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <div class="flex items-center justify-between border-b border-blue-500/30 pb-2 flex-shrink-0">
            <h2 class="text-lg font-bold text-blue-400">光伏发电预测曲线</h2>
            <div class="flex gap-4 text-xs">
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> 中期</div>
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-400"></span> 短期</div>
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400"></span> 中短期</div>
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> 超短期</div>
              <div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-400"></span> 实际发电</div>
            </div>
          </div>

          <!-- 关键：图表容器加上 min-h-0 -->
          <div ref="pvForecastChartRef" class="flex-1 min-h-0"></div>
        </div>

        <!-- 右侧 相似日发电曲线 -->
        <div class="right-panel flex-1 bg-[#1E293B] rounded-lg p-4 flex flex-col gap-4 overflow-hidden">
          <h2 class="text-lg font-bold border-b border-blue-500/30 pb-2 text-blue-400 flex-shrink-0">相似日发电曲线</h2>
          <div ref="similarChartRef" class="flex-1 min-h-0"></div>
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
const tempChartRef = ref(null)
const accuracyChartRef = ref(null)
const pvForecastChartRef = ref(null)
const similarChartRef = ref(null)

// 图表实例
let tempChart = null
let accuracyChart = null
let pvForecastChart = null
let similarChart = null

// ==================== 模拟数据 替换成真实接口数据即可 ====================
// 7天天气预报数据
const sevenDayWeather = [
  { week: '周一', icon: '⛅', temp: '24-32℃' },
  { week: '周二', icon: '⛅', temp: '24-32℃' },
  { week: '周三', icon: '☀️', temp: '26-36℃' },
  { week: '周四', icon: '🌧️', temp: '22-30℃' },
  { week: '周五', icon: '⛅', temp: '24-32℃' },
  { week: '周六', icon: '☁️', temp: '24-32℃' },
  { week: '周日', icon: '☀️', temp: '26-36℃' },
  { week: '周一', icon: '🌧️', temp: '22-30℃' }
]

// 历史相似日数据
const similarDays = [
  { date: '2026-03-10', similarity: '80%', power: '300' },
  { date: '2026-03-10', similarity: '80%', power: '280' },
  { date: '2026-03-10', similarity: '80%', power: '390' },
  { date: '2026-03-10', similarity: '80%', power: '256' },
  { date: '2026-03-10', similarity: '80%', power: '123' },
  { date: '2026-03-10', similarity: '80%', power: '260' },
  { date: '2026-03-10', similarity: '80%', power: '280' }
]

// 时间轴
const timeAxis = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
const shortTimeAxis = ['8:00', '9:00', '10:00', '11:00']

// 温度曲线数据
const tempData = [26, 28, 30, 31, 32, 32, 31, 30, 29, 28, 27, 26]

// 预测精度数据
const accuracyData = {
  nrmse: [280, 220, 250, 210],
  payment: [250, 210, 230, 200]
}

// 光伏发电预测数据
const pvForecastData = {
  midTerm: [3800, 3900, 4000, 4200, 4500, 4300, 4200, 4400, 4100, 4000, 3900, 3800],
  shortTerm: [3700, 3800, 3900, 4100, 4400, 4200, 4100, 4300, 4000, 3900, 3800, 3700],
  midShortTerm: [3600, 3700, 3800, 4000, 4300, 4100, 4000, 4200, 3900, 3800, 3700, 3600],
  ultraShort: [3500, 3600, 3700, 3900, 4200, 4000, 3900, 4100, 3800, 3700, 3600, 3500],
  actual: [3400, 3500, 3600, 3800, 4100, 3900, 3800, 4000, 3700, 3600, 3500, 3400]
}

// 相似日发电数据
const similarPowerData = [250, 280, 260, 270, 290, 270, 260, 280, 250, 240, 230, 220]
// ======================================================================

/**
 * 初始化温度曲线图表
 */
const initTempChart = () => {
  if (!tempChartRef.value) return

  tempChart = echarts.init(tempChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#FBBF24',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisLine: { show: false },
      axisLabel: { color: '#94A3B8', fontSize: 9 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 20,
      max: 35,
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: tempData,
        lineStyle: { color: '#FBBF24', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251, 191, 36, 0.2)' },
            { offset: 1, color: 'rgba(251, 191, 36, 0.02)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }

  tempChart.setOption(option)
}

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
      textStyle: { color: '#fff', fontSize: 9 },
      top: 0,
      right: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: shortTimeAxis,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 350,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 9 },
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
 * 初始化光伏发电预测曲线
 */
const initPvForecastChart = () => {
  if (!pvForecastChartRef.value) return

  pvForecastChart = echarts.init(pvForecastChartRef.value)

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
        name: '中期',
        type: 'line',
        smooth: true,
        data: pvForecastData.midTerm,
        lineStyle: { color: '#22D3EE', width: 1.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 211, 238, 0.15)' },
            { offset: 1, color: 'rgba(34, 211, 238, 0.02)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: '短期',
        type: 'line',
        smooth: true,
        data: pvForecastData.shortTerm,
        lineStyle: { color: '#4ADE80', width: 1.5 },
        symbol: 'none'
      },
      {
        name: '中短期',
        type: 'line',
        smooth: true,
        data: pvForecastData.midShortTerm,
        lineStyle: { color: '#FACC15', width: 1.5 },
        symbol: 'none'
      },
      {
        name: '超短期',
        type: 'line',
        smooth: true,
        data: pvForecastData.ultraShort,
        lineStyle: { color: '#FB923C', width: 1.5 },
        symbol: 'none'
      },
      {
        name: '实际发电',
        type: 'line',
        smooth: true,
        data: pvForecastData.actual,
        lineStyle: { color: '#60A5FA', width: 1.5 },
        symbol: 'none'
      }
    ]
  }

  pvForecastChart.setOption(option)
}

/**
 * 初始化相似日发电曲线
 */
const initSimilarChart = () => {
  if (!similarChartRef.value) return

  similarChart = echarts.init(similarChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#06B6D4',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: shortTimeAxis,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 350,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 9 },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: '相似日发电',
        type: 'line',
        smooth: true,
        data: similarPowerData,
        lineStyle: { color: '#06B6D4', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 182, 212, 0.25)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0.02)' }
          ])
        },
        symbol: 'none'
      }
    ]
  }

  similarChart.setOption(option)
}

/**
 * 窗口大小变化时重绘图表
 */
const handleResize = () => {
  tempChart?.resize()
  accuracyChart?.resize()
  pvForecastChart?.resize()
  similarChart?.resize()
}

// 生命周期
onMounted(() => {
  initTempChart()
  initAccuracyChart()
  initPvForecastChart()
  initSimilarChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例 防止内存泄漏
  tempChart?.dispose()
  accuracyChart?.dispose()
  pvForecastChart?.dispose()
  similarChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 科技感背景 与前两个页面保持完全一致 */
.pv-dashboard {
  background:
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
}

/* 卡片悬浮效果 */
.overview-item,
.forecast-item,
.metric-small {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.overview-item:hover,
.forecast-item:hover,
.metric-small:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.2);
}

/* 表格行hover效果 */
tbody tr {
  transition: background-color 0.2s ease;
}
</style>