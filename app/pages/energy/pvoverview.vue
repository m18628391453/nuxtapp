<template>
    <div class="flex w-full h-full gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
        :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
      
      <div class="flex flex-col h-full max-h-[100%] shrink-0 gap-4"
          :class="layoutMode === 'sidebar' ? 'min-w-[325px] max-w-[325px]' : 'min-w-[345px] max-w-[345px]'" 
      >
        <div class="flex-[4] min-h-0">
          <StationIntro />
        </div>
        <div class="flex-[4.5] min-h-0">
          <GridPointData />
        </div>
        <div class="flex-[4.25] min-h-0">
          <SocialContribution />
        </div>
      </div>
  
      <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
        <CenterMetrics :metrics-data="pvMetrics" />
  
        <div class="flex-[2.5] min-h-0 relative flex items-center justify-center rounded-lg overflow-hidden z-10"
                :style="{ 
                backgroundImage: `url('/image/pvmain.png')`, 
                backgroundSize: layoutMode === 'sidebar' ? '110%': '105%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }"
        >
          <div class="absolute w-full h-full pointer-events-none">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-pulse"></div>
          </div>
        </div>
  
        <div class="flex-[1.5] min-h-0"
            :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''"
        >
          <PowerRadiationChart />
        </div>
      </div>
  
      <div class="flex flex-col h-full shrink-0 gap-4"
          :class="layoutMode === 'sidebar' ? 'min-w-[330px] max-w-[330px] max-h-[99%]' : 'min-w-[350px] max-w-[350px] max-h-[100%]'" 
      >
        <div class="flex-[4] min-h-0">
          <LineBarChart 
            title="发电量统计"
            :buttons="['时', '日', '月']"
            :x-axis-data="['8:00', '10:00', '12:00', '14:00']" 
            :bar-data="[190, 270, 190, 270]" 
            :line-x-axis-data="['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']"
            :line-data="[250, 180, 200, 160, 220, 280, 210, 190]"
            :y-axis-max="350"
            :y-axis-interval="50"
          />
        </div>
  
        <div class="flex-[4] min-h-0">
          <LineBarChart 
            title="逆变器日等效排名"
            :buttons="['前10', '后10']"
            :x-axis-data="['设备1', '设备2', '设备3', '设备4', '设备5', '设备6', '设备7', '设备8']" 
            :bar-data="[270, 270, 190, 270, 190, 270, 190, 190]" 
            :bar-color="['#00B4FF', '#00C5FF','#00E8FF',]"
            :y-axis-max="350"
            :y-axis-interval="50"
            :bar-width="10"
          />
        </div>
  
        <div class="flex-[4] min-h-0">
          <InverterStatus />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { inject } from 'vue' 
  import CenterMetrics from '@/components/dashboard/CenterMetrics.vue' 
  import StationIntro from '@/components/energy/StationIntro.vue' 
  import GridPointData from '@/components/energy/GridPointData.vue' 
  import SocialContribution from '@/components/energy/SocialContribution.vue' 
  import PowerRadiationChart from '@/components/energy/PowerRadiationChart.vue' 
  import LineBarChart from '@/components/dashboard/LineBarChart.vue' 
  import InverterStatus from '@/components/energy/InverterStatus.vue' 
  
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