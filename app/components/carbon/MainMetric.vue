<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 1.2rem 1rem 1.5rem;">
    <!-- 标题栏 完全沿用原有组件样式 不动 -->
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">主要数据指标</h3>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 min-h-0 w-full mt-[10%] mt-4 flex flex-wrap justify-between " style="height: 62%; max-height: 62%;">
      <!-- 1. 节约标准煤 -->
      <div class="flex-[49%] flex items-center">
        <img src="/image/carbonoxy.png" class="metric-icon object-contain" alt="节约标准煤">
        <div>
          <p class="text-[#32AFFF] text-[18px] font-medium leading-tight -mt-3">2,186</p>
          <p class="text-gray-300 text-[10px]">碳排总量</p>
          <p class="text-[#FFFFFF60] text-[10px]">tCO2e/万</p>
        </div>
      </div>

      <!-- 2. 减少二氧化碳排放 -->
      <div class="flex-[49%] flex items-center">
        <img src="/image/carbon_emissions_icon.png" class="metric-icon object-contain" alt="减少二氧化碳">
        <div>
          <p class="text-[#32AFFF] text-[18px] font-medium leading-tight -mt-3">1,238</p>
          <p class="text-gray-300 text-[10px]">年碳排总强度</p>
          <p class="text-[#FFFFFF60] text-[10px]">tCO2e/百万元</p>
        </div>
      </div>

      <!-- 3. 减少二氧化硫排放 -->
      <div class="flex-[49%] flex items-center">
        <img src="/image/electric_metric_icon.png" class="metric-icon object-contain" alt="减少二氧化硫">
        <div>
          <p class="text-[#32AFFF] text-[18px] font-medium leading-tight -mt-3">1,000</p>
          <p class="text-gray-300 text-[10px]">能耗总量</p>
          <p class="text-[#FFFFFF60] text-[10px]">tec/万</p>
        </div>
      </div>

      <!-- 4. 植树等效 -->
      <div class="flex-[49%] flex items-center">
        <img src="/image/consumption_icon.png" class="metric-icon object-contain" alt="植树等效">
        <div>
          <p class="text-[#32AFFF] text-[18px] font-medium leading-tight -mt-3">2,658</p>
          <p class="text-gray-300 text-[10px]">年能耗强度</p>
          <p class="text-[#FFFFFF60] text-[10px]">tec/百万元</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 业务逻辑不动，保持空即可
</script>

<style lang="css">
.metric-icon {
  width: calc(72px * 1.2);
  height: calc(68px * 1.2);
}
</style>