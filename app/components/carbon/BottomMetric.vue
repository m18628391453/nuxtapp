<template>
  <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden z-10">
    <!-- 标题栏 完全保留原有样式和日期选择器功能 -->
    <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
      <div
        class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none">
      </div>
      <div class="absolute left-[-16px] top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]">
      </div>
      <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">{{ title }}</h3>
      <div class="flex rounded-md p-0.5 relative z-10 mr-3">
        <!-- 科技风日期选择器 完全适配大屏深色背景 -->
        <div class="h-[24px] w-1 opacity-0" ></div>
      </div>
    </div>
    <!-- 核心指标展示区 改用Grid布局实现严格5等分布局 -->
    <div class="flex-1 relative min-h-0 w-full mt-2">
      <!-- 关键修改：用grid替代flex，repeat(5,1fr)强制5列等宽 -->
      <div class="grid grid-cols-5 w-full h-full px-2 place-items-center">
        <div 
          v-for="(item, index) in metrics" 
          :key="index" 
          class="flex flex-col items-center justify-center h-full gap-3 px-1 w-full"
        >
          <span 
            class="metric-title" 
            :title="item.title"
          >
            {{ item.title }}
          </span>
          <span class="metric-value">{{ item.value }}</span>
          <img :src="`/image/${item.icon}`" :alt="item.title" class="metric-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件入参定义 仅保留核心功能参数
const props = defineProps({
  // 组件标题
  title: {
    type: String,
    required: true
  },
  // 核心指标数据 父级可动态传入覆盖默认值
  metrics: {
    type: Array,
    default: () => [
      {
        title: '外购水量(t)',
        value: '297.59',
        icon: 'water_icon.png'
      },
      {
        title: '外购电量(万kWh)',
        value: '14.17',
        icon: 'elec_icon.png'
      },
      {
        title: '电气化占比(%)',
        value: '88.40',
        icon: 'cylinder_45_icon.png'
      },
      {
        title: '总电量实际值/目标值(%)',
        value: '26',
        icon: 'cylinder_45_icon.png'
      },
      {
        title: '综合能耗实际值/目标值(%)',
        value: '30',
        icon: 'cylinder_45_icon.png'
      }
    ]
  },
  // 当前选中日期
  currentDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
});

// 事件定义 日期切换时触发，父级可监听更新数据
const emit = defineEmits(['date-change']);

// 日期切换处理
const handleDateChange = (e) => {
  const selectDate = e.target.value;
  emit('date-change', selectDate);
};
</script>

<style scoped>
/* 科技风日期选择器样式 完全保留原有样式 */
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

/* 核心指标样式 严格匹配设计稿 */
.metric-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 11px;
  color: #F0F2F5;
  line-height: 1.2;
  text-align: center;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: -10px;
}

.metric-value {
  font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
  font-weight: normal;
  font-size: 24px;
  background: linear-gradient(0deg, #32AFFF 0%, #7FCCFE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  text-align: center;
  margin-top: -5px;
  margin-bottom: 10px;
}

.metric-icon {
  width: 100px !important;
  height: 160px !important;
  object-fit: contain;
}
</style>