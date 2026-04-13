<template>
  <div class="bg-[#0A162C]/10 rounded-lg px-4 pt-4 pb-0 flex flex-col h-full w-full relative overflow-hidden font-yahei">
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1 h-[33px] z-20">
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
      <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">能源拓扑</h3>
      
      <div class="flex gap-6 text-[11px] text-[#9CA3AF] relative z-10">
        <div class="flex items-center gap-4">
          <span>类型说明:</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 bg-[#059669]/60 border border-[#059669]/80 rounded-[1px]"></span> 清洁能源</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 bg-[#4B5563]/60 border border-[#4B5563]/80 rounded-[1px]"></span> 关键负荷</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 bg-[#6366F1]/60 border border-[#6366F1]/80 rounded-[1px]"></span> 可调负荷</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 bg-[#DC2626]/60 border border-[#DC2626]/80 rounded-[1px]"></span> 可断负荷</span>
        </div>
        <div class="flex items-center gap-3">
          <span>状态说明:</span>
          <span v-for="s in ['running', 'stopped', 'standby', 'offline']" :key="s" 
                class="px-1 py-0 rounded text-[9px] text-white/90"
                :style="{ backgroundColor: getStatusColor(s, 0.15), color: getStatusColor(s, 1), border: `1px solid ${getStatusColor(s, 0.35) }` }">
            {{ getStatusText(s) }}
          </span>
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
            left: `${node.x + (node.offX || 0)}px`,
            top: `${node.y + (node.offY || 0)}px`,
            transform: 'translate(-50%, -50%)'
          }"
        >
          <img :src="`/image/${node.icon}`" 
               :style="{ 
                 height: `${(node.level <= 2 ? BASE_ICON_HEIGHT * LARGE_ICON_SCALE : BASE_ICON_HEIGHT) * (node.scale || 1.0)}px` 
               }"
               class="object-contain relative z-10" 
               alt="device" />
          
          <div class="absolute bg-[#0B1B34]/45 border border-[#22D3EE]/30 rounded-md p-2 min-w-[135px] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-lg z-20 pointer-events-none transition-all"
               :style="node.level <= 2 
                  ? { 
                      left: `calc(50% + ${(BASE_ICON_HEIGHT * LARGE_ICON_SCALE * (node.scale || 1))/2 + (node.tOffX || 10)}px)`, 
                      top: `calc(50% + ${node.tOffY || 0}px)`, 
                      transform: 'translateY(-50%)' 
                    }
                  : { 
                      top: `calc(50% + ${(BASE_ICON_HEIGHT * (node.scale || 1))/2 + (node.tOffY || -10)}px)`, 
                      left: `calc(50% + ${node.tOffX || 0}px)`, 
                      transform: 'translateX(-50%)' 
                    }">
            <div class="flex justify-between items-center mb-1.5 border-b border-[#22D3EE]/20 pb-1">
              <span class="text-white text-[13px] font-bold tracking-wider">{{ node.name }}</span>
              <span class="px-1 py-0 rounded text-[9px] text-white/90 shadow-[0_0_8px_rgba(0,0,0,0.3)]" 
                    :style="{ backgroundColor: getStatusColor(s, 0.15), color: getStatusColor(s, 1), border: `1px solid ${getStatusColor(s, 0.35) }` }">
                {{ getStatusText(node.status) }}
              </span>
            </div>
            <div class="flex flex-col gap-1 text-[12px]">
              <div class="flex justify-between">
                <span class="text-[#9CA3AF]">电压(V):</span>
                <span class="text-cyan-400 font-mono font-bold">{{ node.voltage }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#9CA3AF]">功率(kW):</span>
                <span class="text-cyan-400 font-mono font-bold">{{ node.power }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const GLOBAL_OFFSET_X = 0; 
const GLOBAL_OFFSET_Y = -50; 

/** 样式配置 */
const LINE_WIDTH = 2;       
const BUS_LINE_WIDTH = 6;    
const BASE_ICON_HEIGHT = 150;  
const LARGE_ICON_SCALE = 1.1; 

const BEAM_LENGTH = 135; 
const BEAM_SPEED = 2.5;    

const VIRTUAL_WIDTH = 1600;
const VIRTUAL_HEIGHT = 720;

const containerRef = ref(null);
const canvasRef = ref(null);
const scaleRatio = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);

/**
 * 节点配置
 * tOffX/tOffY: 数据面板专用偏移，用于统一对齐高度
 */
const nodes = ref([
  { id: 'grid', name: '市政电网', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'powergrid.png', level: 1, x: 250, y: 160, offX: 0, offY: 0, tOffX: 10, tOffY: 0, scale: 1.1 },
  { id: 'pv', name: '光伏系统', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'pv.png', level: 1, x: 600, y: 160, offX: 0, offY: 22, tOffX: 10, tOffY: -22, scale: 1.1 },
  { id: 'wind', name: '风电系统', type: 'clean', status: 'stopped', voltage: '3800', power: '1,000', icon: 'wind.png', level: 1, x: 950, y: 160, offX: 0, offY: 0, tOffX: 10, tOffY: 0, scale: 1.1 },
  { id: 'diesel', name: '柴油发电', type: 'clean', status: 'standby', voltage: '3800', power: '1,000', icon: 'generator.png', level: 1, x: 1300, y: 160, offX: 0, offY: 15, tOffX: 10, tOffY: -15, scale: 1.1 },
  
  { id: 'transformer', name: '主变设备', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'transformer.png', level: 2, x: 400, y: 410, offX: 0, offY: -10, tOffX: 10, tOffY: 10, scale: 1.0 },
  
  { id: 'storage', name: '储能系统', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'storage.png', level: 3, x: 150, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'charger', name: '充电桩', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'charger.png', level: 3, x: 350, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'heatpump', name: '热泵系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'pump.png', level: 3, x: 550, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'oxygen', name: '增氧设备', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'oxygener.png', level: 3, x: 750, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'waterpump', name: '循环水泵', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'waterpump.png', level: 3, x: 950, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'fodder', name: '投料系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'fodder.png', level: 3, x: 1150, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
  { id: 'office', name: '办公用电', type: 'interruptible', status: 'running', voltage: '3800', power: '1,000', icon: 'officepower.png', level: 3, x: 1350, y: 640, offX: 0, offY: -5, tOffX: 0, tOffY: 15, scale: 0.9 },
])

const lines = [
  { id: 'bus_10kv', points: [[120, 280], [1450, 280]], isBus: true },
  { id: 'bus_380v', points: [[120, 540], [1450, 540]], isBus: true },
  { id: 'link_grid', points: [[250, 240]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_pv', points: [[600, 240]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_wind', points: [[950, 240]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_diesel', points: [[1300, 240]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_trans_in', points: [[400, 280]], offsetX: 0, offsetY: 0, len: 65 },
  { id: 'link_trans_out', points: [[400, 510]], offsetX: 0, offsetY: -30, len: 60 },
  { id: 'link_storage', points: [[150, 540]], offsetX: 4, offsetY: 0, len: 40 },
  { id: 'link_charger', points: [[350, 540]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_heatpump', points: [[550, 540]], offsetX: 0, offsetY: 0, len: 40 },
  { id: 'link_oxygen', points: [[750, 540]], offsetX: 0, offsetY: 0, len: 25 },
  { id: 'link_waterpump', points: [[950, 540]], offsetX: 4, offsetY: 0, len: 52 },
  { id: 'link_fodder', points: [[1150, 540]], offsetX: 4.2, offsetY: 0, len: 35 },
  { id: 'link_office', points: [[1350, 540]], offsetX: 0, offsetY: 0, len: 48 },
];

/** 增强：支持设置透明度的颜色方法 */
const getStatusColor = (status, opacity = 1) => {
  const map = { 
    'running': `rgba(16, 185, 129, ${opacity})`, 
    'stopped': `rgba(245, 158, 11, ${opacity})`, 
    'standby': `rgba(59, 130, 246, ${opacity})`, 
    'offline': `rgba(107, 114, 128, ${opacity})` 
  }
  return map[status] || `rgba(16, 185, 129, ${opacity})`
}

const getStatusText = (status) => {
  const map = { 'running': '发电中', 'stopped': '未运行', 'standby': '待机中', 'offline': '已离线' }
  return map[status] || status
}

let animationFrameId = null;
let beams = [];

const initBeams = () => {
  beams = [];
  const busLines = lines.filter(l => l.isBus);
  busLines.forEach(bus => {
    const startX = bus.points[0][0];
    const endX = bus.points[1][0];
    const y = bus.points[0][1];
    const busWidth = endX - startX;
    for (let i = 0; i < 4; i++) {
      beams.push({ x: startX + (busWidth / 4) * i, y, startX, endX });
    }
  });
}

const renderCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  ctx.save();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'; 
  ctx.shadowColor = '#22D3EE';
  ctx.shadowBlur = 2;
  
  lines.forEach(line => {
    ctx.beginPath();
    ctx.lineWidth = line.isBus ? BUS_LINE_WIDTH : LINE_WIDTH;
    const ox = line.offsetX || 0; 
    const oy = line.offsetY || 0;
    const pts = line.points;
    const startX = pts[0][0] + ox;
    const startY = pts[0][1] + oy;
    ctx.moveTo(startX, startY);

    if (line.isBus) {
      for(let i=1; i<pts.length; i++) {
        ctx.lineTo(pts[i][0] + ox, pts[i][1] + oy);
      }
    } else {
      if (line.len !== undefined) {
        ctx.lineTo(startX, startY + line.len);
      } else {
        for(let i=1; i<pts.length; i++) {
          ctx.lineTo(pts[i][0] + ox, pts[i][1] + oy);
        }
      }
    }
    ctx.stroke();
  });
  ctx.restore();

  beams.forEach(beam => {
    beam.x += BEAM_SPEED;
    if (beam.x - BEAM_LENGTH > beam.endX) beam.x = beam.startX;
    const drawStartX = Math.max(beam.startX, beam.x - BEAM_LENGTH);
    const drawEndX = Math.min(beam.endX, beam.x);

    if (drawStartX < drawEndX) {
      ctx.save();
      const gradient = ctx.createLinearGradient(beam.x - BEAM_LENGTH, 0, beam.x, 0);
      gradient.addColorStop(0, 'rgba(58, 178, 255, 0)');
      gradient.addColorStop(0.6, 'rgba(58, 178, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(150, 225, 255, 0.8)');
      ctx.beginPath();
      ctx.moveTo(drawStartX, beam.y);
      ctx.lineTo(drawEndX, beam.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }
  });
  animationFrameId = requestAnimationFrame(renderCanvas);
}

const handleResize = () => {
  if (!containerRef.value) return;
  const container = containerRef.value;
  const scaleX = container.clientWidth / VIRTUAL_WIDTH;
  const scaleY = container.clientHeight / VIRTUAL_HEIGHT;
  scaleRatio.value = Math.min(scaleX, scaleY); 
  offsetX.value = (container.clientWidth - VIRTUAL_WIDTH * scaleRatio.value) / 2;
  offsetY.value = (container.clientHeight - VIRTUAL_HEIGHT * scaleRatio.value) / 2;
}

onMounted(() => {
  nextTick(() => {
    handleResize();
    initBeams();
    renderCanvas();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.value) resizeObserver.observe(containerRef.value);
    window.addEventListener('resize', handleResize);
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
})
</script>

<style scoped>
canvas {
  will-change: transform;
}
.font-yahei {
  font-family: "Microsoft YaHei", sans-serif;
}
/* 优化磨砂面板的阴影和过渡 */
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>