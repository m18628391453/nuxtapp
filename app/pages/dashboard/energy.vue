<template>
  <div class="flex w-full h-full  gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
    :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <!-- 左侧 -->
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <!-- 设备视图 -->
      <div class="flex-1 mt-0 mb-0">
        <PlantView class="flex-1" />
      </div>
      <!-- 能源供需平衡分析 -->
      <div class="flex-[1.5] max-h-[300px] h-[300px] shrink-0 mb-3 px-3">
        <BalanceChart />
      </div>
    </div>
    <!-- 右侧 -->
    <div class="flex flex-col h-full  shrink-0"
      :class="layoutMode === 'sidebar' ? 'min-w-[425px] max-w-[425px] max-h-[98%]' : 'min-w-[425px] max-w-[425px] max-h-[98%]'">
      <!-- 系统运行模式 -->
      <OperationMode title="模式切换" modeText="自动模式" />
      <!-- 收益分析图表 -->
      <div class="flex-[8] mt-2">
        <ElectricityPrice />
      </div>
      <!-- 出力情况 -->
      <div class="flex-[10] -mt-2.5">
        <LineChart 
          title="出力情况" 
          :x-axis-data="timeXAxis"
          :y-axis-config="yAxis350"
          :series-data="outputSeries"
        />
      </div>
      <!-- 负荷运行情况 -->
      <div class="flex-[10] -mt-3">
        <LineChart 
          title="负荷运行情况" 
          :x-axis-data="timeXAxis"
          :y-axis-config="yAxis350"
          :series-data="loadSeries"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import PlantView from '@/components/dashboard/PlantView.vue'
import BalanceChart from '@/components/chart/BalanceChart.vue'
import LineChart from '@/components/chart/LineChart.vue'
import OperationMode from '@/components/dashboard/OperationMode.vue'
import ElectricityPrice from '@/components/dashboard/ElectricityPrice.vue'
// 导入echarts用于渐变配置
import * as echarts from 'echarts';

definePageMeta({
  layout: 'layout'
})
// 从父组件注入状态和方法
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

// ---------------- 新增：两个折线图的配置（完全匹配设计稿） ----------------
// x轴时间数据（和设计稿8:00-12:00时间轴一致）
const timeXAxis = ['8:00', '8:20', '8:40', '9:00', '9:20', '9:40', '10:00', '10:20', '10:40', '11:00', '11:30', '12:00'];
// y轴配置（和设计稿0-350，间隔50一致）
const yAxis350 = { max: 350, interval: 50 };

// 出力情况：橙色单条线+橙色渐变
const outputSeries = [
  {
    name: '总出力',
    type: 'line',
    color: '#FFB800',
    smooth: true,
    showSymbol: false,
    // 数据完全匹配设计稿的曲线走势
    data: [300, 280, 260, 290, 310, 270, 290, 300, 280, 260, 250, 240],
    lineStyle: { width: 1.0 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(255, 184, 0, 0.3)' },
        { offset: 1, color: 'rgba(255, 184, 0, 0)' }
      ])
    }
  }
];

// 负荷运行情况：绿色单条线+绿色渐变
const loadSeries = [
  {
    name: '总负荷',
    type: 'line',
    color: '#1DFF8B',
    smooth: true,
    showSymbol: false,
    // 数据完全匹配设计稿的曲线走势
    data: [250, 280, 260, 240, 270, 300, 280, 260, 240, 270, 250, 240],
    lineStyle: { width: 1.0 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(29, 255, 139, 0.3)' },
        { offset: 1, color: 'rgba(29, 255, 139, 0)' }
      ])
    }
  }
];

// 自定义指标数据（原封不动保留）
const customMetrics = [
  { title: '今日用电量(kWh)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '综合电费_风平谷折算(元)', value: '26,814', change: '↓节约', vs: '¥3,280', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '光伏发电量(kWh)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '储能套利收益_今日(元)', value: '4,156', change: 'SOC 74%', vs: '· 充放21次', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
  { title: '碳排放强度_双碳(tCO₂/万元)', value: '0.382', change: '↓11.4%', vs: 'vs 目标', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '绿电消纳占比_GEC(%)', value: '32.1', change: '↑2.4%', vs: 'vs 上月', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
];
</script>