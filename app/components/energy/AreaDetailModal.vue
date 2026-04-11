<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[#000000CC]" @click="closeModal"></div>
      <div class="relative w-[960px] bg-[#032748] border border-[#0327489F] rounded shadow-2xl flex flex-col text-white transform transition-all">
        
        <div class="flex items-center justify-between px-6 py-1.5 border-b border-[#D9D9D92A]">
          <div class="flex items-center text-[16px] font-medium">
            <a-select
              v-model:value="selectedArea"
              :bordered="false"
              class="area-title-select"
              style="width: 100px;"
              :options="areaOptions"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              @change="handleAreaChange"
            />
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors -mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-3 px-6 py-2 mt-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.key"
            @click="activeTab = tab.key"
            class="relative flex items-center px-3 py-1.5 rounded text-sm transition-all duration-200"
            :class="activeTab === tab.key ? 'bg-[#32AFFF] text-white font-medium' : 'text-gray-400 hover:text-gray-200'"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="flex px-6 py-2 gap-6 h-[520px]">
          
          <div class="w-[260px] flex flex-col border border-[#1C3E73] rounded p-4">
            <div class="text-xs text-gray-400 mb-4">{{ nowTime }}</div>
            <div class="flex flex-col gap-3 text-[14px]">
              <div class="flex justify-between items-center">
                <span class="text-gray-300">输入功率(kW)</span>
                <span class="font-medium text-white">{{ realTimeData.inputPower }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">输出功率(kW)</span>
                <span class="font-medium text-white">{{ realTimeData.outputPower }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">无功功率(kVar)</span>
                <span class="font-medium text-white">{{ realTimeData.reactivePower }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">日发电量(kWh)</span>
                <span class="font-medium text-white">{{ realTimeData.dailyPower }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">累计发电量(万kWh)</span>
                <span class="font-medium text-white">{{ realTimeData.totalPower }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">装机容量(MWp)</span>
                <span class="font-medium text-white">{{ realTimeData.installedCapacity }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-300">利用小时数(h)</span>
                <span class="font-medium text-white">{{ realTimeData.utilizationHours }}</span>
              </div>
            </div>
          </div>
          <div class="flex-1 flex flex-col border border-[#1C3E73] rounded p-4">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex items-center">
                <button
                  v-for="layout in layoutOptions"
                  :key="layout.value"
                  @click="viewMode = layout.value"
                  :class="[
                    'w-8 h-7 flex items-center justify-center border transition-all duration-200',
                    viewMode === layout.value 
                      ? 'border-[#FFFFFF2A] text-[#32AFFF] bg-[#32AFFF10]' 
                      : 'border-[#FFFFFF2A] text-[#FFFFFF99] bg-transparent hover:bg-[#FFFFFF0A]',
                    layout.value === 'grid' ? 'rounded-l-[2px] border-r-0' : 'rounded-r-[2px]'
                  ]"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <template v-if="layout.value === 'grid'">
                      <path d="M3 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3zM3 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6z" />
                    </template>
                    <template v-else>
                      <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm0 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2zm0 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z" />
                    </template>
                  </svg>
                </button>
              </div>
              <div class="h-6 w-px bg-[#1C3E73]"></div>
              
              <a-date-picker
                v-model:value="selectedDate"
                format="YYYY-MM-DD"
                class="custom-dark-datepicker"
                dropdownClassName="custom-dark-datepicker-dropdown"
                style="width: 150px;"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handleDateChange"
              />

              <a-select
                v-model:value="selectedIndicator"
                :bordered="true"
                placeholder="选择指标"
                class="custom-dark-select !m-0"
                style="width: 140px;"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option value="active">有功功率</a-select-option>
                <a-select-option value="dc">直流功率</a-select-option>
                <a-select-option value="voltage">电压</a-select-option>
              </a-select>
            </div>
            <div ref="chartRef" class="flex-1 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const props = defineProps({
  visible: { type: Boolean, default: false },
  areaId: { type: [String], default: '1' }
});

const emit = defineEmits(['update:visible']);
const closeModal = () => emit('update:visible', false);

const nowTime = computed(() => {
  const date = new Date()
  return date.toLocaleString('zh-CN')
})

const selectedArea = ref(String(props.areaId || '1'));
const areaOptions = ref(Array.from({length: 16}, (_, i) => ({ value: String(i+1), label: `${i+1}#区域` })));

const activeTab = ref('telemetry');
const tabs = ref([
  { label: '实时信息', key: 'telemetry' },
  { label: '数据对比', key: 'compare' }
]);

const viewMode = ref('grid');
const layoutOptions = ref([
  { label: '图标布局', value: 'grid' },
  { label: 'table布局', value: 'list' }
])

// 日期选择
const selectedDate = ref(dayjs('2026-04-10'));
const selectedIndicator = ref('active');

const handleDateChange = (date) => {
  selectedDate.value = date;
  if (chartInstance) {
    chartInstance.dispose();
    nextTick(() => initChart());
  }
};

const realTimeData = ref({
  inputPower: '586,781',
  outputPower: '582,880',
  reactivePower: '0.61',
  dailyPower: '822,700',
  totalPower: '3,424.91',
  installedCapacity: '3,424.91',
  utilizationHours: '6.54'
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(3, 39, 72, 0.9)',
      borderColor: '#1C3E73',
      textStyle: { color: '#FFFFFF' }
    },
    legend: {
      data: ['有功功率', '直流功率'],
      itemWidth: 12,
      itemHeight: 6,
      textStyle: { color: '#9CA3AF', fontSize: 10 },
      top: 0,
      right: 10,
      itemGap: 12
    },
    grid: { left: '3%', right: '3%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['7:10', '8:10', '9:10', '10:10', '11:10', '12:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:10'],
      axisLine: { lineStyle: { color: '#1C3E73' } },
      axisLabel: { color: '#FFFFFF99' },
      splitLine: { lineStyle: { color: '#1C3E73' } }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 30,
      axisLine: { lineStyle: { color: '#1C3E73' } },
      axisLabel: { color: '#FFFFFF99' },
      splitLine: { lineStyle: { color: '#1C3E73' } }
    },
    series: [
      {
        name: '有功功率',
        type: 'line',
        color: '#00FA9A',
        smooth: true,
        data: [14, 15, 17, 20, 23, 25, 26, 26.5, 25, 23, 20, 15],
        lineStyle: { color: '#00FA9A', width: 1 },

        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 250, 154, 0.3)' },
            { offset: 1, color: 'rgba(0, 250, 154, 0.05)' }
          ])
        }
      },
      {
        name: '直流功率',
        type: 'line',
        color: '#32AFFF',
        smooth: true,
        data: [12, 12.5, 14, 16, 18, 19.5, 20, 20, 19, 17, 14, 12],
        lineStyle: { color: '#32AFFF', width: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(50, 175, 255, 0.3)' },
            { offset: 1, color: 'rgba(50, 175, 255, 0.05)' }
          ])
        }
      }
    ]
  };
  chartInstance.setOption(option);
};

watch(() => props.visible, (val) => {
  if (val) {
    selectedArea.value = String(props.areaId);
    nextTick(() => initChart());
  } else {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  }
});

const handleAreaChange = () => {
  if (chartInstance) chartInstance.dispose();
  nextTick(() => initChart());
};

onMounted(() => {
  window.addEventListener('resize', () => chartInstance?.resize());
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chartInstance?.resize());
  if (chartInstance) chartInstance.dispose();
});
</script>

<style scoped>
@import url(../../assets/css/antd.css);
</style>