<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">并网点数据</h3>
      <div class="flex rounded-md p-0.5 relative z-10">
        <button 
          v-for="tab in tabList" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-2 py-0.5 rounded border text-[11px] transition-all duration-300"
          :class="activeTab === tab.value 
            ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' 
            : 'border-transparent text-[#FFFFFFCC] hover:border-cyan-400/50'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 内容区域 按要求全量优化 完全匹配设计稿 -->
    <div class="flex-1 min-h-0 w-full mt-4 flex flex-col">
      <!-- 核心电能数据区域 按要求优化 -->
      <div class="relative flex items-center w-full mb-5" :class="layoutMode === 'sidebar' ? 'px-2' : 'px-4'">
        <!-- 正向有功电能 固定占比49.5% -->
        <div class="w-[48.5%] flex flex-col items-center justify-center -ml-1">
          <div class="w-16 h-16 rounded-full border border-transparent bg-transparent flex items-center justify-center mb-3">
            <img 
              src="/image/positive.png"  
              class="w-[100%] rounded object-cover shrink-0 mt-1"
              alt="正向有功电能"
            />
          </div>
          <p class="text-[#F9FCFCCC] text-[12px] mb-1.5">正向有功电能(万kWh)</p>
          <p class="text-[#32AFFF] text-[20px] font-medium leading-none tracking-wide">{{ gridData.forwardActiveEnergy }}</p>
        </div>

        <!-- 中间分隔线 中间深色两边透明渐变 完全匹配设计稿 -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[70%] bg-gradient-to-b from-transparent via-[#32AFFF]/60 to-transparent"></div>

        <!-- 反向有功电能 固定占比49.5% -->
        <div class="w-[48.5%] flex flex-col items-center justify-center ml-10">
          <div class="w-16 h-16 rounded-full border border-transparent bg-transparent flex items-center justify-center mb-3">
            <img 
              src="/image/negative.png"  
              class="w-[100%] rounded object-cover shrink-0 mt-1"
              alt="反向有功电能"
            />
          </div>
          <p class="text-[#F9FCFCCC] text-[12px] mb-1.5">反向有功电能(万kWh)</p>
          <p class="text-[#32AFFF] text-[20px] font-medium leading-none tracking-wide">{{ gridData.reverseActiveEnergy }}</p>
        </div>
      </div>

      <!-- 电网参数3*3网格 按要求全量优化 -->
      <div class="grid grid-cols-3 gap-1 flex-1">
        <div 
          v-for="item in gridParams" 
          :key="item.label" 
          class="bg-[#3AB2FF1F] rounded px-2 py-1 flex items-center justify-between w-full"
        >
          <span class="text-gray-200 text-[12px] font-medium text-left w-auto flex-shrink-0">{{ item.label }}</span>
          <span class="text-[#32AFFF] text-[13px] font-semibold text-right w-auto flex-shrink-0">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// 完全保留原有业务逻辑 未做任何改动
import { inject, ref, computed } from 'vue'
// 注入全局布局状态 适配sidebar/默认两种布局模式
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;
// tab配置 完全保留原有配置
const activeTab = ref('pvGrid')
const tabList = [
  { label: '光伏并网', value: 'pvGrid' },
  { label: '光伏储能', value: 'pvStorage' },
  { label: '光伏负荷', value: 'pvLoad' },
]
// 模拟数据 完全保留原有数值 后续可直接替换接口数据
const gridData = ref({
  forwardActiveEnergy: '120,138.25',
  reverseActiveEnergy: '162,466.25',
})
// 电网参数列表 完全保留原有结构
const gridParams = computed(() => [
  { label: 'P(MW)', value: '35.04' },
  { label: 'Q(MVar)', value: '-7.98' },
  { label: 'Cos', value: '-0.01' },
  { label: 'Ia(A)', value: '199.48' },
  { label: 'Ib(A)', value: '193.96' },
  { label: 'Ic(A)', value: '193.44' },
  { label: 'Ua(KV)', value: '20.41' },
  { label: 'Ub(KV)', value: '20.8' },
  { label: 'Uc(KV)', value: '20.18' },
])
</script>