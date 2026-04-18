<template>
  <div class="water-level-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- 外圈圆环（完全保留） -->
    <svg :viewBox="`0 0 ${baseSize} ${baseSize}`" class="outer-ring">
      <circle 
        :cx="center" :cy="center" :r="radius" 
        fill="none" stroke="#072440" stroke-width="6" 
      />
      <circle 
        :cx="center" :cy="center" :r="radius" 
        fill="none" stroke="url(#ringGradient)" stroke-width="1" 
        stroke-linecap="round"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 50 50)"
      />
      <circle 
        :cx="dotX" :cy="dotY" r="1.5" 
        fill="#00D0FF" class="dot-glow"
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#66E3FF" />
          <stop offset="100%" stop-color="#5ACFF110" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 中间水位图区域：换成 ECharts -->
    <div class="liquid-container">
      <!-- ECharts 容器 -->
      <div ref="liquidChartRef" class="liquid-chart"></div>
      
      <!-- 百分比文字（保留在最上层） -->
      <div class="value-text">
        <span class="num">{{ value }}</span>
        <span class="unit">%</span>
      </div>
    </div>

    <!-- 玻璃发光罩（完全保留） -->
    <div class="inner-glow-sphere"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill'; // 引入水位图插件

const props = defineProps({
  value: { type: Number, default: 50 },
  size: { type: Number, default: 120 }
});

// --- 外圈圆环相关计算（完全保留原逻辑） ---
const baseSize = 100;
const center = 50;
const radius = 42.5;
const percent = 75; 
const dashArray = 2 * Math.PI * radius;
const dashOffset = computed(() => {
  return dashArray * (1 - percent / 100);
});
const dotX = computed(() => {
  const angle = (percent / 100) * 360 - 90;
  return center + radius * Math.cos((angle * Math.PI) / 180);
});
const dotY = computed(() => {
  const angle = (percent / 100) * 360 - 90;
  return center + radius * Math.sin((angle * Math.PI) / 180);
});

// --- ECharts 水位图逻辑 ---
const liquidChartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!liquidChartRef.value) return;
  
  chartInstance = echarts.init(liquidChartRef.value);
  
  const option = {
    series: [{
      type: 'liquidFill',
      data: [props.value / 100], // 数值转 0-1
      radius: '100%', // 占满容器
      outline: { show: false }, // 不显示默认外圈（因为我们自己有）
      backgroundStyle: {
        color: '#4CC1FC01' // 保持原来的暗色背景
      },
      // 这里配置波浪样式，给你调成小波浪了
      waveAnimation: true,
      waveAnimationDurationUpdate: 1000,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{
            offset: 0, color: '#4CE1FC'
          }, {
            offset: 1, color: '#53B4FE'
          }]
        },
        opacity: 1
      },
      amplitude: 8, // 振幅（波浪高度），数值越小浪越小
      waveLength: 100, 
      waves: [
        {
          direction: 'right',
          itemStyle: { color: '#4CC1FC' }
        },
        {
          direction: 'left',
          itemStyle: { color: '#4CC1FC' }
        }
      ],
      label: { show: false } // 隐藏 ECharts 默认的文字，用我们自己的
    }]
  };

  chartInstance.setOption(option);
};

// 监听 value 变化更新水位
watch(() => props.value, (newVal) => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [{
        data: [newVal / 100]
      }]
    });
  }
});

// 响应窗口大小变化（可选）
const handleResize = () => {
  chartInstance && chartInstance.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance && chartInstance.dispose();
});
</script>

<style scoped>
/* 原有样式 99% 完全保留 */
.water-level-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.dot-glow {
  filter: drop-shadow(0 0 4px #00D0FF);
}
.inner-glow-sphere {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.25) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.1);
  z-index: 2;
  pointer-events: none;
}

/* 稍微调整了一下容器，用来放 ECharts */
.liquid-container {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
  /* 背景色去掉了，交给 ECharts 内部配置 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 新增：ECharts 容器样式 */
.liquid-chart {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* 文字样式保留，并确保层级最高 */
.value-text {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  pointer-events: none; /* 防止挡住图表事件 */
}
.num {
  font-size: 1.5rem;
  color: #fefefe;
}
.unit {
  font-size: 1.5rem;
  margin-left: 2px;
  color: #fefefe;
}
</style>