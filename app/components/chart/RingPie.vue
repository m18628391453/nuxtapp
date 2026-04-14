<template>
  <div class="bg-transparent flex flex-col h-full w-full relative overflow-hidden text-white" :style="customPadding">
    <div class="w-full bg-gradient-to-r from-[#005292] to-transparent flex items-center py-2 px-3 relative shrink-0 mb-4">
      <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00A2FF] shadow-[0_0_8px_#00A2FF]"></div>
      <h3 class="text-[16px] font-medium tracking-wide">
        {{ title }}
      </h3>
      <div class="ml-auto flex items-center gap-3 scale-90 origin-right">
        <div class="flex border border-[#00A2FF]/50 rounded overflow-hidden">
          <span class="bg-[#00A2FF] px-2 py-0.5 text-[12px] cursor-pointer">充电</span>
          <span class="px-2 py-0.5 text-[12px] cursor-pointer">放电</span>
        </div>
        <div class="border border-white/20 px-2 py-0.5 rounded text-[12px] flex items-center gap-1 cursor-pointer">
          当月 <span class="text-[10px] opacity-50">▼</span>
        </div>
      </div>
    </div>

    <div class="flex items-center flex-1 min-h-0">
      <div 
        ref="chartContainer" 
        class="relative flex items-center justify-center shrink-0"
        :style="{ width: `${pieSize}px`, height: `${pieSize}px` }"
      >
        <canvas 
          ref="canvasRef" 
          :width="pieSize * 2" 
          :height="pieSize * 2" 
          class="block"
          :style="{ width: `${pieSize}px`, height: `${pieSize}px` }"
        ></canvas>
        
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div class="text-[24px] font-bold font-mono tracking-tighter leading-none">
            {{ totalValue.toLocaleString() }}
          </div>
          <div class="text-[12px] text-gray-400 mt-1">
            总量({{ unit }})
          </div>
        </div>

        <div v-if="tooltipVisible" 
             class="fixed z-50 bg-[#050D1D] border border-[#00A2FF]/50 rounded px-3 py-2 text-white text-xs shadow-2xl pointer-events-none"
             :style="{ left: tooltipX + 'px', top: tooltipY + 'px', transform: 'translate(15px, -50%)' }">
          <div class="border-b border-white/10 pb-1 mb-1 font-bold">{{ tooltipName }}</div>
          <div>数值: {{ tooltipValue.toLocaleString() }} {{ unit }}</div>
          <div>占比: {{ tooltipPercent.toFixed(2) }}%</div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-4 justify-center pl-0 overflow-y-auto">
        <div v-for="(item, idx) in pieData" :key="idx" class="flex items-start gap-3">
          <div class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" :style="{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }"></div>
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <span class="text-gray-300 text-[13px]">{{ item.name }}</span>
              <span class="text-gray-400 text-[13px]">{{ ((item.value / (totalValue || 1)) * 100).toFixed(2) }}%</span>
            </div>
            <div class="text-[15px] font-bold font-mono tracking-wide">
              {{ (item.value || 0).toLocaleString() }}
              <span class="text-[11px] font-normal text-gray-500 ml-1">{{ unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps({
  title: { type: String, default: '尖峰平台占比' },
  unit: { type: String, default: '万kW' },
  pieSize: { type: Number, default: 75 },
  // 新增：直接设置内径半径 (px)
  innerRadius: { type: Number, default: 50 }, 
  // 新增：直接设置环的厚度 (px)
  ringThickness: { type: Number, default: 20 },
  pieData: {
    type: Array,
    default: () => [
      { name: '峰', value: 2658.5, color: '#00A2FF' },
      { name: '尖', value: 1358.5, color: '#00FFA2' },
      { name: '谷', value: 3723.5, color: '#D2E43B' },
      { name: '平', value: 1658.6, color: '#FFB822' }
    ]
  },
  customPadding: { type: Object, default: () => ({ padding: '10px' }) }
});

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
  drawInnerScale(ctx, centerX, centerY, iRadius - 12);

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

// 绘制内侧的装饰刻度
const drawInnerScale = (ctx, cx, cy, radius) => {
  ctx.save();
  const count = 80; // 刻度密一点更好看
  for (let i = 0; i < count; i++) {
    const angle = (i * (360 / count) * Math.PI) / 180;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.arc(x, y, 0.8, 0, Math.PI * 2);
    // 每隔5个点做一个亮蓝色主刻度
    if (i % 5 === 0) {
      ctx.fillStyle = 'rgba(0, 162, 255, 0.9)';
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'rgba(0, 162, 255, 0.8)';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
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
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>