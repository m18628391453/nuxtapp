<template>
    <div class="flex w-full h-full gap-4 box-border overflow-hidden bg-transparent text-white font-sans"
        :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
        <!-- 左侧 -->
        <div class="flex flex-col h-full max-h-[100%] shrink-0"
            :class="layoutMode === 'sidebar' ? 'min-w-[360px] max-w-[360px]' : 'min-w-[370px] max-w-[370px]'">
            <!-- 负荷趋势（设计稿：用电与负荷趋势） -->
            <div class="flex-[5] min-h-0">
                <DateLineChart 
                    title="用电与负荷趋势" 
                    :x-axis-data="timeAxis"
                    :power-data="powerTrendData"
                    :radiation-data="loadTrendData"
                    :y-axis-max="350"
                    :y-axis-interval="50"
                />
            </div>
            <!-- 用电对比（设计稿：设备用电对比 - 横向柱状图） -->
            <div class="flex-[5] min-h-0">
                <HorizBarChart 
                    title="设备用电对比" 
                    :buttons="[]"
                    :x-axis-data="deviceNames"
                    :bar-data="devicePowerData"
                    :bar-color="['#00A2FF', '#00C8FF', '#00E0FF']"
                    :y-axis-max="800"
                    :y-axis-interval="200"
                    :bar-width="12"
                    horizontal
                />
            </div>
            <!-- 饼状图（设计稿：尖峰平谷占比） -->
            <div class="flex-[5] min-h-0">
                <RingPie 
                    title="尖峰平谷占比" 
                    center-title="总量(万kW)" 
                    unit="kW" 
                    :pie-size="240" 
                    :inner-radius="55"
                    :ring-thickness="20"
                    :pie-data="[
                        { name: '峰', value: 2658.5, color: '#00A2FF' },
                        { name: '尖', value: 1358.5, color: '#00FFA2' },
                        { name: '谷', value: 3723.5, color: '#D2E43B' },
                        { name: '平', value: 1658.6, color: '#FFB822' },
                    ]" 
                />
            </div>
        </div>
        <!-- 中间 -->
        <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
            <!-- 顶部指标数据（设计稿：系统运行指标） -->
            <TopMetrics :metrics-data="designMetrics" />
            <!-- 厂房视图区域 -->
            <FactoryView :custom-style="{
                backgroundImage: `url('/image/main.png')`,
                backgroundSize: layoutMode === 'sidebar' ? '110%' : '105%',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }" />
            <!-- 能源供需平衡分析（设计稿：本月能耗统计） -->
            <div class="flex-[1.5] min-h-0" :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''">
                <LineBarChart 
                    title="本月能耗统计" 
                    :buttons="[]"
                    :x-axis-data="monthAxis"
                    :bar-data="monthEnergyData"
                    :bar-color="['#10B981', '#34D399', '#6EE7B7']"
                    :y-axis-max="6000"
                    :y-axis-interval="1000"
                    :bar-width="10"
                />
            </div>
        </div>
        <!-- 右侧 -->
        <div class="flex flex-col h-full shrink-0"
            :class="layoutMode === 'sidebar' ? 'min-w-[365px] max-w-[365px] max-h-[99%]' : 'min-w-[375px] max-w-[375px] max-h-[100%]'">
            <!-- 收益分析图表（设计稿：计划用电占比） -->
            <div class="flex-[5] mt-1">
                <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden border border-white/5">
                    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-4">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        <h3 class="text-[14px] font-bold text-white ml-1 leading-none tracking-wider">计划用电占比</h3>
                    </div>

                    <div class="flex-1 flex items-center justify-around px-2 mt-3">
                        <div class="flex flex-col items-center">
                            <LiquidBall :value="50" :size="140" />
                            <span class="text-[#FFFFFF] text-[12px] mt-1">月计划用电占比</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <LiquidBall :value="50" :size="140" />
                            <span class="text-[#FFFFFF] text-[12px] mt-1">年计划用电占比</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 发电预测（设计稿：负荷用能分析） -->
            <div class="flex-[5] -mt-1">
                <LineChart 
                    title="负荷用能分析" 
                    :x-axis-data="timeAxis"
                    :y-axis-config="{ max: 350, interval: 50 }"
                    :series-data="energyAnalysisSeries" 
                />
            </div>
            <!-- 负荷预测（设计稿：统计信息） -->
            <div class="flex-[5] -mt-1">
                <StatisticsInfo />
            </div>
        </div>
    </div>
</template>
<script setup>
import RingPie from '@/components/chart/RingPie.vue'
import TopMetrics from '@/components/common/TopMetrics.vue'
import LineChart from '@/components/chart/LineChart.vue'
import LineBarChart from '@/components/chart/LineBarChart.vue'
import HorizBarChart from '~/components/chart/HorizBarChart.vue'
import DateLineChart from '@/components/chart/DateLineChart.vue'
import FactoryView from '@/components/dashboard/FactoryView.vue'
import StatisticsInfo from '@/components/load/StatisticsInfo.vue'
import LiquidBall from '@/components/chart/LiquidBall.vue'
import * as echarts from 'echarts';

definePageMeta({
    layout: 'layout'
})

// 从父组件注入状态和方法
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

// ---------------- 设计稿数据定义 ----------------
// 时间轴（统一使用）
const timeAxis = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

// 顶部指标数据（设计稿）
const designMetrics = [
    { title: '系统运行功率(MW)', value: '3,862', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '日累计用电量(kWh)', value: '26.84', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '月累计用电量(kWh)', value: '138.25', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '年累计用电量(kWh)', value: '1,221.56', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '额定用电功率(MW)', value: '138.25', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
    { title: '日放电量(万kWh)', value: '26.16', change: '', vs: '', valueColor: 'text-[#32AFFF]', arrowColor: 'text-gray-400' },
];

// 用电与负荷趋势数据
const powerTrendData = [200, 280, 180, 200, 250, 280, 300, 250, 180, 300, 150, 180];
const loadTrendData = [300, 250, 280, 300, 250, 280, 300, 250, 280, 300, 250, 280];

// 设备用电对比数据
const deviceNames = ['空调', '投饵机', '增氧机', '底排污'];
const devicePowerData = [600, 650, 500, 400];

// 本月能耗统计数据
const monthAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const monthEnergyData = [4500, 4800, 3200, 3500, 4800, 3000, 3200, 4800, 3000, 4800, 4800, 3000];

// 负荷用能分析多折线数据
const energyAnalysisSeries = [
    {
        name: '光伏',
        type: 'line',
        color: '#00D0FF',
        smooth: true,
        showSymbol: false,
        data: [300, 250, 280, 300, 250, 280, 300, 250, 280, 300, 250, 280],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 208, 255, 0.3)' },
                { offset: 1, color: 'rgba(0, 208, 255, 0)' }
            ])
        }
    },
    {
        name: '储能',
        type: 'line',
        color: '#1DFF8B',
        smooth: true,
        showSymbol: false,
        data: [220, 180, 200, 220, 180, 200, 220, 180, 200, 220, 180, 200],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(29, 255, 139, 0.3)' },
                { offset: 1, color: 'rgba(29, 255, 139, 0)' }
            ])
        }
    },
    {
        name: '市电',
        type: 'line',
        color: '#FFB800',
        smooth: true,
        showSymbol: false,
        data: [180, 150, 170, 180, 150, 170, 180, 150, 170, 180, 150, 170],
        lineStyle: { width: 1.0 },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 184, 0, 0.25)' },
                { offset: 1, color: 'rgba(255, 184, 0, 0)' }
            ])
        }
    }
];
</script>