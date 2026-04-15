<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 0rem 0rem 1.25rem;">
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">储能运行数据</h3>
    </div>

    <div class="flex-1 flex flex-col justify-start mt-3 pr-4">
      
      <div class="flex items-center h-16 w-full relative mb-3">
        <div class="absolute inset-0 "></div>
        
        <div class="w-[20%] flex justify-center items-center z-10">
          <img src="/image/storageicon.png" alt="storage icon" class="object-contain" style="width: 70px;"/>
        </div>
        
        <div class="w-[80%] flex justify-around items-center z-10 bg-gradient-to-r from-transparent via-[#0F3460]/60 to-transparent py-2.5 px-3">
          <div class="flex">
            <span class="text-gray-400 text-[12px] mr-1" style="margin-top: 1px;">平均SOH</span>
            <span class="text-[#00D2FF] text-[15px] font-bold font-mono">38.25%</span>
          </div>
          <div class="flex">
            <span class="text-gray-400 text-[12px] mr-1" style="margin-top: 1px;">平均SOC</span>
            <span class="text-[#FACC15] text-[15px] font-bold font-mono">99.25%</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-3">
        <div 
          v-for="item in runData" 
          :key="item.title" 
          class="relative p-2.5 flex flex-col gap-1.5"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-[#0F3460]/30 to-transparent rounded-sm"></div>
          
          <div class="relative z-10">
            <div class="text-gray-300 text-[12px] font-medium mb-1">{{ item.title }}</div>
            <div class="flex justify-between items-center">
              <div class="flex-[1] items-baseline gap-1">
                <span class="text-gray-500 text-[12px] mr-1">{{ item.k1 }}</span>
                <span :class="item.c1" class="font-bold text-[12px]">{{ item.v1 }}</span>
              </div>
              <div class="flex-[1] items-baseline gap-1">
                <span class="text-gray-500 text-[12px] mr-1">{{ item.k2 }}</span>
                <span :class="item.c2" class="font-bold text-[12px]">{{ item.v2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// 数据结构保持不变，确保业务逻辑无缝衔接
const runData = [
  { title: '电芯温度(℃)', k1: '最高', v1: '30.2', c1: 'text-[#00D2FF]', k2: '最低', v2: '26.2', c2: 'text-[#10B981]' },
  { title: '电芯电压(V)', k1: '最高', v1: '2.92', c1: 'text-[#00D2FF]', k2: '最低', v2: '2.67', c2: 'text-[#10B981]' },
  { title: '电量(万kWh)', k1: '可充', v1: '8.24', c1: 'text-[#00D2FF]', k2: '可放', v2: '0.35', c2: 'text-[#10B981]' },
  { title: '功率(kW)', k1: '可充', v1: '1,300', c1: 'text-[#00D2FF]', k2: '可放', v2: '0.00', c2: 'text-[#10B981]' },
]
</script>

<style scoped>
/* 使用 Tailwind 处理绝大部分样式，如有特殊字体需求可在此补充 */
.font-mono {
  font-family: 'Courier New', Courier, monospace; /* 或者使用你项目中的电子数字字体 */
}
</style>