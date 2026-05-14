<template>
  <div class="dashboard w-full h-screen bg-transparent text-white font-sans flex flex-col relative z-0 overflow-hidden p-3 gap-2">
    
    <div class="h-[60%] w-full bg-[#FFFFFF01] border border-[#FFFFFF00] relative flex flex-col overflow-hidden">
      <div class="absolute inset-0 pointer-events-none bg-[url('@/assets/images/grid-bg.png')] bg-cover opacity-20"></div>
      
      <div class="w-full flex items-center justify-between px-4 py-2 relative z-10 border-b border-[#1A305A]/50 bg-gradient-to-r from-[#32AFFF2A] to-transparent">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        <h3 class="text-[14px] font-bold text-white">碳排放流向分析</h3>
        
        <div class="relative min-w-[120px]">
          <a-select 
            v-model:value="flowUnit" 
            placeholder="请选择" 
            class="custom-dark-select w-full"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          >
            <a-select-option value="all">全部单元</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="w-full p-4 relative z-10 shrink-0">
        <div class="grid grid-cols-2 gap-6 w-full px-0 pt-2">
          <div class="bg-[#32AFFF2A] border border-[#32AFFF2F] rounded p-4 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:border-[#32AFFF4F] hover:shadow-[0_0_14px_rgba(50,175,255,0.5)] cursor-pointer">
            <img :src="`/image/co2_icon.png`" class="w-11" />
            <div class="flex flex-col">
              <span class="text-[12px] text-[#FFFFFF99]">碳排放总量 (tCO2e)</span>
              <span class="text-[24px] metric-value text-cyan-300 mt-1 leading-none">29,385.40</span>
            </div>
            <div class="absolute inset-0 border-2 border-[#32AFFF] rounded opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
          </div>
  
          <div class="bg-[#32AFFF2A] border border-[#32AFFF2F] rounded p-4 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:border-[#32AFFF4F] hover:shadow-[0_0_14px_rgba(50,175,255,0.5)] cursor-pointer">
            <img :src="`/image/tree_icon.png`" class="w-10" />
            <div class="flex flex-col">
              <span class="text-[12px] text-[#FFFFFF99]">碳排放强度 (tCO2e/万元)</span>
              <span class="text-[24px] metric-value text-blue-300 mt-1 leading-none">2634</span>
            </div>
            <div class="absolute inset-0 border-2 border-[#32AFFF] rounded opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div ref="sankeyChartRef" class="flex-1 w-full h-full pb-4"></div>
    </div>

    <div class="h-[30.25%] w-full flex gap-2">
      
      <div class="flex-1 bg-[#FFFFFF01] border border-[#FFFFFF00] relative flex flex-col overflow-hidden">
        <div class="w-full flex items-center justify-between px-4 py-2 relative z-10 border-b border-[#1A305A]/50 bg-gradient-to-r from-[#32AFFF2A] to-transparent">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
          <h3 class="text-[14px] font-bold text-white">经营单元碳排放占比分析 <span class="text-[12px] font-normal text-gray-400">(单位: tCO2e)</span></h3>
          <div class="relative min-w-[120px]">
            <a-select 
              v-model:value="businessUnit" 
              placeholder="请选择" 
              class="custom-dark-select w-full"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            >
              <a-select-option value="all">全部单元</a-select-option>
            </a-select>
          </div>
        </div>
        
        <div class="flex-1 relative mt-2">
          <RingPie 
            title="" 
            center-title="总人数" 
            unit="人" 
            :pie-size="160" 
            :inner-radius="50"
            :ring-thickness="25"
            :buttons="[]"
            :pie-data="[
              { name: '对虾养殖公司', value: 4544, color: '#00A2FF' },
              { name: '鲈鱼养殖公司', value: 3211, color: '#00FFA2' },
              { name: '加工公司', value: 2366, color: '#FFB822' },
              { name: '营销公司', value: 1233, color: '#D2E43B' },
            ]"
          />
        </div>
      </div>

      <div class="flex-1 bg-[#FFFFFF01] border border-[#FFFFFF00] relative flex flex-col overflow-hidden">
        <div class="w-full flex items-center justify-between px-4 py-2 relative z-10 border-b border-[#1A305A]/50 bg-gradient-to-r from-[#32AFFF2A] to-transparent">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
          <h3 class="text-[14px] font-bold text-white">排放范围占比分析 <span class="text-[12px] font-normal text-gray-400">(单位: tCO2e)</span></h3>
          <div class="relative min-w-[120px]">
            <a-select 
              v-model:value="emissionScope" 
              placeholder="请选择" 
              class="custom-dark-select w-full"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            >
              <a-select-option value="all">全部范围</a-select-option>
            </a-select>
          </div>
        </div>
        
        <div class="flex-1 relative mt-2">
          <RingPie 
            title="" 
            center-title="总人数" 
            unit="人" 
            :pie-size="160" 
            :inner-radius="50"
            :ring-thickness="25"
            :buttons="[]"
            :pie-data="[
              { name: '范围一', value: 4522, color: '#00A2FF' },
              { name: '范围二', value: 4600, color: '#00FFA2' },
              { name: '范围三', value: 5661, color: '#FFB822' }
            ]"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import RingPie from '@/components/chart/RingPie.vue';

definePageMeta({
  layout: 'layout'
})

// 响应式变量
const flowUnit = ref('all');
const businessUnit = ref('all');
const emissionScope = ref('all');

const sankeyChartRef = ref(null);
let sankeyChart = null;

// 初始化桑基图
const initSankey = () => {
  if (!sankeyChartRef.value) return;
  sankeyChart = echarts.init(sankeyChartRef.value);

  const nodes = [
    { name: '股份' },
    { name: '永祥' }, { name: '太阳能' }, { name: '组件' }, { name: '终端' }, { name: '农牧' }, { name: '食品' },
    { name: '辅助过程' }, { name: '电池片-TOPcon' }, { name: '硅料' }, { name: '烧碱' }, { name: '单晶硅棒' }, 
    { name: 'PVC树脂' }, { name: '硅芯' }, { name: '熟料' }, { name: '硅片' }, { name: '新能源' },
    { name: '净购入电力排放' }, { name: '工业生产过程排放' }, { name: '固定设施燃料燃烧排放' }, { name: '逸散排放' }, { name: '移动设施燃料燃烧排放' },
    { name: '烟煤' }, { name: '天然气' }, { name: '生物质木质' }, { name: '柴油' }, { name: '汽油(移动)' }
  ];

  const links = [
    { source: '股份', target: '永祥', value: 33.88 },
    { source: '股份', target: '太阳能', value: 17.31 },
    { source: '股份', target: '组件', value: 2.36 },
    { source: '股份', target: '终端', value: 20.19 },
    { source: '股份', target: '农牧', value: 4.36 },
    { source: '股份', target: '食品', value: 10.11 },
    { source: '永祥', target: '辅助过程', value: 10.13 },
    { source: '永祥', target: '硅料', value: 7.48 },
    { source: '永祥', target: '烧碱', value: 3.55 },
    { source: '永祥', target: 'PVC树脂', value: 12.72 },
    { source: '太阳能', target: '电池片-TOPcon', value: 8.24 },
    { source: '太阳能', target: '单晶硅棒', value: 2.31 },
    { source: '太阳能', target: '硅芯', value: 6.76 },
    { source: '辅助过程', target: '净购入电力排放', value: 6.59 },
    { source: '电池片-TOPcon', target: '净购入电力排放', value: 5.24 },
    { source: '硅料', target: '工业生产过程排放', value: 4.08 },
    { source: 'PVC树脂', target: '固定设施燃料燃烧排放', value: 4.87 },
    { source: '烧碱', target: '逸散排放', value: 3.31 },
    { source: '终端', target: '移动设施燃料燃烧排放', value: 8.48 },
    { source: '净购入电力排放', target: '天然气', value: 3.06 },
    { source: '工业生产过程排放', target: '烟煤', value: 3.81 },
    { source: '固定设施燃料燃烧排放', target: '生物质木质', value: 1.31 },
    { source: '移动设施燃料燃烧排放', target: '柴油', value: 4.51 },
    { source: '移动设施燃料燃烧排放', target: '汽油(移动)', value: 3.46 }
  ];

  const colorPalette = ['#8B5CF6', '#F59E0B', '#3B82F6', '#10B981', '#06B6D4', '#EC4899', '#6366F1'];

  const option = {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: {
      type: 'sankey',
      layout: 'none',
      nodeAlign: 'justify',
      top: '1.5%',           
      bottom: '5%',
      left: '1.25%',
      right: '6%',
      data: nodes.map((n, idx) => ({ 
        ...n, 
        itemStyle: { 
          color: colorPalette[idx % colorPalette.length],
          borderWidth: 0 
        } 
      })),
      links: links,
      emphasis: { focus: 'adjacency' },
      lineStyle: {
        color: 'source',
        curveness: 0.5,
        opacity: 0.25    
      },
      label: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: '{b}'
      }
    }
  };

  sankeyChart.setOption(option);
};

const handleResize = () => {
  if (sankeyChart) sankeyChart.resize();
};

onMounted(() => {
  nextTick(() => {
    initSankey();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (sankeyChart) sankeyChart.dispose();
});
</script>

<style scoped>
@import url(@/assets/css/antd.css);

.metric-value {
  font-family: 'DIN Alternate', 'Source Han Sans CN', sans-serif;
}

</style>