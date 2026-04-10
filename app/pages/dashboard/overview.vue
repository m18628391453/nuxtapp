<template>
  <div class="flex w-full h-full  gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
    :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <!-- 左侧 -->
    <div class="flex flex-col h-full max-h-[100%] shrink-0"
      :class="layoutMode === 'sidebar' ? 'min-w-[360px] max-w-[360px] f' : 'min-w-[370px] max-w-[370px]'">
      <!-- 资产信息面板 -->
      <div class="flex-[9] min-h-0">
        <AssetPanel />
      </div>

      <!-- 用电组成饼状图 -->
      <div class="flex-[5] min-h-0">
        <ProgressivePie title="各系统用电组成" center-title="总用电量(kWh)" unit="kWh" :pie-size="240" :inner-radius-ratio="0.4"
          :max-thickness="0.6" :pie-data="[
            { name: '对虾车间', value: 4544, color: '#54D1FF', gradientStart: '#33A8FFC0' },
            { name: '鲈鱼车间', value: 3321, color: '#5DE999', gradientStart: '#3DD17AC0' },
            { name: '水藻车间', value: 3113, color: '#76E8F0', gradientStart: '#55D0E0C0' },
          ]" />
      </div>
    </div>

    <!-- 中间 -->
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <!-- 顶部指标数据 -->
      <TopMetrics :metrics-data="customMetrics" />

      <!-- 厂房视图区域 -->
      <FactoryView 
        :custom-style="{
          backgroundImage: `url('/image/main.png')`,
          backgroundSize: layoutMode === 'sidebar' ? '110%' : '105%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }"
      />

      <!-- 能源供需平衡分析 -->
      <div class="flex-[1.5] min-h-0" :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''">
        <BalanceChart />
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex flex-col h-full  shrink-0"
      :class="layoutMode === 'sidebar' ? 'min-w-[365px] max-w-[365px] max-h-[99%]' : 'min-w-[375px] max-w-[375px] max-h-[100%]'">
      <!-- 系统运行模式 -->
      <OperationMode title="系统运行模式" modeText="自动模式" />

      <!-- 收益分析图表 -->
      <div class="flex-[8] mt-1">
        <LineBarChart title="收益分析" :bar-data="[380, 550, 380, 550]" :x-axis-data="['光伏', '风电', '储能', '辅助服务']" />
      </div>

      <div class="flex-[10] -mt-1.5">
        <LineChart title="发电预测" />
      </div>

      <div class="flex-[10] -mt-2">
        <LineChart title="负荷预测" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AssetPanel from '@/components/dashboard/AssetPanel.vue'
import TopMetrics from '@/components/common/TopMetrics.vue'
import BalanceChart from '@/components/chart/BalanceChart.vue'
import ProgressivePie from '@/components/chart/ProgressivePie.vue'
import LineChart from '@/components/chart/LineChart.vue'
import LineBarChart from '@/components/chart/LineBarChart.vue'
import OperationMode from '@/components/dashboard/OperationMode.vue'
import FactoryView from '@/components/dashboard/FactoryView.vue'

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