<template>
    <div
        class="day-data-dashboard w-full h-screen bg-transparent text-white font-sans flex flex-col relative z-0 overflow-hidden">
        <div class="relative z-10 flex flex-col h-full p-4 gap-2 mb-20">
            <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 shrink-0">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">参考日:</span>
                            <a-date-picker v-model:value="refDate" size="small" class="custom-dark-datepicker w-40" />
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">位置:</span>
                            <a-select v-model:value="location" placeholder="请选择" size="small"
                                class="custom-dark-select w-40">
                                <a-select-option value="center">中心区域</a-select-option>
                            </a-select>
                        </div>
                        <div class="flex items-center gap-4">
                            <a-checkbox v-model:checked="type1" class="custom-dark-checkbox">工作日</a-checkbox>
                            <a-checkbox v-model:checked="type2" class="custom-dark-checkbox">双休日</a-checkbox>
                            <a-checkbox v-model:checked="type3" class="custom-dark-checkbox">法定节假日</a-checkbox>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <a-button type="primary"
                            class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80 w-[64px]">查询</a-button>
                        <a-button
                            class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white w-[64px]">重置</a-button>
                    </div>
                </div>
            </div>

            <div class="flex-[1] flex gap-2 min-h-0">
                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">相似日分析详情</h3>
                    </div>
                    <div class="flex-1 flex min-h-0">
                        <div class="w-2/5 h-full">
                            <VueECharts :option="radarOption" autoresize />
                        </div>
                        <div class="w-3/5 h-full pl-2 overflow-auto">
                            <table class="similarity-table w-full text-[10px]">
                                <thead>
                                    <tr>
                                        <th>日期</th>
                                        <th>日类型</th>
                                        <th>相似度</th>
                                        <th>天气</th>
                                        <th>负荷</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in similarityData" :key="index">
                                        <td class="text-[#32AFFF]">{{ item.date }}</td>
                                        <td>{{ item.type }}</td>
                                        <td>{{ item.similarity }}</td>
                                        <td>{{ item.weather }}</td>
                                        <td>{{ item.load }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">日内量价曲线</h3>
                    </div>
                    <div class="flex-1 w-full min-h-0">
                        <VueECharts :option="intradayOption" autoresize />
                    </div>
                </div>
            </div>

            <div class="flex-[1] flex gap-2 min-h-0">
                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">现货价格曲线</h3>
                    </div>
                    <div class="flex-1 w-full min-h-0">
                        <VueECharts :option="spotPriceOption" autoresize />
                    </div>
                </div>
                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">交易量数据</h3>
                    </div>
                    <div class="flex-1 w-full min-h-0">
                        <VueECharts :option="volumeOption" autoresize />
                    </div>
                </div>
            </div>

            <div class="flex-[1] flex gap-2 min-h-0 ">
                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">最大负荷与温度</h3>
                    </div>
                    <div class="flex-1 w-full min-h-0">
                        <VueECharts :option="loadTempOption" autoresize />
                    </div>
                </div>
                <div class="flex-1 chart-card flex flex-col">
                    <div class="chart-header">
                        <h3 class="chart-title">网供电量分布</h3>
                        <div class="chart-legend-custom">
                            <span v-for="item in gridLegend" :key="item.label" class="legend-item">
                                <i :style="{ backgroundColor: item.color }"></i> {{ item.label }}
                            </span>
                        </div>
                    </div>
                    <div class="flex-1 w-full min-h-0">
                        <VueECharts :option="gridDistOption" autoresize />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'

definePageMeta({
    layout: 'layout'
})

// 工具栏变量
const refDate = ref(null)
const location = ref(undefined)
const type1 = ref(true)
const type2 = ref(false)
const type3 = ref(false)

// 通用配置
const commonAxisLabel = { color: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }
const commonSplitLine = { lineStyle: { color: 'rgba(75, 85, 99, 0.2)', type: 'dashed' } }
const xAxisData = Array.from({ length: 20 }, (_, i) => i.toString())

// 1.1 日内量价曲线 (左上)
const intradayOption = ref({
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(5, 13, 29, 0.9)', textStyle: { color: '#fff' } },
    grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
    yAxis: [
        { type: 'value', name: '量', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
        { type: 'value', name: '价', splitLine: { show: false }, axisLabel: commonAxisLabel }
    ],
    series: [
        { name: '电量', type: 'bar', barWidth: '30%', itemStyle: { color: '#32AFFF' }, data: [80, 95, 40, 50, 20, 30, 90, 100, 95, 100, 70, 85, 40, 25, 98, 45, 95, 45, 98, 40] },
        { name: '价格', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { color: '#67E8F9', width: 2 }, data: [30, 45, 20, 15, 10, 18, 15, 18, 20, 22, 25, 30, 20, 15, 5, 15, 25, 35, 45, 30] }
    ]
})

// 1.2 雷达图配置 (右上左侧)
const radarOption = ref({
    radar: {
        indicator: [
            { name: '气象', max: 100 }, { name: '出力', max: 100 }, { name: '负荷', max: 100 },
            { name: '价格', max: 100 }, { name: '热度', max: 100 }
        ],
        shape: 'polygon',
        splitNumber: 4,
        axisName: { color: '#9CA3AF', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
        type: 'radar',
        data: [
            { value: [80, 70, 90, 60, 85], name: '当前', itemStyle: { color: '#32AFFF' }, areaStyle: { color: 'rgba(50, 175, 255, 0.3)' } },
            { value: [60, 50, 40, 80, 50], name: '参考', itemStyle: { color: '#F2CA69' }, areaStyle: { color: 'rgba(242, 202, 105, 0.3)' } }
        ]
    }]
})

// 相似日表格数据 (右上右侧)
const similarityData = [
    { date: '2026/03/22', type: '工作日', similarity: '90%', weather: '阴', load: '2322' },
    { date: '2026/03/20', type: '双休日', similarity: '88%', weather: '小雨', load: '3332' },
    { date: '2025/02/18', type: '工作日', similarity: '85%', weather: '晴', load: '3322' },
    { date: '2025/04/05', type: '法定节假日', similarity: '73%', weather: '毛毛雨', load: '3321' }
]

// 以下复用 DayData 的中下部图表配置
const spotPriceOption = ref({
    grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
    yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
    series: [
        { type: 'bar', barWidth: '30%', itemStyle: { color: '#32AFFF' }, data: [35, 52, 45, 15, 40, 35, 90, 105, 55, 60, 78, 85, 35, 25, 102, 50, 48, 55, 68, 42] },
        { type: 'line', smooth: true, lineStyle: { color: '#67E8F9' }, data: [15, 45, 25, 10, 32, 28, 30, 40, 75, 82, 35, 25, 10, 5, 65, 55, 15, 55, 65, 40] }
    ]
})

const volumeOption = ref({
    grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
    yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
    series: [{ type: 'bar', barWidth: '40%', itemStyle: { color: '#3B82F6' }, data: [30, 48, 52, 35, 25, 15, 88, 102, 95, 60, 85, 70, 28, 20, 95, 45, 100, 50, 48, 35] }]
})

const loadTempOption = ref({
    grid: { top: '15%', bottom: '%', left: '3%', right: '3%', containLabel: true },
    xAxis: { type: 'category', data: xAxisData, axisLabel: commonAxisLabel },
    yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
    series: [
        { type: 'bar', barWidth: '35%', itemStyle: { color: '#32AFFF' }, data: [40, 105, 52, 48, 25, 15, 85, 108, 105, 75, 82, 35, 28, 105, 48, 105, 50, 105, 42, 35] },
        { type: 'line', smooth: true, lineStyle: { color: '#67E8F9' }, data: [45, 55, 35, 20, 15, 35, 45, 80, 45, 25, 10, 68, 55, 45, 70, 35, 40, 25, 45, 30] }
    ]
})

const gridLegend = [
    { label: '水电', color: '#3B82F6' }, { label: '火电', color: '#EF4444' },
    { label: '风光', color: '#10B981' }, { label: '外购', color: '#8B5CF6' }, { label: '留川', color: '#F59E0B' }
]

const gridDistOption = ref({
    grid: { top: '15%', bottom: '3%', left: '3%', right: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['3/20', '3/21', '3/22', '3/23', '3/24', '3/25', '3/26'], axisLabel: commonAxisLabel },
    yAxis: { type: 'value', splitLine: commonSplitLine, axisLabel: commonAxisLabel },
    series: [
        { name: '水电', type: 'bar', stack: 'total', barWidth: 14, itemStyle: { color: '#3B82F6' }, data: [2, 2.5, 2, 2.2, 2.5, 2.3, 2.4] },
        { name: '火电', type: 'bar', stack: 'total', itemStyle: { color: '#EF4444' }, data: [3.5, 2.8, 3.2, 3.5, 3, 3.1, 3.2] },
        { name: '风光', type: 'bar', stack: 'total', itemStyle: { color: '#10B981' }, data: [1.2, 1.5, 1.3, 1.4, 1.2, 1.3, 1.4] },
        { name: '外购', type: 'bar', stack: 'total', itemStyle: { color: '#8B5CF6' }, data: [0.5, 0.8, 0.6, 0.7, 0.5, 0.6, 0.5] },
        { name: '留川', type: 'bar', stack: 'total', itemStyle: { color: '#F59E0B' }, data: [1.1, 1.3, 1.2, 1.1, 1.2, 1.3, 1.4] }
    ]
})
</script>

<style scoped>
@import url(@/assets/css/antd.css);

.chart-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    padding: 12px;
}

.chart-header {
    padding-left: 8px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.chart-title {
    font-size: 13px;
    font-weight: bold;
    color: #fff;
    margin: 0;
}

.similarity-table {
    border-collapse: collapse;
    color: #FFFFFFCC;
    padding: 6px;
}

.similarity-table th {
    background: rgba(50, 175, 255, 0.1);
    padding: 8px 6px;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.similarity-table td {
    padding: 8px 4px;
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-legend-custom {
    margin-left: auto;
    display: flex;
    gap: 8px;
}

.legend-item {
    display: flex;
    align-items: center;
    font-size: 10px;
}

.legend-item i {
    width: 6px;
    height: 6px;
    margin-right: 4px;
}
</style>