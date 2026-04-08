<template>
  <div class="flex w-full h-full  gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
      :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <!-- 左侧 -->
    <div class="flex flex-col h-full max-h-[100%] shrink-0"
        :class="layoutMode === 'sidebar' ? 'min-w-[325px] max-w-[325px] f' : 'min-w-[345px] max-w-[345px]'" 
    >
      <div class="flex-[9] min-h-0">
        <AssetPanel />
      </div>
      <div class="flex-[5] min-h-0">
        <ProgressivePie />
      </div>
    </div>

    <!-- 中间 -->
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <CenterMetrics :metrics-data="customMetrics" />

      <!-- 3D 厂房视图区域 -->
      <div class="flex-[2.5] min-h-0 relative flex items-center justify-center rounded-lg  overflow-hidden z-1000"
              :style="{ 
              backgroundImage: `url('/image/main.png')`, 
              backgroundSize: layoutMode === 'sidebar' ? '110%': '105%',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
          }"
      >
        <div class="absolute w-full h-full pointer-events-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- 能源供需平衡分析 -->
      <div class="flex-[1.5] min-h-0"
          :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''"
      >
        <BalanceChart />
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex flex-col h-full  shrink-0"
        :class="layoutMode === 'sidebar' ? 'min-w-[330px] max-w-[330px] max-h-[99%]' : 'min-w-[350px] max-w-[350px] max-h-[100%]'" 
    >
      <!-- 系统运行模式 -->
      <div class="bg-[#0A162C]/10 rounded-lg h-[90px] px-4 justify-between shrink-0 relative overflow-hidden" style="padding-top: 0.5rem;">
        <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex py-3.5 px-4 relative -ml-1 -mr-4">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
          <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
            系统运行模式
          </h3>
        </div>
        <div class="w-full text-center mt-4 z-100">
          <span class="px-3 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-500/10 rounded-full text-[13px] font-bold">自动模式</span>
        </div>
      </div>

      <!-- 收益分析图表 -->
      <div class="flex-[8]">
        <LineBarChart 
          title="收益分析" 
          :bar-data="[380, 550, 380, 550]"
          :x-axis-data="['光伏', '风电', '储能', '辅助服务']"
        />
      </div>

      <div class="flex-[10] -mt-2">
        <ForecastChart title="发电预测" />
      </div>

      <div class="flex-[10] -mt-2">
        <ForecastChart title="负荷预测" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AssetPanel from '@/components/dashboard/AssetPanel.vue' 
import CenterMetrics from '@/components/dashboard/CenterMetrics.vue' 
import BalanceChart from '@/components/dashboard/BalanceChart.vue' 
import ForecastChart from '@/components/dashboard/ForecastChart.vue' 
import ProgressivePie from '@/components/chart/ProgressivePie.vue'
import LineBarChart from '@/components/chart/LineBarChart.vue' 

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