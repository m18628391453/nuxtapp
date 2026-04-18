<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 0rem 0rem 1.25rem;" >
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5 pb-4">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">{{ title }}</h3>
      <div class="absolute right-1 top-[20%] w-[50%] flex ">
        <div class="flex bg-transparent border border-[#00A2FF]/10 rounded">
          <button 
            v-for="btn in buttons" 
            :key="btn" 
            @click="activeBtn = btn"
            class="px-2 py-0.5 text-[10px] rounded transition-all" 
            :class="btn === activeBtn ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-[#FFFFFFCC] hover:text-gray-300 cursor-pointer'"
          >
            {{ btn }}
          </button>
        </div>
        <div class="ml-1 flex items-center">
          <a-date-picker 
            v-model:value="selectedMonth" 
            picker="month" 
            format="YYYY-MM"
            valueFormat="YYYY-MM"
            class="custom-month-picker"
            :allowClear="false"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-1 items-center min-h-0">
      <div class="w-[55%] flex-shrink-0 relative flex items-center justify-center -mt-2">
        <canvas 
          ref="canvasRef" 
          :width="pieSize * 2" 
          :height="pieSize * 2" 
          :style="{ width: `${pieSize}px`, height: `${pieSize}px` }"
        ></canvas>
        
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div class="text-[18px] font-bold font-mono tracking-tighter text-white leading-none">
            {{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 0 }) }}
          </div>
          <div class="text-[10px] text-gray-400 mt-1">
            总量({{ unit }})
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-2.5 pl-4 justify-center">
        <div v-for="(item, idx) in pieData" :key="idx" class="flex items-start gap-2">
          <div class="w-2.5 h-2.5 rounded-full mt-1 shrink-0" 
               :style="{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }">
          </div>
          <div class="flex flex-col min-w-0 gap-1">
            <div class="flex items-center gap-2 whitespace-nowrap">
              <span class="text-gray-400 text-[12px]">{{ item.name }}</span>
              <span class="text-white font-medium text-[12px]">{{ ((item.value / (totalValue || 1)) * 100).toFixed(2) }}%</span>
            </div>
            <div class="text-[13px] font-bold font-mono text-white leading-tight">
              {{ item.value.toLocaleString() }}
              <span class="text-[11px] font-normal text-gray-500 ml-0">kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  title: { type: String, default: '尖峰平台占比' },
  unit: { type: String, default: '万kW' },
  buttons: { type: Array, default: () => ['充电', '放电'] },
  pieSize: { type: Number, default: 75 },
  innerRadius: { type: Number, default: 55 }, 
  ringThickness: { type: Number, default: 20 },
  pieData: { type: Array, default: () => [] },
  customPadding: { type: Object, default: () => ({ padding: '10px' }) }
});

const activeBtn = ref(props.buttons[0]);
const selectedMonth = ref(dayjs(new Date()));
const canvasRef = ref(null);
const tooltipVisible = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);
const tooltipName = ref('');
const tooltipValue = ref(0);
const tooltipPercent = ref(0);

let sectors = [];

const totalValue = computed(() => {
  return props.pieData.reduce((sum, item) => sum + (item.value || 0), 0);
});

// 核心渲染逻辑
const drawChart = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // 重置并根据DPR缩放，保证清晰度
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);

  const centerX = props.pieSize / 2;
  const centerY = props.pieSize / 2;
  
  // 直接使用 props 传入的像素值
  const iRadius = props.innerRadius;
  const oRadius = iRadius + props.ringThickness;

  // 1. 绘制内部刻度点圈（跟随内径自动偏移）
  drawInnerScale(ctx, centerX, centerY, iRadius - 8);

  // 2. 绘制扇区
  let currentAngle = -Math.PI / 2; 
  sectors = [];

  props.pieData.forEach((item) => {
    const sliceAngle = (item.value / (totalValue.value || 1)) * Math.PI * 2;
    
    sectors.push({
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + sliceAngle,
      innerRadius: iRadius,
      outerRadius: oRadius
    });

    // 绘图
    ctx.beginPath();
    ctx.arc(centerX, centerY, oRadius, currentAngle, currentAngle + sliceAngle);
    ctx.arc(centerX, centerY, iRadius, currentAngle + sliceAngle, currentAngle, true);
    ctx.closePath();

    ctx.fillStyle = item.color;
    // 增加光晕
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = `${item.color}80`;
    ctx.fill();
    ctx.restore();

    // 扇区间的缝隙
    ctx.strokeStyle = '#051020';
    ctx.lineWidth = 2;
    ctx.stroke();

    currentAngle += sliceAngle;
  });
};

// 绘制内侧的装饰短刻度线（优化后）
const drawInnerScale = (ctx, cx, cy, radius) => {
  ctx.save();
  const count = 80; // 刻度数量
  const tickLength = 3; // 短细刻度线的长度，可以根据视觉需求微调
  
  for (let i = 0; i < count; i++) {
    const angle = (i * (360 / count) * Math.PI) / 180;
    
    // 计算刻度线起点和终点
    const x1 = cx + Math.cos(angle) * (radius - tickLength / 2);
    const y1 = cy + Math.sin(angle) * (radius - tickLength / 2);
    const x2 = cx + Math.cos(angle) * (radius + tickLength / 2);
    const y2 = cy + Math.sin(angle) * (radius + tickLength / 2);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    
    // 每隔5个点做一个亮蓝色主刻度
    if (i % 5 === 0) {
      ctx.strokeStyle = 'rgba(0, 162, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'rgba(0, 162, 255, 0.8)';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
  }
  ctx.restore();
};

const handleMouseMove = (e) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const dx = x - (props.pieSize / 2);
  const dy = y - (props.pieSize / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) angle += Math.PI * 2;

  const hit = sectors.find(s => 
    dist >= s.innerRadius && dist <= s.outerRadius &&
    angle >= s.startAngle && angle <= s.endAngle
  );

  if (hit) {
    tooltipVisible.value = true;
    tooltipName.value = hit.name;
    tooltipValue.value = hit.value;
    tooltipPercent.value = (hit.value / totalValue.value) * 100;
    tooltipX.value = e.clientX;
    tooltipY.value = e.clientY;
    canvas.style.cursor = 'pointer';
  } else {
    tooltipVisible.value = false;
    canvas.style.cursor = 'default';
  }
};

onMounted(() => {
  nextTick(drawChart);
  window.addEventListener('resize', drawChart);
  if (canvasRef.value) {
    canvasRef.value.addEventListener('mousemove', handleMouseMove);
    canvasRef.value.addEventListener('mouseleave', () => { tooltipVisible.value = false; });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', drawChart);
});

// 监听控制参数的变化，实时重绘
watch([() => props.pieData, () => props.innerRadius, () => props.ringThickness], drawChart, { deep: true });
</script>

<style scoped>
@import url('../../assets/css/antd.css');

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>