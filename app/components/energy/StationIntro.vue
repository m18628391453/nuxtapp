<template>
  <div class="bg-[#0A162C]/10 rounded-lg flex flex-col h-full w-full relative overflow-hidden" style="padding: 0.5rem 0rem 1rem 1.5rem;">
    <!-- 标题栏 完全沿用原有组件样式 一字未改 -->
    <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
      <h3 class="text-[14px] font-bold text-white ml-1 leading-none">电站简介</h3>
    </div>
    <!-- 内容区域 仅优化样式 核心功能、数据完全保留 -->
    <div class="flex-1 min-h-0 w-full mt-4 flex flex-col justify-between">
      <!-- 上半部分：电站实景图+核心信息 -->
      <div class="flex items-center gap-2 mb-5">
        <!-- 电站实景图 保留原有路径 新增圆角匹配设计稿 -->
        <img 
          src="/image/pvstation.png" 
          alt="光伏电站实景" 
          class="w-[45%] rounded object-cover shrink-0 -mt-3"
        />
        <!-- 电站核心信息列表 优化换行对齐 解决地址换行跑位问题 -->
        <div class="flex flex-col gap-1 flex-1">
          <p v-for="(item, index) in stationInfo" :key="index" class="flex items-start gap-1 text-[13px]">
            <span class="text-gray-300 shrink-0">{{ item.label }}：</span>
            <span class="text-[#FEFEFE] font-medium flex-1">{{ item.value }}</span>
          </p>
        </div>
      </div>
      <!-- 下半部分：天气预报卡片组 优化等宽布局+半透明背景 -->
      <div class="flex w-full gap-1">
        <div 
          v-for="(weather, index) in weatherList" 
          :key="index"
          class="flex-1 w-full min-w-0 bg-[#0A162C]/50 rounded-lg p-2 flex flex-col items-center justify-center text-center"
        >
          <p class="text-white text-[14px] font-normal mb-2">{{ weather.date }}</p>
          <component :is="weather.icon" class="w-8 h-8 text-[#32AFFF] mb-2" />
          <p class="text-white text-[12px] font-normal mb-1">{{ weather.temp }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 完全保留原有依赖与数据 未做任何修改
import { CloudSun, Cloud, Sun, CloudLightning } from 'lucide-vue-next'

// 电站核心信息 完全沿用原有数据
const stationInfo = [
  { label: '并网容量', value: '100.36MWp' },
  { label: '并网时间', value: '2023年6月30日' },
  { label: '运行天数', value: '685天' },
  { label: '电站地址', value: '湖北省天门市干驿镇干驿镇' },
]

// 天气预报数据 完全沿用原有数据
const weatherList = [
  { date: '今天', icon: CloudSun, temp: '32℃', desc: '多云' },
  { date: '周一', icon: Cloud, temp: '24~32℃', desc: '' },
  { date: '周二', icon: Cloud, temp: '24~32℃', desc: '' },
  { date: '周三', icon: Sun, temp: '26~36℃', desc: '' },
  { date: '周四', icon: CloudLightning, temp: '22~30℃', desc: '' },
]
</script>