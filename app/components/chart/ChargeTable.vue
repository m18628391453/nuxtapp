<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden font-sans">
    <div class="flex items-center justify-between mb-2 shrink-0 relative h-[33px] max-h-[33px]">
      <div
        class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none">
      </div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10 tracking-wider">{{ title }}</h3>
      <div class="flex rounded-md p-0.5 relative z-10 py-1 mr-1">
        <button v-for="btn in buttons" :key="btn" @click="activeBtn = btn"
          class="px-2 py-0.5 text-[10px] rounded transition-all ml-1"
          :class="btn === activeBtn ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/50 cursor-pointer' : 'text-[#FFFFFFCC] hover:text-gray-300 cursor-pointer border border-transparent'">
          {{ btn }}
        </button>
      </div>
    </div>

    <div class="flex-1 w-full relative mt-2 flex flex-col">
      <div class="flex text-[#FFFFFFF9] py-2 bg-transparent font-medium text-[13px] border-b border-cyan-900/10">
        <div class="flex-1 text-center">指标</div>
        <div class="flex-1 text-center">数据</div>
        <div class="flex-1 text-center">同比</div>
        <div class="flex-1 text-center">环比</div>
      </div>

      <div class="flex-1 flex flex-col overflow-y-auto custom-scrollbar -mt-1">
        <div v-for="(row, idx) in tableData" :key="idx"
          class="flex items-center py-1.5 transition-colors text-[13px]"
          :class="idx % 2 === 0 ? 'bg-cyan-900/10' : 'bg-transparent'">
          
          <div class="flex-1 text-center text-[#FFFFFFE9]">{{ row.indicator }}</div>
          
          <div class="flex-1 text-center text-[#00D2FF] font-semibold flex items-baseline justify-center gap-1">
            <span>{{ row.data }}</span>
            <span class="text-[10px] text-[#FFFFFFCC] font-normal">{{ row.unit }}</span>
          </div>
          
          <div class="flex-1 text-center text-[#4ADE80] flex items-center justify-center gap-1">
            <span v-if="row.yoy.includes('↓')">↓</span>
            <span v-if="row.yoy.includes('↑')">↑</span>
            <span>{{ row.yoy.replace(/[↓↑]\s*/, '') }}</span>
          </div>
          
          <div class="flex-1 text-center text-[#F87171] flex items-center justify-center gap-1">
            <span v-if="row.mom.includes('↓')">↓</span>
            <span v-if="row.mom.includes('↑')">↑</span>
            <span>{{ row.mom.replace(/[↓↑]\s*/, '') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义接收父组件的参数
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttons: { 
    type: Array, 
    default: () => ['日', '月', '年'] 
  },
});

const tableData = [
  { indicator: '光伏充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '市电充电', data: '8.25', unit: '万kWh', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '充电次数', data: '5', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '放电次数', data: '3', unit: '次', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '充电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
  { indicator: '放电时长', data: '8.25', unit: 'h', yoy: '↓ 11.4%', mom: '↑ 1.6%' },
];

const activeBtn = ref(props.buttons[0] || '日');
</script>

<style scoped>
/* 奶奶特意为你准备的滚动条美化，防止数据多了变丑 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 210, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

/* 确保文字在深色背景下有良好的渲染 */
div {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>