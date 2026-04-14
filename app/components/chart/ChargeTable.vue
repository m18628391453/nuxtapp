<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
    <div class="flex items-center justify-between mb-2 shrink-0 relative h-[33px] max-h-[33px]">
      <div
        class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none">
      </div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">{{ title }}</h3>
      <div class="flex rounded-md p-0.5 relative z-10 py-1">
        <button v-for="btn in buttons" :key="btn" @click="activeBtn = btn"
          class="px-2 text-[10px] rounded transition-all"
          :class="btn === activeBtn ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-[#FFFFFFCC] hover:text-gray-300 cursor-pointer'">
          {{ btn }}
        </button>
      </div>
    </div>
    <div class="flex-1 w-full relative mt-2">
      <div class="flex text-gray-400 py-2 bg-cyan-900/20 font-normal text-[14px]">
        <div class="flex-1 text-center">指标</div>
        <div class="flex-1 text-center">数据</div>
        <div class="flex-[0.8] text-center">同比</div>
        <div class="flex-[0.8] text-center">环比</div>
      </div>
      <div class="flex-1 flex flex-col gap-0 justify-between text-[12px] mt-0">
        <div v-for="(row, idx) in tableData" :key="idx"
          class="flex items-center py-1.5 border-b border-cyan-900/30 hover:bg-cyan-900/20 transition-colors">
          <div class="flex-1 text-center text-gray-300">{{ row.indicator }}</div>
          <div class="flex-1 text-center text-[#00D2FF] font-medium">{{ row.data }} <span
              class="text-[10px] text-gray-300 font-normal">{{ row.unit }}</span></div>
          <div class="flex-[0.8] text-center text-emerald-400">{{ row.yoy }}</div>
          <div class="flex-[0.8] text-center text-red-500">{{ row.mom }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// 定义接收父组件的参数
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttons: { type: Array, default: () => [] },
});

const tableData = [
  { indicator: '光伏充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '市电充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '充电次数', data: '5', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '放电次数', data: '3', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '放电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '充电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
];

const activeBtn = ref(props.buttons[0]);
</script>