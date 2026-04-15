<template>
    <div class="flex w-full h-full gap-4 box-border overflow-hidden bg-transparent text-white font-sans"
        :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
        <!-- 左侧 -->
        <div class="flex flex-col h-full max-h-[100%] shrink-0"
            :class="layoutMode === 'sidebar' ? 'min-w-[360px] max-w-[360px]' : 'min-w-[370px] max-w-[370px]'">
            <!-- 负荷趋势 -->
            <div class="flex-[5] min-h-0">

            </div>
            <!-- 用电对比 -->
            <div class="flex-[5] min-h-0">

            </div>
            <!-- 饼状图 -->
            <div class="flex-[5] min-h-0">
                <RingPie title="尖峰平谷占比" center-title="总用电量(kWh)" unit="kWh" :pie-size="240" :inner-radius-ratio="0.4"
                    :max-thickness="0.6" :pie-data="[
                        { name: '峰', value: 2658, color: '#00A2FF', gradientStart: '#00A2FFC0' },
                        { name: '尖', value: 1358, color: '#00FFA2', gradientStart: '#00FFA2C0' },
                        { name: '谷', value: 3723, color: '#D2E43B', gradientStart: '#D2E43BC0' },
                        { name: '平', value: 1658, color: '#FFB822', gradientStart: '#FFB822C0' },
                    ]" />
            </div>
        </div>

        <!-- 中间 -->
        <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
            <!-- 顶部指标数据 -->
            <TopMetrics :metrics-data="customMetrics" />
            <!-- 厂房视图区域 -->
            <FactoryView :custom-style="{
                backgroundImage: `url('/image/main.png')`,
                backgroundSize: layoutMode === 'sidebar' ? '110%' : '105%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }" />
            <!-- 能源供需平衡分析 -->
            <div class="flex-[1.5] min-h-0" :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''">
                <BalanceChart title="能源供需平衡分析" />
            </div>
        </div>

        <!-- 右侧 -->
        <div class="flex flex-col h-full shrink-0"
            :class="layoutMode === 'sidebar' ? 'min-w-[365px] max-w-[365px] max-h-[99%]' : 'min-w-[375px] max-w-[375px] max-h-[100%]'">
            <!-- 收益分析图表 -->
            <div class="flex-[5] mt-1">

            </div>

            <!-- 发电预测（原封不动5条线数据） -->
            <div class="flex-[5] -mt-1">
                <LineChart title="发电预测" :series-data="originalFiveSeries" />
            </div>

            <!-- 负荷预测（原封不动5条线数据） -->
            <div class="flex-[5] -mt-1">

            </div>
        </div>
    </div>
</template>

<script setup>
import RingPie from '@/components/chart/RingPie.vue'
import TopMetrics from '@/components/common/TopMetrics.vue'
import BalanceChart from '@/components/chart/BalanceChart.vue'
import LineChart from '@/components/chart/LineChart.vue'
import FactoryView from '@/components/dashboard/FactoryView.vue'
import * as echarts from 'echarts'; // 记得导入echarts，因为数据里用了LinearGradient

definePageMeta({
    layout: 'layout'
})

// 从父组件注入状态和方法
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

// ---------------- 核心：原封不动抄过来的5条线数据 ----------------
const originalFiveSeries = [
    {
        name: '中期',
        type: 'line',
        color: '#00D0FF',
        smooth: true,
        showSymbol: false,
        data: [20, 15, 22, 18, 25, 12, 10, 20],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 208, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 208, 255, 0)' }
            ])
        }
    },
    {
        name: '短期',
        type: 'line',
        color: '#1DFF8B',
        smooth: true,
        showSymbol: false,
        data: [22, 18, 15, 20, 28, 15, 8, 15],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(29, 255, 139, 0.3)' },
                { offset: 1, color: 'rgba(29, 255, 139, 0)' }
            ])
        }
    },
    {
        name: '中短期',
        type: 'line',
        color: '#FFB800',
        smooth: true,
        showSymbol: false,
        data: [18, 20, 12, 15, 22, 20, 15, 18],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 184, 0, 0.25)' },
                { offset: 1, color: 'rgba(255, 184, 0, 0)' }
            ])
        }
    },
    {
        name: '超短期',
        type: 'line',
        color: '#F03900F0',
        smooth: true,
        showSymbol: false,
        data: [25, 22, 18, 25, 20, 18, 12, 10],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 77, 0, 0.25)' },
                { offset: 1, color: 'rgba(255, 77, 0, 0)' }
            ])
        }
    },
    {
        name: '实际',
        type: 'line',
        color: '#00FFFF',
        smooth: true,
        showSymbol: false,
        data: [15, 10, 20, 12, 30, 20, 16, 25],
        lineStyle: {
            width: 1.0,
            shadowColor: 'rgba(0, 255, 255, 0.6)',
            shadowBlur: 10
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 255, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 255, 255, 0)' }
            ])
        }
    }
];

// 自定义指标数据
const customMetrics = [
    { title: '今日用电量(kWh)', value: '38,642', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
    { title: '综合电费_风平谷折算(元)', value: '26,814', change: '↓节约', vs: '¥3,280', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
    { title: '光伏发电量(kWh)', value: '12,380', change: '↑1.6%', vs: 'vs 昨日', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
    { title: '储能套利收益_今日(元)', value: '4,156', change: 'SOC 74%', vs: '· 充放21次', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '碳排放强度_双碳(tCO₂/万元)', value: '0.382', change: '↓11.4%', vs: 'vs 目标', valueColor: 'text-[#32AFFF]', arrowColor: 'text-emerald-400' },
    { title: '绿电消纳占比_GEC(%)', value: '32.1', change: '↑2.4%', vs: 'vs 上月', valueColor: 'text-[#32AFFF]', arrowColor: 'text-red-500' },
];
</script>