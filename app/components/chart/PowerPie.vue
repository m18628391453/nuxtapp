<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" :style="customPadding">
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 shrink-0">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">
        {{ title }}
      </h3>
    </div>

    <div class="flex items-center gap-4 flex-1 min-h-0 pt-2 -mt-2">
      <div ref="chartContainer" :class="`relative w-[${props.pieSize || '180'}px] min-w-[150px] h-full flex items-center justify-center shrink-0`">
        <canvas ref="canvasRef" :width="canvasSize.width" :height="canvasSize.height" class="w-full h-full" style="display: block;"></canvas>
        
        <!-- 自定义tooltip -->
        <div v-if="tooltipVisible" 
             class="fixed z-50 bg-[rgba(5,13,29,0.9)] border border-[#1A2A4A] rounded-md px-3 py-1.5 text-white text-xs shadow-lg pointer-events-none"
             :style="{ left: tooltipX + 'px', top: tooltipY + 'px', transform: 'translate(10px, -30px)' }">
          <div>{{ tooltipName }}: {{ tooltipValue.toLocaleString() }} {{ unit }}</div>
          <div>占比: {{ tooltipPercent.toFixed(1) }}%</div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-3 justify-center pr-2 overflow-y-auto">
        <div v-for="(item, idx) in pieData" :key="idx" 
             :class="layout === 'row' ? 'flex items-center justify-between -pl-1' : 'flex flex-col gap-0.5'">
          
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
  title: { type: String, default: '各系统用电组成' },
  centerTitle: { type: String, default: '总用电量(kWh)' },
  unit: { type: String, default: 'kWh' },
  layout: { type: String, default: 'column' },
  pieSize: { type: Number, default: 180 },
  innerRadiusRatio: { type: Number, default: 0.2 },
  // 最小厚度比例（最内圈环形的厚度，范围 0.02~0.15，默认 0.05）
  minThickness: { type: Number, default: 0.12 },
  // 最大厚度比例（最外圈环形的厚度，范围 0.05~0.25，默认 0.15）
  maxThickness: { type: Number, default: 0.2 },
  // ===================================
  
  pieData: {
    type: Array,
    default: () => [
      { name: '对虾车间', value: 4544, color: '#54D1FF', gradientStart: '#33A8FFC0' },
      { name: '鲈鱼车间', value: 3321, color: '#5DE999', gradientStart: '#3DD17AC0' },
      { name: '水藻车间', value: 3113, color: '#76E8F0', gradientStart: '#55D0E0C0' },
    ]
  },
  customPadding: { type: Object, default: () => ({ padding: '0.5rem 1.2rem 1rem 1.5rem' }) }
});

const chartContainer = ref(null);
const canvasRef = ref(null);
const canvasSize = ref({ width: 200, height: 200 });
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
 * 厚度比例 = minThickness + (rank / maxRank) * (maxThickness - minThickness)
 */
const getOuterRadiusRatio = (idx, totalCount, rank) => {
  // 使用传入的可配置参数
  const MIN_THICKNESS = Math.max(0.02, Math.min(0.15, props.minThickness));
  const MAX_THICKNESS = Math.max(0.05, Math.min(0.25, props.maxThickness));
  const INNER_RADIUS_RATIO = Math.max(0.3, Math.min(0.8, props.innerRadiusRatio));
  
  // 如果只有一个数据，取中间厚度
  if (totalCount === 1) {
    const midThickness = (MIN_THICKNESS + MAX_THICKNESS) / 2;
    return INNER_RADIUS_RATIO + midThickness;
  }
  
  // 等差数列计算厚度比例
  const t = rank / (totalCount - 1);  // 0 ~ 1
  const thickness = MIN_THICKNESS + t * (MAX_THICKNESS - MIN_THICKNESS);
  
  return INNER_RADIUS_RATIO + thickness;
};

// 绘制图表
const drawChart = () => {
  const canvas = canvasRef.value;
  const container = chartContainer.value;
  if (!canvas || !container) return;
  
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (width <= 0 || height <= 0) return;
  
  canvas.width = width;
  canvas.height = height;
  canvasSize.value = { width, height };
  
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
    
    // 保存当前扇区信息
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
    
    // 创建渐变 (沿着半径方向)
    const angleMid = (startRad + endRad) / 2;
    const grad = ctx.createLinearGradient(
      centerX + Math.cos(angleMid) * innerRadius,
      centerY + Math.sin(angleMid) * innerRadius,
      centerX + Math.cos(angleMid) * outerRadius,
      centerY + Math.sin(angleMid) * outerRadius
    );
    grad.addColorStop(0, item.gradientStart || (item.color + 'C0'));
    grad.addColorStop(1, item.color);
    
    ctx.fillStyle = grad;
    ctx.fill();
    
    // 添加阴影光晕效果
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
  const fontSize1 = Math.max(12, Math.floor(radius * 0.11));
  const fontSize2 = Math.max(9, Math.floor(radius * 0.06));
  
  ctx.font = `bold ${fontSize1}px monospace`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(totalValue.value.toLocaleString(), centerX, centerY - 5);
  
  ctx.font = `${fontSize2}px sans-serif`;
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(props.centerTitle, centerX, centerY + 15);
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

const handleResize = () => {
  nextTick(() => {
    drawChart();
  });
};

onMounted(() => {
  nextTick(() => {
    drawChart();
    if (chartContainer.value) {
      resizeObserver = new ResizeObserver(() => {
        drawChart();
      });
      resizeObserver.observe(chartContainer.value);
    }
    window.addEventListener('resize', handleResize);
    const canvas = canvasRef.value;
    if (canvas) {
      canvas.addEventListener('mousemove', handleCanvasMouseMove);
      canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
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
  drawChart();
});

// 监听新增的可配置参数
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