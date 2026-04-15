<template>
  <div class="flex w-full h-full gap-10 box-border overflow-hidden bg-transparent text-white font-sans "
    :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <div class="flex flex-col h-full max-h-[100%] shrink-0 gap-4"
      :class="layoutMode === 'sidebar' ? 'min-w-[360px] max-w-[360px]' : 'min-w-[370px] max-w-[370px]'">
      <div class="flex-[5] min-h-0">
        <StationIntro />
      </div>
      <div class="flex-[4.5] min-h-0 -mt-4">
        <RingPie title="尖峰平谷占比" center-title="总用电量(kWh)" unit="kWh" :pie-size="240" :inner-radius-ratio="0.4"
          :max-thickness="0.6" :pie-data="[
            { name: '峰', value: 2658, color: '#00A2FF', gradientStart: '#00A2FFC0' },
            { name: '尖', value: 1358, color: '#00FFA2', gradientStart: '#00FFA2C0' },
            { name: '谷', value: 3723, color: '#D2E43B', gradientStart: '#D2E43BC0' },
            { name: '平', value: 1658, color: '#FFB822', gradientStart: '#FFB822C0' },
          ]"/>
      </div>
      <div class="flex-[5] min-h-0 -mt-4">
        <StorageRunData />
      </div>
    </div>

    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <TopMetrics :metrics-data="pvMetrics" />
      <div 
        class="flex-[2.5] min-h-0 relative flex items-center justify-center rounded-lg overflow-hidden z-10"
        :style="{
          backgroundImage: `url('/image/stmain.png')`,
          backgroundSize: layoutMode === 'sidebar' ? '68%' : '62%',
          backgroundPosition: layoutMode === 'sidebar' ? 'center 60px' : 'center -5px',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.0) drop-shadow(0 0 35px rgba(50, 175, 255, 0.5))',
        }"
      >
        <div 
          class="absolute w-full h-full pointer-events-none"
          style="
            background: radial-gradient(circle at center, rgba(50, 175, 255, 0.2) 0%, rgba(50, 175, 255, 0.08) 40%, transparent 75%);
            mix-blend-mode: screen;
            z-index: 1;
          "
        ></div>

        <div class="absolute w-full h-full pointer-events-none" style="z-index: 2;">
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-pulse"
            style="border: 1px solid rgba(50, 175, 255, 0.12);"
          >
          </div>
        </div>

        <div class="absolute top-[8%] z-20 text-center min-w-[120px] max-w-[140px]" :class="layoutMode === 'sidebar' ? 'left-[8%]': 'left-[14%]'">
          <h4 class="text-[16.75px] font-normal text-white mb-3 py-1.5 bg-gradient-to-r from-transparent via-[#32AFFF]/30 to-transparent">负荷用电</h4>
          <div class="flex flex-col gap-1.5 text-[12px] text-left">
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">充电功率(MW)</span><span class="text-[#32AFFF] font-medium">960</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">日充电量(万kWh)</span><span class="text-[#32AFFF] font-medium">960</span></p>
          </div>
        </div>

        <div class="absolute top-[8%] z-20 text-center min-w-[120px] max-w-[140px]" :class="layoutMode === 'sidebar' ? 'right-[8%]': 'right-[14%]'">
          <h4 class="text-[16.75px] font-normal text-white mb-3 py-1.5 bg-gradient-to-r from-transparent via-[#32AFFF]/30 to-transparent">市电</h4>
          <div class="flex flex-col gap-1.5 text-[12px] text-left">
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">充电功率(MW)</span><span class="text-[#32AFFF] font-medium">960</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">日充电量(万kWh)</span><span class="text-[#32AFFF] font-medium">960</span></p>
          </div>
        </div>

        <div class="absolute bottom-[10%] z-20 text-center min-w-[120px] max-w-[140px]" :class="layoutMode === 'sidebar' ? 'left-[6%]': 'left-[10%]'">
          <h4 class="text-[16.75px] font-normal text-white mb-3 py-1.5 bg-gradient-to-r from-transparent via-[#32AFFF]/30 to-transparent">储能系统</h4>
          <div class="flex flex-col gap-1.5 text-[12px] text-left">
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">PCS台数(台)</span><span class="text-[#32AFFF] font-medium">99</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">充电台数(台)</span><span class="text-[#32AFFF] font-medium">11</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">放电台数(台)</span><span class="text-[#32AFFF] font-medium">22</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">最大SOC(%)</span><span class="text-[#32AFFF] font-medium">12</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">最小SOC(%)</span><span class="text-[#32AFFF] font-medium">8.52</span></p>
          </div>
        </div>

        <div class="absolute bottom-[12%] z-20 text-center min-w-[120px] max-w-[140px]" :class="layoutMode === 'sidebar' ? 'right-[8%]': 'right-[16%]'">
          <h4 class="text-[16.75px] font-normal text-white mb-3 py-1.5 bg-gradient-to-r from-transparent via-[#32AFFF]/30 to-transparent">光伏</h4>
          <div class="flex flex-col gap-1.5 text-[12px] text-left">
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">充电功率(MW)</span><span class="text-[#32AFFF] font-medium">960</span></p>
            <p class="flex justify-between items-center gap-4"><span class="text-gray-300">日充电量(万kWh)</span><span class="text-[#32AFFF] font-medium">960</span></p>
          </div>
        </div>
        </div>
      <div class="flex-[1.5] min-h-0" :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''">
        <DateLineChart title="充放电曲线" />
      </div>
    </div>

    <div class="flex flex-col h-full shrink-0 gap-4"
      :class="layoutMode === 'sidebar' ? 'min-w-[365px] max-w-[365px] max-h-[99%]' : 'min-w-[375px] max-w-[375px] max-h-[100%]'">
      <div class="flex-[4] min-h-0">
        <LineBarChart title="发电量统计" :buttons="['日', '月', '年']" :x-axis-data="['8:00', '10:00', '12:00', '14:00']"
          :bar-data="[190, 270, 190, 270]"
          :line-x-axis-data="['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']"
          :line-data="[250, 180, 200, 160, 220, 280, 210, 190]" :y-axis-max="350" :y-axis-interval="50" />
      </div>
      <div class="flex-[4] min-h-0">
        <ChargeTable title="充放电分析" :buttons="['日', '月', '年']" />
      </div>
      <div class="flex-[4] min-h-0">
        <ProgressivePie title="设备运行状态" center-title="总台数" unit="台" layout="row" 
          :pie-size="200"
          :inner-radius-ratio="0.4" 
          :max-thickness="0.6"
          :pie-data="[
            { name: '安全告警', value: 5, color: '#FACC15', gradientStart: '#CA8A04' },
            { name: '停机告警', value: 10, color: '#10B981', gradientStart: '#0D9488' },
            { name: '电量告警', value: 15, color: '#F97316', gradientStart: '#EA580C' },
            { name: '通讯中断', value: 15, color: '#22D3EE', gradientStart: '#0891B2' },
            { name: '运行正常', value: 80, color: '#4FAFFF', gradientStart: '#3E70B8' },
          ]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import TopMetrics from '@/components/common/TopMetrics.vue'
import StationIntro from '@/components/energy/StationIntro.vue'
import LineBarChart from '@/components/chart/LineBarChart.vue'
import DateLineChart from '@/components/chart/DateLineChart.vue'
import ProgressivePie from '@/components/chart/ProgressivePie.vue'
import RingPie from '@/components/chart/RingPie.vue'
import StorageRunData from '@/components/energy/StorageRunData.vue'
import ChargeTable from '@/components/chart/ChargeTable.vue'

definePageMeta({
  layout: 'layout'
})

const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

const pvMetrics = [
  { title: '实时功率(MW)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '日发电量(万kWh)', value: '26,814', change: '↓11.4%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  { title: '最大出力(MW)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
  { title: '利用小时数(小时)', value: '4,156', change: '↓11.4%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
];
</script>