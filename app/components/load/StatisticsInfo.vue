<template>
    <!-- 整体卡片渐变背景（设计稿最外层的深蓝色渐变） -->
    <div 
      class="rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden"
      style="background: linear-gradient(180deg, rgba(10, 22, 44, 0.8) 0%, rgba(13, 27, 53, 0.6) 100%); backdrop-filter: blur(10px);"
    >
      <!-- 顶部标题栏（带左侧蓝线+渐变背景+发光） -->
      <div 
        class="w-full flex items-center py-3.5 px-4 relative -ml-1 -mr-4 mb-4"
        style="background: linear-gradient(90deg, rgba(15, 52, 96, 0.9) 0%, transparent 100%);"
      >
        <div 
          class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"
          style="box-shadow: 0 0 12px rgba(34, 211, 238, 0.3);"
        ></div>
        <h3 class="text-[16px] font-bold text-white ml-1 leading-none">{{ title }}</h3>
      </div>
  
      <!-- 中间告警指标栏（文字数字同行+中间深两侧浅渐变背景） -->
      <div 
        class="flex justify-around items-center py-3 px-2 rounded-lg mb-4 bg-gradient-to-r from-transparent via-[#0F3363]/50 to-transparent "
        style="backdrop-filter: blur(10px);"
      >
        <div class="flex items-center gap-2">
          <span class="text-gray-300 text-[14px]">告警总计</span>
          <span class="text-cyan-400 font-bold text-[14px]">{{ alertData.total }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-300 text-[14px]">已处理</span>
          <span class="text-emerald-400 font-bold text-[14px]">{{ alertData.handled }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-300 text-[14px]">待处理</span>
          <span class="text-yellow-400 font-bold text-[14px]">{{ alertData.pending }}</span>
        </div>
      </div>
  
      <!-- 底部总览区域（左右分栏+各自渐变背景） -->
      <div class="flex gap-8 flex-1 px-2">
        <!-- 左侧设备总览（深色渐变背景） -->
        <div 
          class="flex-1 py-4 px-3 flex flex-col h-[95%]"
          style="background: linear-gradient(90deg, #0F336390 0%, rgba(0,0,0, 0) 100%);"
        >
          <h4 class="text-gray-300 text-sm font-medium mb-2">{{ deviceOverview.title }}</h4>
          <!-- 标题下渐变分割线（中间亮两边透明） -->
          <div 
            class="h-[1px] w-[60%] -ml-[7.5%]"
            style="background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.8) 50%, transparent 100%);"
          ></div>
          <div class="space-y-3 flex-1 flex flex-col justify-around mt-3">
            <div v-for="(item, index) in areaOverview.items" :key="index" class="flex justify-between text-sm">
              <span class="flex items-center text-[12px] text-gray-300">
                <span 
                  class="w-2 h-2 bg-cyan-400 rotate-45 mr-2"
                  style="box-shadow: 0 0 6px rgba(34, 211, 238, 0.5);"
                ></span>
                {{ item.label }}
              </span>
              <span class="text-cyan-400 font-medium text-[14px]">{{ item.value }}</span>
            </div>
          </div>
        </div>
  
        <!-- 右侧区域总览（稍浅渐变背景） -->
        <div 
          class="flex-1 py-4 px-3 flex flex-col h-[95%]"
          style="background: linear-gradient(90deg, #0F336390 0%, rgba(0, 0, 0, 0) 100%);"
        >
          <h4 class="text-gray-300 text-sm font-medium mb-2">{{ areaOverview.title }}</h4>
          <!-- 标题下渐变分割线（和左侧完全一致） -->
          <div 
            class="h-[1px] w-[60%] -ml-[7.5%]"
            style="background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.8) 50%, transparent 100%);"
          ></div>
          <div class="space-y-3 flex-1 flex flex-col justify-around mt-3">
            <div v-for="(item, index) in areaOverview.items" :key="index" class="flex justify-between text-sm">
              <span class="flex items-center text-[12px] text-gray-300">
                <span 
                  class="w-2 h-2 bg-cyan-400 rotate-45 mr-2"
                  style="box-shadow: 0 0 6px rgba(34, 211, 238, 0.5);"
                ></span>
                {{ item.label }}
              </span>
              <span class="text-cyan-400 font-medium text-[14px]">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 完全可配置，默认值和设计稿100%匹配
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
  .rotate-45 {
    transform: rotate(45deg);
  }
  </style>