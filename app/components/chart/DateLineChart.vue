<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden z-10">
    <!-- 标题栏 完全保留原有样式，仅补充日期选择器 -->
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
      <div
        class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none">
      </div>
      <div class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]">
      </div>
      <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">功率和辐射曲线</h3>
      <div class="flex rounded-md p-0.5 relative z-10 mr-3">
        <!-- 科技风日期选择器 完全适配大屏深色背景 -->
        <input type="date" :value="currentDate" @change="handleDateChange" class="date-picker" />
      </div>
    </div>
    <!-- 图表区域 适配原有容器，和LineChart组件保持一致的使用方式 -->
    <div class="flex-1 relative min-h-0 w-full mt-2">
      <VueECharts :option="chartOption" autoresize class="w-full h-full" />
    </div>
  </div>
</template>

<script setup>
import VueECharts from 'vue-echarts';
import * as echarts from 'echarts';
import { computed } from 'vue';

// 组件入参定义 父级可传入动态数据
const props = defineProps({
  // x轴时间刻度
  xAxisData: {
    type: Array,
    default: () => ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
  },
  // 指标一 功率数据
  powerData: {
    type: Array,
    default: () => [3500, 3800, 3700, 4500, 5500, 4200, 4500, 4300, 3800, 4600, 3900, 3500]
  },
  // 指标二 辐射数据
  radiationData: {
    type: Array,
    default: () => [4200, 4600, 4800, 4600, 6000, 4800, 5000, 4900, 4300, 5100, 4500, 4200]
  },
  // 当前选中日期
  currentDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  // y轴最大值
  yAxisMax: {
    type: Number,
    default: 6000
  },
  // y轴刻度间隔
  yAxisInterval: {
    type: Number,
    default: 1000
  }
});

// 事件定义 日期切换时触发，父级可监听更新数据
const emit = defineEmits(['date-change']);

// 日期切换处理
const handleDateChange = (e) => {
  const selectDate = e.target.value;
  emit('date-change', selectDate);
};

// 图表配置 响应式更新，父级数据变化自动刷新图表
const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
      backgroundColor: 'rgba(5, 13, 29, 0.9)',
      borderColor: '#1A2A4A',
      textStyle: { color: '#fff', fontSize: 12 },
      padding: [8, 12]
    },
    legend: {
      data: ['指标一', '指标二'],
      itemWidth: 12,
      itemHeight: 6,
      textStyle: { color: '#9CA3AF', fontSize: 10 },
      top: 0,
      right: 10,
      itemGap: 12
    },
    grid: {
      top: 35,
      right: 20,
      bottom: 10,
      left: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xAxisData,
      axisLine: { lineStyle: { color: '#1F2937' } },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 11, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      max: props.yAxisMax,
      interval: props.yAxisInterval,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#1F2937',
          opacity: 0.4,
          type: 'dashed'
        }
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 11, fontFamily: 'monospace' }
    },
    series: [
      {
        name: '指标一',
        type: 'line',
        color: '#00FFAA',
        smooth: true,
        showSymbol: false,
        data: props.powerData,
        lineStyle: {
          width: 1,
          shadowColor: 'rgba(0, 255, 170, 0.6)',
          shadowBlur: 10
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 170, 0.35)' },
            { offset: 1, color: 'rgba(0, 255, 170, 0)' }
          ])
        }
      },
      {
        name: '指标二',
        type: 'line',
        color: '#FFCC00',
        smooth: true,
        showSymbol: false,
        data: props.radiationData,
        lineStyle: {
          width: 1,
          shadowColor: 'rgba(255, 204, 0, 0.6)',
          shadowBlur: 10
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 204, 0, 0.3)' },
            { offset: 1, color: 'rgba(255, 204, 0, 0)' }
          ])
        }
      }
    ]
  };
});
</script>

<style scoped>
/* 科技风日期选择器样式 完全适配大屏深色背景 */
.date-picker {
  background: transparent;
  border: 1px solid #376eef90;
  border-radius: 4px;
  padding: 2px 6px;
  color: #FFFFFFCC;
  font-size: 10px;
  font-weight: 400;
  outline: none;
  transition: all 0.3s ease;
  font-family: monospace;
}

.date-picker:hover {
  border-color: #376eefc0;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}

.date-picker:focus {
  border-color: #376eefc0;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(14, 165, 233, 0.6);
}

/* 适配webkit内核浏览器的日期选择器箭头样式 */
.date-picker::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-picker::-webkit-calendar-picker-indicator:hover {
  transform: scale(1.05);
}

/* 适配Firefox浏览器 */
.date-picker::-moz-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>