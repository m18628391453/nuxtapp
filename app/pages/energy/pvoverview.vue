<template>
    <div class="flex w-full h-full gap-4 box-border overflow-hidden bg-transparent text-white font-sans "
        :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
      <!-- 左侧栏：电站简介、并网点数据、社会贡献 -->
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
  
      <!-- 中间栏：核心指标、3D光伏视图、功率辐射曲线 -->
      <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
        <!-- 顶部核心指标组件，复用已封装的CenterMetrics，传入光伏专属指标 -->
        <CenterMetrics :metrics-data="pvMetrics" />
  
        <!-- 3D 光伏电站视图区域 -->
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
  
        <!-- 功率和辐射曲线图表 -->
        <div class="flex-[1.5] min-h-0"
            :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''"
        >
          <PowerRadiationChart />
        </div>
      </div>
  
      <!-- 右侧栏：发电量统计、逆变器排名、运行状态 -->
      <div class="flex flex-col h-full shrink-0 gap-4"
          :class="layoutMode === 'sidebar' ? 'min-w-[330px] max-w-[330px] max-h-[99%]' : 'min-w-[350px] max-w-[350px] max-h-[100%]'" 
      >
        <div class="flex-[4] min-h-0">
          <PowerGenerationStat />
        </div>
        <div class="flex-[4] min-h-0">
          <InverterRank />
        </div>
        <div class="flex-[4] min-h-0">
          <InverterStatus />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import CenterMetrics from '@/components/dashboard/CenterMetrics.vue' 
  import StationIntro from '@/components/energy/StationIntro.vue' 
  import GridPointData from '@/components/energy/GridPointData.vue' 
  import SocialContribution from '@/components/energy/SocialContribution.vue' 
  import PowerRadiationChart from '@/components/energy/PowerRadiationChart.vue' 
  import PowerGenerationStat from '@/components/energy/PowerGenerationStat.vue' 
  import InverterRank from '@/components/energy/InverterRank.vue' 
  import InverterStatus from '@/components/energy/InverterStatus.vue' 

  // 页面布局配置，和原有看板保持一致
  definePageMeta({
    layout: 'layout'
  })
  // 从父组件注入布局状态，兼容sidebar模式
  const layoutState = inject('layoutState');
  const { layoutMode } = layoutState;

  // 光伏页面专属核心指标数据，适配CenterMetrics组件
  const pvMetrics = [
    { title: '实时功率(MW)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
    { title: '日发电量(万kWh)', value: '26,8', change: '↓11.4%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
    { title: '最大出力(MW)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
    { title: '小时数(小时)', value: '4,156', change: '↓11.4%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
  ];
  </script>