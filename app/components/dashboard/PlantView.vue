<template>
  <div class="bg-[#0A162C]/10 rounded-lg px-4 pt-4 pb-0 flex flex-col h-full w-full relative overflow-hidden font-yahei">
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1 h-[33px] z-20">
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">能源拓扑</h3>
      
      <div class="flex gap-6 text-[11px] text-[#9CA3AF] relative z-10">
        <div class="flex items-center gap-4">
          <span>类型说明:</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#059669] rounded-[1px]"></span> 清洁能源</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#4B5563] rounded-[1px]"></span> 关键负荷</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#6366F1] rounded-[1px]"></span> 可调负荷</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#DC2626] rounded-[1px]"></span> 可断负荷</span>
        </div>
        <div class="flex items-center gap-4">
          <span>状态说明:</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#10B981] rounded-[1px]"></span> 发电中</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#F59E0B] rounded-[1px]"></span> 未运行</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#3B82F6] rounded-[1px]"></span> 待机中</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-[#6B7280] rounded-[1px]"></span> 已离线</span>
        </div>
      </div>
    </div>

    <div class="flex-1 w-[105%] h-[105%] relative overflow-hidden z-10000" ref="containerRef">
      <div class="absolute origin-top-left" :style="{ 
        width: `${VIRTUAL_WIDTH}px`, 
        height: `${VIRTUAL_HEIGHT}px`, 
        transform: `scale(${scaleRatio})`,
        left: `${offsetX + GLOBAL_OFFSET_X}px`,
        top: `${offsetY + GLOBAL_OFFSET_Y}px`
      }">
        
        <canvas ref="canvasRef" :width="VIRTUAL_WIDTH" :height="VIRTUAL_HEIGHT" class="absolute top-0 left-0 w-full h-full z-0"></canvas>

        <div class="absolute text-cyan-300 font-bold text-lg z-10" style="left: 60px; top: 250px;">10kV</div>
        <div class="absolute text-cyan-300 font-bold text-lg z-10" style="left: 60px; top: 520px;">380V</div>

        <div 
          v-for="node in nodes" 
          :key="node.id"
          class="absolute z-10 flex justify-center items-center group cursor-pointer transition-transform hover:scale-105"
          :style="{
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)'
          }"
        >
          <img :src="`/image/${node.icon}`" 
               :style="{ height: `${node.level <= 2 ? BASE_ICON_HEIGHT * LARGE_ICON_SCALE : BASE_ICON_HEIGHT}px` }"
               class="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10" 
               alt="device" />
          
          <div class="absolute bg-[#0B1B34]/90 border border-[#22D3EE]/30 rounded-md p-2 min-w-[140px] shadow-[0_0_10px_rgba(34,211,238,0.1)] backdrop-blur-sm z-20 pointer-events-none"
               :style="node.level <= 2 
                  ? { left: `calc(50% + ${(BASE_ICON_HEIGHT * LARGE_ICON_SCALE)/2 + 15}px)`, top: '50%', transform: 'translateY(-50%)' }
                  : { top: `calc(50% + ${BASE_ICON_HEIGHT/2 + 10}px)`, left: '50%', transform: 'translateX(-50%)' }">
            <div class="flex justify-between items-center mb-2 border-b border-[#22D3EE]/20 pb-1">
              <span class="text-white text-sm font-bold">{{ node.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded text-white" :style="{ backgroundColor: getStatusColor(node.status) }">
                {{ getStatusText(node.status) }}
              </span>
            </div>
            <div class="flex flex-col gap-1 text-[12px]">
              <div class="flex justify-between">
                <span class="text-[#9CA3AF]">电压(V):</span>
                <span class="text-cyan-400 font-mono">{{ node.voltage }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#9CA3AF]">功率(kW):</span>
                <span class="text-cyan-400 font-mono">{{ node.power }}</span>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-[2px] w-full rounded-b-md" :style="{ backgroundColor: getTypeColor(node.type) }"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

// ==========================================
// 👵 奶奶留给你们的配置区（随时在这里调整参数）
// ==========================================

// --- 1. 全局位置偏移配置 ---
const GLOBAL_OFFSET_X = 15; // 往右偏填正数，往左偏填负数 (例如: 50)
const GLOBAL_OFFSET_Y = -5; // 往下偏填正数，往上偏填负数 (例如: 30)

// --- 2. 图标大小配置 ---
const BASE_ICON_HEIGHT = 120;  // 第三行图标的基础高度
const LARGE_ICON_SCALE = 1.15; // 第一、二行图标放大的倍数 (1.2 就是大 20%)

// --- 3. 动效光束配置 ---
const BEAM_LENGTH = 200; // 发光线的长度
const BEAM_SPEED = 3;    // 发光线的移动速度

// ==========================================

// 虚拟画布尺寸
const VIRTUAL_WIDTH = 1720;
const VIRTUAL_HEIGHT = 840;

const containerRef = ref(null);
const canvasRef = ref(null);
const scaleRatio = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);

// --- 节点数据配置 (奶奶加了 level 字段来区分第几行) ---
const nodes = ref([
  // 第一行：10kV 级别 (level: 1)
  { id: 'grid', name: '市政电网', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'powergrid.png', level: 1, x: 250, y: 120 },
  { id: 'pv', name: '光伏系统', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'pv.png', level: 1, x: 600, y: 120 },
  { id: 'wind', name: '风电系统', type: 'clean', status: 'stopped', voltage: '3800', power: '1,000', icon: 'wind.png', level: 1, x: 950, y: 120 },
  { id: 'diesel', name: '柴油发电', type: 'clean', status: 'standby', voltage: '3800', power: '1,000', icon: 'generator.png', level: 1, x: 1300, y: 120 },
  
  // 第二行：主变 (level: 2)
  { id: 'transformer', name: '主变设备', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'transformer.png', level: 2, x: 400, y: 390 },
  
  // 第三行：380V 负载级别 (level: 3)
  { id: 'storage', name: '储能系统', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'storage.png', level: 3, x: 150, y: 660 },
  { id: 'charger', name: '充电桩', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'charger.png', level: 3, x: 350, y: 660 },
  { id: 'heatpump', name: '热泵系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'pump.png', level: 3, x: 550, y: 660 },
  { id: 'oxygen', name: '增氧设备', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'oxygener.png', level: 3, x: 750, y: 660 },
  { id: 'waterpump', name: '循环水泵', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'waterpump.png', level: 3, x: 950, y: 660 },
  { id: 'fodder', name: '投料系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'fodder.png', level: 3, x: 1150, y: 660 },
  { id: 'office', name: '办公用电', type: 'interruptible', status: 'running', voltage: '3800', power: '1,000', icon: 'officepower.png', level: 3, x: 1350, y: 660 },
])

// --- 连接线数据配置 ---
const lines = [
  // 横向母线
  { id: 'bus_10kv', points: [[120, 280], [1450, 280]], isBus: true },
  { id: 'bus_380v', points: [[120, 540], [1450, 540]], isBus: true },

  // 设备连接到 10kV 母线
  { id: 'link_grid', points: [[250, 180], [250, 280]] },
  { id: 'link_pv', points: [[600, 180], [600, 280]] },
  { id: 'link_wind', points: [[950, 180], [950, 280]] },
  { id: 'link_diesel', points: [[1300, 180], [1300, 280]] },

  // 主变连接线
  { id: 'link_trans_in', points: [[400, 280], [400, 330]] },
  { id: 'link_trans_out', points: [[400, 450], [400, 540]] },

  // 380V 母线连接到各个负载设备
  { id: 'link_storage', points: [[150, 540], [150, 600]] },
  { id: 'link_charger', points: [[350, 540], [350, 600]] },
  { id: 'link_heatpump', points: [[550, 540], [550, 600]] },
  { id: 'link_oxygen', points: [[750, 540], [750, 600]] },
  { id: 'link_waterpump', points: [[950, 540], [950, 600]] },
  { id: 'link_fodder', points: [[1150, 540], [1150, 600]] },
  { id: 'link_office', points: [[1350, 540], [1350, 600]] },
];

// --- 映射字典 ---
const getTypeColor = (type) => {
  const map = { 'clean': '#059669', 'key': '#4B5563', 'adjustable': '#6366F1', 'interruptible': '#DC2626' }
  return map[type] || '#22D3EE'
}
const getStatusColor = (status) => {
  const map = { 'running': '#10B981', 'stopped': '#F59E0B', 'standby': '#3B82F6', 'offline': '#6B7280' }
  return map[status] || '#10B981'
}
const getStatusText = (status) => {
  const map = { 'running': '发电中', 'stopped': '未运行', 'standby': '待机中', 'offline': '已离线' }
  return map[status] || status
}

// --- 👵 核心：2D Canvas 发光线束引擎 ---
let animationFrameId = null;
let beams = [];

const initBeams = () => {
  beams = [];
  // 过滤出横向母线
  const busLines = lines.filter(l => l.isBus);
  
  busLines.forEach(bus => {
    const startX = bus.points[0][0];
    const endX = bus.points[1][0];
    const y = bus.points[0][1];
    
    // 给每条母线分配 4 条光束，均匀错开初始位置
    const busWidth = endX - startX;
    for (let i = 0; i < 4; i++) {
      beams.push({
        x: startX + (busWidth / 4) * i, // 当前头部 X 坐标
        y: y,
        startX: startX,
        endX: endX
      });
    }
  });
}

// Canvas 渲染主循环
const renderCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // 清除上一帧
  ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // 1. 画所有静态底线（包括竖线和横线）
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#185B88'; // 静态底色
  ctx.shadowColor = '#22D3EE';
  ctx.shadowBlur = 4;
  
  lines.forEach(line => {
    ctx.beginPath();
    const pts = line.points;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for(let i=1; i<pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  });
  ctx.restore();

  // 2. 画长发光线束 (只在母线上从左往右移动)
  beams.forEach(beam => {
    // 移动光束
    beam.x += BEAM_SPEED;
    // 超出终点后，回到起点前面一点，形成循环
    if (beam.x - BEAM_LENGTH > beam.endX) {
      beam.x = beam.startX;
    }

    // 计算实际应该绘制的起点和终点，防止光线画出母线的范围
    const drawStartX = Math.max(beam.startX, beam.x - BEAM_LENGTH);
    const drawEndX = Math.min(beam.endX, beam.x);

    if (drawStartX < drawEndX) {
      ctx.save();
      // 创建渐变：尾部完全透明，头部最亮
      const gradient = ctx.createLinearGradient(beam.x - BEAM_LENGTH, 0, beam.x, 0);
      gradient.addColorStop(0, 'rgba(58, 178, 255, 0)');
      gradient.addColorStop(0.7, 'rgba(58, 178, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

      ctx.beginPath();
      ctx.moveTo(drawStartX, beam.y);
      ctx.lineTo(drawEndX, beam.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#3AB2FF';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    }
  });

  animationFrameId = requestAnimationFrame(renderCanvas);
}

// --- 自适应缩放逻辑 ---
let resizeObserver = null;
const handleResize = () => {
  if (!containerRef.value) return;
  const container = containerRef.value;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  
  // 计算缩放比例
  const scaleX = cw / VIRTUAL_WIDTH;
  const scaleY = ch / VIRTUAL_HEIGHT;
  scaleRatio.value = Math.min(scaleX, scaleY) * 1.0; 
  
  // 居中偏移量
  const displayW = VIRTUAL_WIDTH * scaleRatio.value;
  const displayH = VIRTUAL_HEIGHT * scaleRatio.value;
  offsetX.value = (cw - displayW) / 2;
  offsetY.value = (ch - displayH) / 2;
}

onMounted(() => {
  nextTick(() => {
    handleResize();
    initBeams();
    renderCanvas();
    
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.value) {
      resizeObserver.observe(containerRef.value);
    }
    window.addEventListener('resize', handleResize);
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
    resizeObserver.disconnect();
  }
  window.removeEventListener('resize', handleResize);
})
</script>

<style scoped>
/* 保证动画流畅 */
canvas {
  will-change: transform;
}
</style>