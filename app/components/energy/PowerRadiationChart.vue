<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden z-10">
      <!-- 标题栏 完全沿用原有BalanceChart组件样式 -->
      <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
        <div class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
        <div class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">功率和辐射曲线</h3>
        <div class="flex rounded-md p-0.5 relative z-10">
          <button v-for="btn in ['今日', '昨日', '本月', '今年']" :key="btn" class="px-2 py-0.5 text-[10px] rounded transition-all" :class="btn === '今日' ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-gray-500 hover:text-gray-300 cursor-pointer'">{{ btn }}</button>
        </div>
      </div>

      <!-- 图表区域 后续补充ECharts代码 -->
      <div class="flex-1 relative min-h-0 w-full mt-2">
        <!-- 待填充VueECharts组件 -->
      </div>
    </div>
</template>

<script setup>
// 后续补充ECharts配置和业务逻辑
</script>