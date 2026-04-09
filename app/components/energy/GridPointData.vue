<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 1.2rem 1rem 1.5rem;">
    <!-- 标题栏 完全沿用原有组件样式 仅新增右侧tab 未改动原有任何样式属性 -->
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">并网点数据</h3>
      <!-- 新增tab栏 与原有标题栏布局完全兼容 不改动原有结构 -->
      <div class="ml-auto flex items-right -mr-5">
        <button 
          v-for="tab in tabList" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="px-2 py-0.5 rounded border text-[11px] transition-all duration-300"
          :class="activeTab === tab.value 
            ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' 
            : 'border-transparent text-white hover:border-cyan-400/50'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <!-- 内容区域 按设计稿1:1还原 完全适配原有容器尺寸 -->
    <div class="flex-1 min-h-0 w-full mt-4 flex flex-col">
      <!-- 核心电能数据区域 -->
      <div class="flex items-center justify-between w-full mb-5" :class="layoutMode === 'sidebar' ? 'px-2' : 'px-4'">
        <!-- 正向有功电能 -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full border border-transparent bg-transparent flex items-center justify-center mb-3">
            <img 
              src="/image/positive.png"  
              class="w-[100%] rounded object-cover shrink-0 -mt-1"
            />
          </div>
          <p class="text-white text-[13px] mb-1.5">正向有功电能(万kWh)</p>
          <p class="text-[#32AFFF] text-[20px] font-medium leading-none tracking-wide">{{ gridData.forwardActiveEnergy }}</p>
        </div>
        <!-- 反向有功电能 -->
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 rounded-full border border-transparent bg-transparent flex items-center justify-center mb-3">
            <img 
              src="/image/negative.png"  
              class="w-[100%] rounded object-cover shrink-0 -mt-1"
            />
          </div>
          <p class="text-white text-[13px] mb-1.5">反向有功电能(万kWh)</p>
          <p class="text-[#32AFFF] text-[20px] font-medium leading-none tracking-wide">{{ gridData.reverseActiveEnergy }}</p>
        </div>
      </div>
      <!-- 电网参数3*3网格 完全匹配设计稿布局 -->
      <div class="grid grid-cols-3 gap-3 flex-1">
        <div v-for="item in gridParams" :key="item.label" class="bg-[#0A162C]/40 rounded-md px-3 py-2.5 flex items-center justify-between">
          <span class="text-gray-200 text-[12px] font-medium">{{ item.label }}</span>
          <span class="text-[#32AFFF] text-[13px] font-semibold">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// 完全沿用项目原有注入逻辑 与父组件pvoverview.vue保持一致
import { inject, ref, computed } from 'vue'

// 注入全局布局状态 适配sidebar/默认两种布局模式
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

// tab配置 与设计稿完全对应
const activeTab = ref('pvGrid')
const tabList = [
{ label: '光伏并网', value: 'pvGrid' },
{ label: '光伏储能', value: 'pvStorage' },
{ label: '光伏负荷', value: 'pvLoad' },
]

// 模拟数据 与设计稿数值完全一致 后续可直接替换为接口数据
const gridData = ref({
forwardActiveEnergy: '120,138.25',
reverseActiveEnergy: '162,466.25',
})

// 电网参数列表 完全匹配设计稿的3行3列结构
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