<template>
    <div class="flex w-full h-full p-4 gap-4 box-border overflow-hidden bg-transparent text-white font-sans">
      <!-- 左侧 -->
      <div class="min-w-[356px] max-w-[356px] flex flex-col h-full max-h-[100%] shrink-0">
        <div class="flex-9 min-h-0">
          <AssetPanel />
        </div>
        <div class="flex-5 min-h-0">
          <PowerPie />
        </div>
      </div>
  
      <!-- 中间 -->
      <div class="flex-1 flex flex-col gap-4 h-full min-w-[500px]">
        <CenterMetrics />
  
        <!-- 3D 厂房视图区域 -->
        <div class="flex-[2.5] min-h-0 relative flex items-center justify-center rounded-lg  overflow-hidden">
          <div class="absolute w-full h-full pointer-events-none">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-pulse"></div>
          </div>
        </div>
  
        <!-- 能源供需平衡分析 -->
        <div class="flex-[1.5] min-h-0">
          <BalanceChart />
        </div>
      </div>
  
      <!-- 右侧 -->
      <div class="min-w-[360px] max-w-[360px] flex flex-col h-full shrink-0">
        <!-- 系统运行模式 -->
        <div class="bg-[#0A162C]/10 rounded-lg h-[90px] px-4 justify-between shrink-0 relative overflow-hidden">
          <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex py-3.5 px-4 relative -ml-1 -mr-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
            <h3 class="text-sm font-bold text-white ml-1 leading-none">
              系统运行模式
            </h3>
          </div>
          <div class="w-full text-center mt-4 z-100">
            <span class="px-3 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-500/10 rounded-full text-[13px] font-bold">自动模式</span>
          </div>
        </div>
  
        <div class="flex-11">
          <RevenueChart />
        </div>
  
        <div class="flex-11 -mt-2">
          <ForecastChart title="发电预测" />
        </div>
  
        <div class="flex-11 -mt-2">
          <ForecastChart title="负荷预测" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'dashboard'
  })
  </script>