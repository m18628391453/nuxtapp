<template>
  <div class="pv-dashboard w-full h-full bg-transparent text-white font-sans overflow-hidden flex flex-col">
    <div class="content-container w-full h-full flex flex-col gap-3 px-3 py-3 overflow-hidden">
      
      <!-- 上部区域 -->
      <div class="upper-section flex gap-3 flex-[1] min-h-0 overflow-hidden max-h-[50%] h-[50%]">
        <!-- 左侧面板 -->
        <div class="left-panel flex-[1] bg-[#FFFFFF09] flex flex-col gap-4 overflow-hidden">
          <!-- 标题栏 -->
          <div class="flex items-center justify-between border-b border-[#FFFFFF1F] pt-5 pb-5 px-3 flex-shrink-0 h-[30px]">
            <h2 class="text-[14px] font-normal text-white">负荷模型列表</h2>
            <a-select
              v-model:value="selectedProject"
              placeholder="请选择项目"
              class="custom-dark-select min-w-[150px] w-[150px]"
              size="small"
            >
              <a-select-option value="">请选择项目</a-select-option>
              <a-select-option value="project1">项目一</a-select-option>
              <a-select-option value="project2">项目二</a-select-option>
              <a-select-option value="project3">项目三</a-select-option>
            </a-select>
          </div>
          
          <div class="system-overview flex flex-col gap-3 overflow-y-auto px-4 pt-0 pb-2">
            <h3 class="text-[14px] font-normal text-[#32AFFF] flex-shrink-0 py-2">系统实时运行概括</h3>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">装机容量(MW)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">800</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">当前功率(kW)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">200</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">今日发电量(kWh)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">1,340.00</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">逆变器(个)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">20</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">汇流箱(个)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">52</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">组串(个)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">362</span>
            </div>
            
            <div class="overview-item system-metric-list flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rotate-45 bg-gradient-to-b from-[#7FCCFE] to-[#32AFFF]"></span>
                <span class="text-[14px] font-medium text-[#FFFFFFCF]">组间热斑(个)</span>
              </div>
              <span class="text-[15px] font-normal text-[#32AFFF]">36</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧复合面板 -->
        <div class="right-composite-panel bg-[#FFFFFF09] flex-[3.25] flex flex-col gap-0 overflow-hidden">
          
          <!-- 天气信息标题栏 -->
          <div class="flex w-full mb-3 flex-shrink-0 h-[30px] py-2">
             <div class="flex-[2] border-b border-[#FFFFFF1F] p-3 pb-5 flex items-center">
                <h2 class="text-[14px] font-normal text-white">天气信息</h2>
             </div>
             <div class="w-3 border-b border-[#FFFFFF1F]"></div>
          </div>
          
          <div class="flex gap-3 flex-1 min-h-0 p-1 px-2.5 pb-2">
             <div class="weather-panel flex-[2] relative overflow-hidden flex flex-col min-h-0 mt-1">
                <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/image/factory.jpg'); filter: brightness(0.75);"></div>
                <div class="relative z-10 flex flex-col h-full px-5 py-4 w-full">
                  <!-- 调整后的天气头部布局 - 星期在右侧，气候指标在左侧 -->
                  <div class="flex items-start justify-between flex-shrink-0 w-full mb-2 mt-2">
                    <div class="flex items-center gap-4">
                      <span class="text-6xl">⛅</span>
                      <div class="flex flex-col">
                        <div class="text-4xl font-medium">
                           <span>32 ℃</span>
                        </div>
                        <div class="text-sm opacity-80 mt-1">多云 26-32℃</div>
                      </div>
                      <div class="flex flex-col gap-1.5 text-sm mt-2">
                        <div>降水概率: <span class="text-white">20%</span></div>
                        <div>湿度: <span class="text-white">60%</span></div>
                        <div>风速: <span class="text-white">4米/秒</span></div>
                      </div>
                    </div>
                    <div class="text-sm font-normal opacity-80 mt-1">
                      星期一
                    </div>
                  </div>
        
                  <div class="flex gap-3 text-sm mt-2 mb-2 flex-shrink-0 text-white/80">
                    <span class="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">温度</span>
                    <span class="cursor-pointer py-1">降水概率</span>
                    <span class="cursor-pointer py-1">风力</span>
                  </div>
                  <div ref="tempChartRef" class="flex-1 min-h-0 w-full" style="filter: brightness(1.05);"></div>
        
                  <div class="seven-day-forecast flex gap-1.5 flex-shrink-0 mt-2 h-[85px]">
                    <div v-for="(day, index) in sevenDayWeather" :key="index"
                      class="forecast-item flex-1 bg-[#0F172A]/40 rounded border border-white/10 p-2 text-center flex flex-col justify-center items-center backdrop-blur-sm">
                      <div class="text-xs opacity-70 mb-1">{{ day.week }}</div>
                      <div class="text-2xl mb-1">{{ day.icon }}</div>
                      <div class="text-xs opacity-90">{{ day.temp }}</div>
                    </div>
                  </div>
                </div>
             </div>
             
             <!-- 历史相似日模块 - 已优化表格滚动 -->
             <div class="similar-days-module flex-[1] flex flex-col p-4 flex flex-col min-h-0 overflow-hidden">
                <!-- 标题栏 - 统一高度和下划线位置 -->
                <div class="pb-2 flex-shrink-0 h-[30px] flex items-center pl-2">
                    <h2 class="text-[14px] text-[#32AFFF] font-normal">历史相似日</h2>
                </div>
                
                <!-- 表格容器 - 优化滚动效果 -->
                <div class="similar-days-table overflow-hidden flex-1 min-h-0 w-[94%] pr-1 mt-3 px-5">
                  <table class="w-full text-sm overflow-hidden">
                    <thead class="sticky top-0 z-10 overflow-hidden">
                      <tr class="text-[#FFFFFF]">
                        <th class="text-left pb-3 font-normal pl-9">日期</th>
                        <th class="text-center pb-3 font-normal">相似度</th>
                        <th class="text-right pb-3 font-normal">发电量(kWh)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in similarDays" :key="index"
                        class="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td class="py-3.5 flex items-center gap-2 text-white/90">
                          <span class="w-1.5 h-1.5 rounded-full bg-[#32AFFF]"></span>
                          {{ item.date }}
                        </td>
                        <td class="text-center py-3.5 text-white/90">{{ item.similarity }}</td>
                        <td class="text-right py-3.5 text-[#32AFFF] font-medium pr-2">{{ item.power }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <!-- 下部区域 - 调整为整体面板布局 -->
      <div class="lower-section flex flex-col gap-5 flex-[1] min-h-0 overflow-hidden max-h-[50%] h-[50%] mt-1 bg-[#FFFFFF09]">
        <!-- 发电预测标题 - 占一整行 -->
        <div class="lower-title flex-shrink-0 pt-4 pb-3 px-4 border-b border-[#FFFFFF1F] pb-2">
          <h2 class="text-[14px] font-normal text-white">发电预测</h2>
        </div>
        
        <!-- 左中右三个面板容器 -->
        <div class="lower-content flex gap-8 flex-1 min-h-0 px-5">
          <!-- 左侧面板 - 预测精度 -->
          <div class="left-panel flex-1 flex flex-col gap-4 overflow-hidden">
            <div class="accuracy-metrics flex-shrink-0">
              <h3 class="sub-title">预测精度</h3>
              <div class="flex gap-3 mt-3 mb-4 shrink-0">
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
            </div>
            <div ref="accuracyChartRef" class="flex-1 min-h-0"></div>
          </div>
          
          <!-- 中间面板 - 光伏发电预测曲线 -->
          <div class="middle-panel flex-[2] flex flex-col gap-4 overflow-hidden">
            <div class="flex items-center justify-between pb-2 flex-shrink-0">
              <h2 class="sub-title">光伏发电预测曲线</h2>
            </div>
            <div ref="pvForecastChartRef" class="flex-1 min-h-0"></div>
          </div>
          
          <!-- 右侧面板 - 相似日发电曲线 -->
          <div class="right-panel flex-1 flex flex-col gap-4 overflow-hidden">
            <h2 class="sub-title pb-2 flex-shrink-0">相似日发电曲线</h2>
            <div ref="similarChartRef" class="flex-1 min-h-0"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
// 导入Ant Design Select组件
import { Select } from 'ant-design-vue'
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
// 选中的项目
const selectedProject = ref('')
// ==================== 模拟数据（已优化为真实波动走势） ====================
// 7天天气预报数据
const sevenDayWeather = [
  { week: '周一', icon: '⛅', temp: '24~32℃' },
  { week: '周二', icon: '⛅', temp: '24~32℃' },
  { week: '周三', icon: '☀️', temp: '26~36℃' },
  { week: '周四', icon: '🌧️', temp: '22~30℃' },
  { week: '周五', icon: '⛅', temp: '24~32℃' },
  { week: '周六', icon: '☁️', temp: '24~32℃' },
  { week: '周日', icon: '☀️', temp: '26~36℃' }
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
// 预测精度数据（已优化为不同走势）
const accuracyData = {
  nrmse: [280, 240, 210, 260], // 先降后升，更真实的波动
  payment: [250, 220, 240, 200] // 先降后升再降，与NRMSE走势不同
}
// 光伏发电预测数据（已优化为真实波动，不再完全平行）
const pvForecastData = {
  midTerm: [4600, 4050, 4400, 3950, 4700, 3500, 4500, 3600, 4300, 2600, 3900, 4900], // 整体偏高，12点达到峰值
  shortTerm: [4000, 3900, 4150, 4300, 3600, 3450, 4800, 4500, 4250, 4000, 3800, 4600], // 11点有个小高峰
  midShortTerm: [4600, 3800, 4000, 4250, 4500, 4350, 4100, 4400, 4150, 4900, 3100, 5500], // 13点有个小低谷
  ultraShort: [4500, 3700, 3950, 4100, 4400, 2250, 4000, 4300, 4050, 2800, 3600, 4400], // 14点达到峰值
  actual: [4400, 3600, 3850, 4000, 4300, 4150, 4900, 4200, 3950, 3700, 5500, 5300] // 实际值略低，波动更明显
}
// 相似日发电数据（已优化为真实波动）
const similarPowerData = [250, 275, 265, 295, 280, 270, 285, 260, 245, 235, 225, 215] // 增加自然小波动
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
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeAxis,
      axisLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, margin: 12 },
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' } }
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
        lineStyle: { color: '#FBBF24', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251, 191, 36, 0.4)' },
            { offset: 1, color: 'rgba(251, 191, 36, 0.05)' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#FBBF24', borderColor: '#fff', borderWidth: 1 }
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
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    legend: {
      data: ['NRMSE', '支付笔数'],
      textStyle: { color: '#fff', fontSize: 10 },
      top: '0px',
      right: 10,
      itemWidth: 16,
      itemHeight: 10,
      itemGap: 12
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '14%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: shortTimeAxis,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 300,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    series: [
      {
        name: 'NRMSE',
        type: 'line',
        smooth: true,
        color: 'rgba(59, 130, 246, 1)',
        data: accuracyData.nrmse,
        lineStyle: { color: '#3B82F6', width: 1 },
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
        color: 'rgba(16, 185, 129, 1)',
        data: accuracyData.payment,
        lineStyle: { color: '#10B981', width: 1 },
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
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10.5%',
      top: '14%',
      containLabel: true
    },
    legend: {
      data: ['中期', '短期', '中短期', '超短期', '实际发电'],
      textStyle: { color: '#fff', fontSize: 10 },
      top: '0px',
      right: 10,
      itemWidth: 16,
      itemHeight: 10,
      itemGap: 12
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
        color: '#22D3EE',
        data: pvForecastData.midTerm,
        lineStyle: { color: '#22D3EE', width: 1 },
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
        color: '#4ADE80',
        data: pvForecastData.shortTerm,
        lineStyle: { color: '#4ADE80', width: 1 },
        symbol: 'none'
      },
      {
        name: '中短期',
        type: 'line',
        smooth: true,
        color: '#FACC15',
        data: pvForecastData.midShortTerm,
        lineStyle: { color: '#FACC15', width: 1 },
        symbol: 'none'
      },
      {
        name: '超短期',
        type: 'line',
        smooth: true,
        color: '#FB923C',
        data: pvForecastData.ultraShort,
        lineStyle: { color: '#FB923C', width: 1 },
        symbol: 'none'
      },
      {
        name: '实际发电',
        type: 'line',
        smooth: true,
        color: '#60A5FA',
        data: pvForecastData.actual,
        lineStyle: { color: '#60A5FA', width: 1 },
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
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 }
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
        name: '相似日发电',
        type: 'line',
        smooth: true,
        data: similarPowerData,
        lineStyle: { color: '#06B6D4', width: 1 },
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
@import url(@/assets/css/antd.css);
.pv-dashboard {
  background: transparent;
}
.weather-panel {
  border-radius: 2px;
}
.overview-item,
.forecast-item,
.metric-small {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.overview-item:hover,
.forecast-item:hover,
.metric-small:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.system-metric-list {
  margin: 1px 10px 1px 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #FFFFFF0F;
}
tbody tr {
  transition: background-color 0.2s ease;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
/* 统一副标题样式 */
.sub-title {
  font-family: 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #32AFFF;
}
</style>