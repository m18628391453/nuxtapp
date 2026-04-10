<template>
  <div class="flex w-full h-full  gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
    :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <!-- 中间 -->
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <!-- 设备视图 -->
      <div class="flex-1 mt-0 mb-0">
        <PlantView class="flex-1" />
      </div>
      <!-- 能源供需平衡分析 -->
      <div class="flex-[1.5] max-h-[310px] h-[310px] shrink-0 mb-5 px-3">
        <BalanceChart />
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex flex-col h-full  shrink-0"
      :class="layoutMode === 'sidebar' ? 'min-w-[400px] max-w-[400px] max-h-[99%]' : 'min-w-[425px] max-w-[425px] max-h-[100%]'">
      <!-- 系统运行模式 -->
      <OperationMode title="模式切换" modeText="自动模式" />

      <!-- 收益分析图表 -->
      <div class="flex-[8] mt-1">
        <ElectricityPrice />
      </div>

      <div class="flex-[10] -mt-3">
        <LineChart title="出力情况" />
      </div>

      <div class="flex-[10] -mt-2.5">
        <LineChart title="负荷运行情况" />
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

definePageMeta({
  layout: 'layout'
})

// 从父组件注入状态和方法
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

// 自定义指标数据
const customMetrics = [
  { title: '今日用电量(kWh)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '综合电费_风平谷折算(元)', value: '26,814', change: '↓节约', vs: '¥3,280', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '光伏发电量(kWh)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '储能套利收益_今日(元)', value: '4,156', change: 'SOC 74%', vs: '· 充放21次', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
  { title: '碳排放强度_双碳(tCO₂/万元)', value: '0.382', change: '↓11.4%', vs: 'vs 目标', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '绿电消纳占比_GEC(%)', value: '32.1', change: '↑2.4%', vs: 'vs 上月', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
];
</script>