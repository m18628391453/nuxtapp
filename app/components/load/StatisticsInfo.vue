<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
      <!-- 顶部标题栏（带左侧蓝线+渐变背景） -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-4">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-1 leading-none">{{ title }}</h3>
      </div>
  
      <!-- 中间告警指标栏（横向三列+中间深两侧浅渐变背景） -->
      <div 
        class="flex justify-around items-center py-3 px-4 rounded-lg mb-4"
        style="background: linear-gradient(90deg, transparent 0%, #0D1B35 50%, transparent 100%)"
      >
        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-1">告警总计</span>
          <span class="text-cyan-400 font-bold text-2xl">{{ alertData.total }}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-1">已处理</span>
          <span class="text-emerald-400 font-bold text-2xl">{{ alertData.handled }}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-400 text-sm mb-1">待处理</span>
          <span class="text-yellow-400 font-bold text-2xl">{{ alertData.pending }}</span>
        </div>
      </div>
  
      <!-- 底部总览区域（左右分栏+渐变分割线） -->
      <div class="flex gap-4 flex-1">
        <!-- 左侧设备总览 -->
        <div class="flex-1 bg-[#0D1B35]/50 rounded-lg p-3 flex flex-col">
          <h4 class="text-gray-300 text-xs font-medium mb-2">{{ deviceOverview.title }}</h4>
          <!-- 标题下渐变分割线（中间蓝两边透明） -->
          <div 
            class="h-[1px] w-full mb-3"
            style="background: linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)"
          ></div>
          <div class="space-y-2 flex-1 flex flex-col justify-around">
            <div v-for="(item, index) in deviceOverview.items" :key="index" class="flex justify-between text-xs">
              <span class="text-gray-400 flex items-center">
                <span class="w-2 h-2 bg-cyan-400 rotate-45 mr-2"></span>
                {{ item.label }}
              </span>
              <span class="text-white font-medium">{{ item.value }}</span>
            </div>
          </div>
        </div>
  
        <!-- 右侧区域总览 -->
        <div class="flex-1 bg-[#0D1B35]/50 rounded-lg p-3 flex flex-col">
          <h4 class="text-gray-300 text-xs font-medium mb-2">{{ areaOverview.title }}</h4>
          <!-- 标题下渐变分割线（和左侧一致） -->
          <div 
            class="h-[1px] w-full mb-3"
            style="background: linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)"
          ></div>
          <div class="space-y-2 flex-1 flex flex-col justify-around">
            <div v-for="(item, index) in areaOverview.items" :key="index" class="flex justify-between text-xs">
              <span class="text-gray-400 flex items-center">
                <span class="w-2 h-2 bg-cyan-400 rotate-45 mr-2"></span>
                {{ item.label }}
              </span>
              <span class="text-white font-medium">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 完全可配置的props，默认值和设计稿完全一致
  const props = defineProps({
    title: {
      type: String,
      default: '统计信息'
    },
    alertData: {
      type: Object,
      default: () => ({
        total: 126,
        handled: 100,
        pending: 26
      })
    },
    deviceOverview: {
      type: Object,
      default: () => ({
        title: '设备总览',
        items: [
          { label: '设备总计(个)', value: 50 },
          { label: '运行设备(个)', value: 38 },
          { label: '总功率占比(%)', value: 80 }
        ]
      })
    },
    areaOverview: {
      type: Object,
      default: () => ({
        title: '区域总览',
        items: [
          { label: '区域总计(个)', value: 30 },
          { label: '运行区域(个)', value: 21 },
          { label: '总功率占比(%)', value: 86 }
        ]
      })
    }
  })
  </script>
  
  <style scoped>
  /* 确保菱形图标和设计稿完全一致 */
  .rotate-45 {
    transform: rotate(45deg);
  }
  </style>