<template>
  <div class="flex w-full h-full gap-10 box-border overflow-hidden bg-transparent text-white font-sans "
    :class="layoutMode === 'sidebar' ? '-mt-2 py-3' : 'p-4'">
    <div class="flex flex-col h-full max-h-[100%] shrink-0 gap-4"
      :class="layoutMode === 'sidebar' ? 'min-w-[400px] max-w-[400px]' : 'min-w-[410px] max-w-[410px]'">
      <div class="flex-[4.5] min-h-0">
        <MainMetric />
      </div>
      <div class="flex-[6] min-h-0 -mt-10">
        <CarbonRatioPie title="碳排放占比" center-title="" :center-value="368" :pie-size="260" :inner-radius-ratio="0.4"
            :max-thickness="0.6" :pie-data="[
                { name: '净购入电力排放', value: 549700, color: '#00A2FF', gradientStart: '#00A2FFC0' },
                { name: '移动设施燃烧排放', value: 39500, color: '#00FFA2', gradientStart: '#00FFA2C0' },
                { name: '逸散排放', value: 31000, color: '#D2E43B', gradientStart: '#D2E43BC0' },
                { name: '净购入热力排放', value: 7113.53, color: '#FFB822', gradientStart: '#FFB822C0' },
                { name: '固定设施燃烧排放', value: 1527.59, color: '#22E0E0', gradientStart: '#22E0E0C0' },
                { name: '工业生产过程排放', value: 150.38, color: '#1677FF', gradientStart: '#1677FFC0' },
            ]"/>
      </div>
      <div class="flex-[5.5] min-h-0 -mt-4 mb-6">
        <LineChart 
          title="碳排放趋势对比" 
          :series-data="originalFiveSeries"
        />
      </div>
    </div>
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[600px]">
      <!-- 中间主图区域 仅修改此区域内内容，其他所有样式、属性完全保留 -->
      <div class="flex-[2.75] min-h-0 relative flex items-center justify-center rounded-lg overflow-hidden z-10 mt-0" :style="{
        backgroundImage: `url('/image/map.png')`,
        backgroundSize: layoutMode === 'sidebar' ? '94.5%' : '85%',
        backgroundPosition: layoutMode === 'sidebar' ? 'center -10px' : 'center -5px',
        backgroundRepeat: 'no-repeat'
      }">
        <img class="w-20 absolute bottom-1 right-2" src="/image/SouthChinaSea_icon.png">
      </div>
      <!-- 中间主图区域结束 以下内容完全保留未改动 -->
      <div class="flex-[1.45] min-h-0" :class="layoutMode === 'sidebar' ? '-mt-3 mb-3' : ''">
        <BottomMetric title="主要核心指标" />
      </div>
    </div>
    <div class="flex flex-col h-full shrink-0 gap-4"
      :class="layoutMode === 'sidebar' ? 'min-w-[405px] max-w-[405px] max-h-[99%]' : 'min-w-[415px] max-w-[415px] max-h-[100%]'">
      <div class="flex-[5] min-h-0">
        <ProgressRatio title="碳中和进度"  />
      </div>
      <div class="flex-[5] min-h-0 -mt-10">
        <ProgressivePie 
            title="能耗占比" 
            center-title="总能耗量" 
            unit="kWh" 
            :pie-size="240" 
            :inner-radius-ratio="0.4"
            :max-thickness="0.6" 
            :gap-angle="30"
            :pie-data="[
                { name: '电', value: 174200, color: '#00A2FF', gradientStart: '#00A2FFC0' },
                { name: '煤', value: 11900, color: '#00FFA2', gradientStart: '#00FFA2C0' },
                { name: '气', value: 7370.91, color: '#F7E047', gradientStart: '#F7E047C0' },
                { name: '热', value: 3424.50, color: '#FFB822', gradientStart: '#FFB822C0' },
                { name: '油', value: 121.29, color: '#22E0E0', gradientStart: '#22E0E0C0' },
                { name: '其他', value: 0.2, color: '#1677FF', gradientStart: '#1677FFC0' },
            ]" 
            />
      </div>
      <div class="flex-[5] min-h-0 -mt-4 mb-4">
        <LineChart 
          title="碳排放趋势对比" 
          :series-data="originalFiveSeries"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import MainMetric from '@/components/carbon/MainMetric.vue'
import BottomMetric from '@/components/carbon/BottomMetric.vue'
import ProgressivePie from '@/components/chart/ProgressivePie.vue'
import CarbonRatioPie from '@/components/chart/CarbonRatioPie.vue'
import LineChart from '@/components/chart/LineChart.vue'
import ProgressRatio from '@/components/chart/ProgressRatio.vue'
import * as echarts from 'echarts'

definePageMeta({
  layout: 'layout'
})
const layoutState = inject('layoutState');
const { layoutMode } = layoutState;

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
];
</script>