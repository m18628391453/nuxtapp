<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" :style="customPadding">
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 shrink-0">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
        {{ title }}
      </h3>
    </div>

    <div class="flex items-center gap-4 flex-1 min-h-0 pt-2 -mt-5">
      <div 
        ref="chartContainer" 
        class="flex items-center justify-center shrink-0"
        :class="layout === 'row' ?  '-ml-5' : '-ml-4'" 
        :style="{ width: `${pieSize}px`, height: `${pieSize}px`, marginLeft: `${layout === 'row' ? '-25': '-25'}px` }"
      >
        <canvas 
          ref="canvasRef" 
          :width="pieSize" 
          :height="pieSize" 
          class="block"
          :style="{ width: `${pieSize}px`, height: `${pieSize}px` }"
        ></canvas>
        
        <!-- 自定义tooltip -->
        <div v-if="tooltipVisible" 
             class="fixed z-50 bg-[rgba(5,13,29,0.9)] border border-[#1A2A4A] rounded-md px-3 py-1.5 text-white text-xs shadow-lg pointer-events-none"
             :style="{ left: tooltipX + 'px', top: tooltipY + 'px', transform: 'translate(10px, -30px)' }">
          <div>{{ tooltipName }}: {{ tooltipValue.toLocaleString() }} {{ unit }}</div>
          <div>占比: {{ tooltipPercent.toFixed(1) }}%</div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-3 justify-center pr-2 overflow-y-auto -ml-4">
        <div v-for="(item, idx) in pieData" :key="idx" 
             :class="layout === 'row' ? 'flex items-center justify-between -pl-2' : 'flex flex-col gap-0.5 -pl-4'">
          
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }"></div>
            <span class="text-gray-300 font-medium text-[12px] truncate">{{ item.name }}</span>
          </div>

          <span class="flex items-baseline text-white font-bold text-[14px] font-mono" :class="layout === 'row' ? 'ml-2' : 'ml-5'">
            {{ (item.value || 0).toLocaleString() }}
            <span class="text-gray-300 text-[10px] font-normal ml-1">{{ unit }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  centerTitle: { type: String, default: '' },
  unit: { type: String, default: '' },
  layout: { type: String, default: 'column' },
  pieSize: { type: Number, default: 175 },
  innerRadiusRatio: { type: Number, default: 0.45 },
  minThickness: { type: Number, default: 0.3 },
  maxThickness: { type: Number, default: 0.35 },
  pieData: {
    type: Array,
    default: () => []
  },
  customPadding: { type: Object, default: () => ({ padding: '0.5rem 1rem 1rem 1.2rem' }) }
});

const chartContainer = ref(null);
const canvasRef = ref(null);
const tooltipVisible = ref(false);
const tooltipX = ref(0);
const tooltipY = ref(0);
const tooltipName = ref('');
const tooltipValue = ref(0);
const tooltipPercent = ref(0);

let resizeObserver = null;
let currentHoverSector = null;
let sectors = [];

// 计算总量
const totalValue = computed(() => {
  return props.pieData.reduce((sum, item) => sum + (item.value || 0), 0);
});

/**
 * 为每个数据项分配厚度排名（基于原始顺序的稳定排名）
 * 相同数值的数据也按原始顺序分配不同的厚度（依次递增）
 */
const getThicknessRankMap = () => {
  const indexed = props.pieData.map((item, idx) => ({ 
    idx, 
    value: item.value || 0,
    originalOrder: idx
  }));
  
  // 排序：先按数值升序，相同数值按原始索引升序
  indexed.sort((a, b) => {
    if (a.value !== b.value) return a.value - b.value;
    return a.originalOrder - b.originalOrder;
  });
  
  const rankMap = new Map();
  indexed.forEach((item, rank) => {
    rankMap.set(item.idx, rank);
  });
  
  return rankMap;
};

/**
 * 根据排名计算外半径比例
 * 内半径固定 = innerRadiusRatio
 * 外半径 = innerRadiusRatio + 厚度比例
 */
const getOuterRadiusRatio = (idx, totalCount, rank) => {
  const MIN_THICKNESS = Math.max(0.02, Math.min(0.15, props.minThickness));
  const MAX_THICKNESS = Math.max(0.05, Math.min(0.25, props.maxThickness));
  const INNER_RADIUS_RATIO = Math.max(0.3, Math.min(0.8, props.innerRadiusRatio));
  
  if (totalCount === 1) {
    const midThickness = (MIN_THICKNESS + MAX_THICKNESS) / 2;
    return INNER_RADIUS_RATIO + midThickness;
  }
  
  const t = rank / (totalCount - 1);
  const thickness = MIN_THICKNESS + t * (MAX_THICKNESS - MIN_THICKNESS);
  
  return INNER_RADIUS_RATIO + thickness;
};

/**
 * 创建沿扇形角度方向的渐变
 */
const createAngularGradient = (ctx, centerX, centerY, innerRadius, outerRadius, startRad, endRad, colorStart, colorEnd) => {
  // 计算渐变线的起点和终点（沿扇形中间半径的圆弧切线方向）
  const midRadius = (innerRadius + outerRadius) / 2;
  
  // 渐变起点：扇形起始边中点
  const startX = centerX + Math.cos(startRad) * midRadius;
  const startY = centerY + Math.sin(startRad) * midRadius;
  
  // 渐变终点：扇形结束边中点
  const endX = centerX + Math.cos(endRad) * midRadius;
  const endY = centerY + Math.sin(endRad) * midRadius;
  
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  
  return gradient;
};

// 绘制图表
const drawChart = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const width = props.pieSize;
  const height = props.pieSize;
  if (width <= 0 || height <= 0) return;
  
  // canvas 尺寸已经通过属性设置好了，这里只需要获取
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  // 使用可配置的内径比例
  const INNER_RADIUS_RATIO = Math.max(0.3, Math.min(0.8, props.innerRadiusRatio));
  const innerRadius = radius * INNER_RADIUS_RATIO;
  
  // 获取厚度排名
  const rankMap = getThicknessRankMap();
  const totalCount = props.pieData.length;
  
  // 准备角度数据 (基于原始value比例，起始角度90度)
  const startAngleDeg = 90;
  let currentAngleDeg = startAngleDeg;
  const angles = [];
  
  for (let i = 0; i < props.pieData.length; i++) {
    const item = props.pieData[i];
    const value = item.value || 0;
    const angleDeg = totalValue.value > 0 ? (value / totalValue.value) * 360 : 360 / props.pieData.length;
    angles.push({
      startDeg: currentAngleDeg,
      endDeg: currentAngleDeg + angleDeg,
      value: value,
      idx: i,
    });
    currentAngleDeg += angleDeg;
  }
  
  // 存储扇区信息用于tooltip
  sectors = [];
  
  // 绘制每个扇形
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    const item = props.pieData[angle.idx];
    const rank = rankMap.get(angle.idx);
    const outerRadiusRatio = getOuterRadiusRatio(angle.idx, totalCount, rank);
    const outerRadius = radius * outerRadiusRatio;
    
    const startRad = (angle.startDeg * Math.PI) / 180;
    const endRad = (angle.endDeg * Math.PI) / 180;
    
    // 保存当前扇区信息（用于tooltip的坐标需要相对于canvas）
    sectors.push({
      idx: angle.idx,
      name: item.name,
      value: item.value,
      startRad,
      endRad,
      innerRadius,
      outerRadius,
      centerX,
      centerY,
      color: item.color,
      rank: rank,
    });
    
    // 绘制扇形路径
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, startRad, endRad);
    ctx.arc(centerX, centerY, outerRadius, endRad, startRad, true);
    ctx.closePath();
    
    // 使用沿角度方向的渐变（从扇形起始边到结束边）
    const gradientStartColor = item.gradientStart || (item.color + 'C0');
    const gradientEndColor = item.color;
    
    const grad = createAngularGradient(
      ctx, centerX, centerY, 
      innerRadius, outerRadius, 
      startRad, endRad, 
      gradientStartColor, gradientEndColor
    );
    
    ctx.fillStyle = grad;
    ctx.fill();
    
    // 添加阴影光晕效果（先保存状态，避免阴影影响边框）
    ctx.save();
    ctx.shadowBlur = 6;
    ctx.shadowColor = `${item.color}80`;
    ctx.fill();
    ctx.restore();
    
    // 绘制边框
    ctx.strokeStyle = '#0A162C';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  
  // 绘制中心圆 (覆盖中间区域，制造环形效果)
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius - 1, 0, Math.PI * 2);
  ctx.fillStyle = '#051020';
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // 绘制中心文字
  const fontSize1 = Math.max(15, Math.floor(radius * 0.11));
  const fontSize2 = Math.max(9, Math.floor(radius * 0.06));
  
  ctx.font = `bold ${fontSize1}px monospace`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(totalValue.value.toLocaleString(), centerX, centerY - 5);
  
  ctx.font = `${fontSize2}px sans-serif`;
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(props.centerTitle, centerX, centerY + 10);
};

// 鼠标移动检测tooltip
const handleCanvasMouseMove = (e) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;
  
  let hitSector = null;
  for (const sector of sectors) {
    const dx = mouseX - sector.centerX;
    const dy = mouseY - sector.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < sector.innerRadius || distance > sector.outerRadius) continue;
    
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    let start = sector.startRad;
    let end = sector.endRad;
    if (start > end) end += Math.PI * 2;
    let testAngle = angle;
    if (testAngle < start) testAngle += Math.PI * 2;
    if (testAngle >= start && testAngle <= end) {
      hitSector = sector;
      break;
    }
  }
  
  if (hitSector) {
    const percent = (hitSector.value / totalValue.value) * 100;
    tooltipName.value = hitSector.name;
    tooltipValue.value = hitSector.value;
    tooltipPercent.value = percent;
    tooltipX.value = e.clientX;
    tooltipY.value = e.clientY;
    tooltipVisible.value = true;
    currentHoverSector = hitSector;
    canvas.style.cursor = 'pointer';
  } else {
    tooltipVisible.value = false;
    canvas.style.cursor = 'default';
    currentHoverSector = null;
  }
};

const handleCanvasMouseLeave = () => {
  tooltipVisible.value = false;
  if (canvasRef.value) canvasRef.value.style.cursor = 'default';
};

// 监听数据变化重绘
const handleResize = () => {
  nextTick(() => {
    drawChart();
  });
};

onMounted(() => {
  nextTick(() => {
    drawChart();
    window.addEventListener('resize', handleResize);
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.addEventListener('mousemove', handleCanvasMouseMove);
      canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
  }
});

watch(() => props.pieData, () => {
  drawChart();
}, { deep: true });

watch(() => props.pieSize, () => {
  // pieSize 变化时，需要等待 DOM 更新后再重绘
  nextTick(() => {
    drawChart();
  });
});

watch(() => props.innerRadiusRatio, () => {
  drawChart();
});
watch(() => props.minThickness, () => {
  drawChart();
});
watch(() => props.maxThickness, () => {
  drawChart();
});

watch(totalValue, () => {
  drawChart();
});
</script>