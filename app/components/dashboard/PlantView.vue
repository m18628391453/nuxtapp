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
            left: `${node.x + (node.offX || 0)}px`,
            top: `${node.y + (node.offY || 0)}px`,
            transform: 'translate(-50%, -50%)'
          }"
        >
          <img :src="`/image/${node.icon}`" 
               :style="{ height: `${node.level <= 2 ? BASE_ICON_HEIGHT * LARGE_ICON_SCALE : BASE_ICON_HEIGHT}px` }"
               class="object-contain relative z-10" 
               alt="device" />
          
          <div class="absolute bg-[#0B1B34]/65 border border-[#22D3EE]/40 rounded-sm p-2 min-w-[130px] shadow-[0_0_15px_rgba(10,22,44,0.5)] backdrop-blur-md z-20 pointer-events-none"
               :style="node.level <= 2 
                  ? { left: `calc(50% + ${(BASE_ICON_HEIGHT * LARGE_ICON_SCALE)/2 + 10}px)`, top: '50%', transform: 'translateY(-50%)' }
                  : { top: `calc(50% + ${BASE_ICON_HEIGHT/2 - 10}px)`, left: '50%', transform: 'translateX(-50%)' }">
            <div class="flex justify-between items-center mb-1.5 border-b border-[#22D3EE]/20 pb-1">
              <span class="text-white text-[13px] font-bold tracking-wider">{{ node.name }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded text-white font-medium" :style="{ backgroundColor: getStatusColor(node.status) }">
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

const LINE_WIDTH = 2;
const BUS_LINE_WIDTH = 4;
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
 * 节点配置（增加了 offX, offY 字段）
 * 如果觉得某个图标离母线太远，就调大 offY。
 */
const nodes = ref([
  // 10kV 级别
  { id: 'grid', name: '市政电网', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'powergrid.png', level: 1, x: 250, y: 160, offX: 0, offY: 0 },
  { id: 'pv', name: '光伏系统', type: 'clean', status: 'running', voltage: '3800', power: '1,000', icon: 'pv.png', level: 1, x: 600, y: 160, offX: 0, offY: 0 },
  { id: 'wind', name: '风电系统', type: 'clean', status: 'stopped', voltage: '3800', power: '1,000', icon: 'wind.png', level: 1, x: 950, y: 160, offX: 0, offY: 0 },
  { id: 'diesel', name: '柴油发电', type: 'clean', status: 'standby', voltage: '3800', power: '1,000', icon: 'generator.png', level: 1, x: 1300, y: 160, offX: 0, offY: 0 },
  
  // 主变
  { id: 'transformer', name: '主变设备', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'transformer.png', level: 2, x: 400, y: 410, offX: 0, offY: 0 },
  
  // 380V 负载级别
  { id: 'storage', name: '储能系统', type: 'key', status: 'running', voltage: '3800', power: '1,000', icon: 'storage.png', level: 3, x: 150, y: 640, offX: 0, offY: -5 },
  { id: 'charger', name: '充电桩', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'charger.png', level: 3, x: 350, y: 640, offX: 0, offY: -5 },
  { id: 'heatpump', name: '热泵系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'pump.png', level: 3, x: 550, y: 640, offX: 0, offY: -5 },
  { id: 'oxygen', name: '增氧设备', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'oxygener.png', level: 3, x: 750, y: 640, offX: 0, offY: -5 },
  { id: 'waterpump', name: '循环水泵', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'waterpump.png', level: 3, x: 950, y: 640, offX: 0, offY: -5 },
  { id: 'fodder', name: '投料系统', type: 'adjustable', status: 'running', voltage: '3800', power: '1,000', icon: 'fodder.png', level: 3, x: 1150, y: 640, offX: 0, offY: -5 },
  { id: 'office', name: '办公用电', type: 'interruptible', status: 'running', voltage: '3800', power: '1,000', icon: 'officepower.png', level: 3, x: 1350, y: 640, offX: 0, offY: -5 },
])

/**
 * 连线配置（增加了 offsetX 字段用于竖线左右偏移微调）
 */
const lines = [
  // 横向母线 (isBus 为 true)
  { id: 'bus_10kv', points: [[120, 280], [1450, 280]], isBus: true },
  { id: 'bus_380v', points: [[120, 540], [1450, 540]], isBus: true },

  // 10kV 支线 - 通过 offsetX 调左右
  { id: 'link_grid', points: [[250, 240], [250, 280]], offsetX: 0 },
  { id: 'link_pv', points: [[600, 240], [600, 280]], offsetX: 0 },
  { id: 'link_wind', points: [[950, 240], [950, 280]], offsetX: 0 },
  { id: 'link_diesel', points: [[1300, 240], [1300, 280]], offsetX: 0 },

  // 主变支线
  { id: 'link_trans_in', points: [[400, 280], [400, 310]], offsetX: 0 },
  { id: 'link_trans_out', points: [[400, 510], [400, 540]], offsetX: 0 },

  // 380V 支线
  { id: 'link_storage', points: [[150, 540], [150, 564]], offsetX: 4 },
  { id: 'link_charger', points: [[350, 540], [350, 564]], offsetX: 0 },
  { id: 'link_heatpump', points: [[550, 540], [550, 564]], offsetX: 0 },
  { id: 'link_oxygen', points: [[750, 540], [750, 564]], offsetX: 0 },
  { id: 'link_waterpump', points: [[950, 540], [950, 564]], offsetX: 4 },
  { id: 'link_fodder', points: [[1150, 540], [1150, 564]], offsetX: 5 },
  { id: 'link_office', points: [[1350, 540], [1350, 564]], offsetX: 0 },
];

const getStatusColor = (status) => {
  const map = { 'running': '#10B981', 'stopped': '#F59E0B', 'standby': '#3B82F6', 'offline': '#6B7280' }
  return map[status] || '#10B981'
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

  // 绘制连线
  ctx.save();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)'; 
  ctx.shadowColor = '#22D3EE';
  ctx.shadowBlur = 2;
  
  lines.forEach(line => {
    ctx.beginPath();
    // 母线用母线宽度，支线用普通宽度
    ctx.lineWidth = line.isBus ? BUS_LINE_WIDTH : LINE_WIDTH;
    
    const ox = line.offsetX || 0; // 支线偏移量
    const pts = line.points;
    
    // 应用偏移量进行绘制
    ctx.moveTo(pts[0][0] + ox, pts[0][1]);
    for(let i=1; i<pts.length; i++) {
      ctx.lineTo(pts[i][0] + ox, pts[i][1]);
    }
    ctx.stroke();
  });
  ctx.restore();

  // 绘制母线光束
  beams.forEach(beam => {
    beam.x += BEAM_SPEED;
    if (beam.x - BEAM_LENGTH > beam.endX) beam.x = beam.startX;
    const drawStartX = Math.max(beam.startX, beam.x - BEAM_LENGTH);
    const drawEndX = Math.min(beam.endX, beam.x);

    if (drawStartX < drawEndX) {
      ctx.save();
      const gradient = ctx.createLinearGradient(beam.x - BEAM_LENGTH, 0, beam.x, 0);
      gradient.addColorStop(0, 'rgba(58, 178, 255, 0)');
      gradient.addColorStop(0.7, 'rgba(58, 178, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
      ctx.beginPath();
      ctx.moveTo(drawStartX, beam.y);
      ctx.lineTo(drawEndX, beam.y);
      ctx.strokeStyle = gradient;
      // 光束宽度也随母线宽度稍作加粗
      ctx.lineWidth = (BUS_LINE_WIDTH) + 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#3AB2FF';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }
  });
  animationFrameId = requestAnimationFrame(renderCanvas);
}

// 尺寸自适应逻辑保持不变
let resizeObserver = null;
const handleResize = () => {
  if (!containerRef.value) return;
  const container = containerRef.value;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const scaleX = cw / VIRTUAL_WIDTH;
  const scaleY = ch / VIRTUAL_HEIGHT;
  scaleRatio.value = Math.min(scaleX, scaleY); 
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
    resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.value) resizeObserver.observe(containerRef.value);
    window.addEventListener('resize', handleResize);
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (resizeObserver) resizeObserver.disconnect();
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
</style>