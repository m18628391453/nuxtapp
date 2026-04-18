<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden border border-white/5">
        <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-4">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <h3 class="text-[14px] font-bold text-white ml-1 leading-none tracking-wider">{{ title }}</h3>
        </div>

        <div class="flex-1 flex items-center justify-around px-2 mt-3">
            <div class="flex flex-col items-center">
                <LiquidBall :value="monthValue" :size="140" />
                <span class="text-[#FFFFFF] text-[12px] mt-1">月计划用电占比</span>
            </div>
            <div class="flex flex-col items-center">
                <LiquidBall :value="yearValue" :size="140" />
                <span class="text-[#FFFFFF] text-[12px] mt-1">年计划用电占比</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import LiquidBall from '@/components/chart/LiquidBall.vue'

// 定义可配置的Props，保持默认值与原逻辑一致，方便后续灵活调整
const props = defineProps({
    // 月计划用电占比数值
    monthValue: {
        type: Number,
        default: 50
    },
    // 年计划用电占比数值
    yearValue: {
        type: Number,
        default: 50
    },
    // 标题文本
    title: {
        type: String,
        default: '计划用电占比'
    }
})
</script>

<style scoped>
/* 样式完全继承原逻辑，无额外修改 */
</style>