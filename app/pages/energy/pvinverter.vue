<template>
  <div class="w-full h-full min-h-screen bg-[#0a1a33] overflow-auto p-6 font-sans text-white">
    <!-- 顶部状态筛选栏 -->
    <div class="flex justify-end items-center gap-6 mb-6">
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" class="w-4 h-4 accent-blue-500" />
        <span>全部 600</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" class="w-4 h-4 accent-blue-500" />
        <span>正常 25</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" class="w-4 h-4 accent-red-500" />
        <span>停机 1</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" class="w-4 h-4 accent-yellow-500" />
        <span>告警 2</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer text-sm">
        <input type="checkbox" class="w-4 h-4 accent-gray-400" />
        <span>通讯中断 1</span>
      </label>
    </div>

    <!-- 区域卡片模块 -->
    <div class="mb-8">
      <div class="grid grid-cols-8 gap-4 mb-6">
        <div 
          v-for="area in areaList" 
          :key="area.id"
          class="relative rounded bg-[#112546] border border-blue-800/50 overflow-hidden"
        >
          <!-- 区域标题栏 -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 font-semibold text-white flex items-center justify-between">
            <span>{{ area.name }}</span>
            <!-- 告警角标 -->
            <span v-if="area.warnCount" class="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ area.warnCount }}
            </span>
          </div>
          <!-- 区域数据 -->
          <div class="p-3 text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-blue-200">日发电量(kWh):</span>
              <span class="font-semibold">{{ area.dailyPower }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-200">实时功率(kW):</span>
              <span class="font-semibold">{{ area.realTimePower }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-200">装机容量(kWp):</span>
              <span class="font-semibold">{{ area.installedCapacity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center items-center gap-3">
        <button 
          v-for="page in [1,2,3]" 
          :key="page"
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-sm',
            currentPage === page ? 'bg-blue-500 text-white font-semibold' : 'bg-transparent text-blue-200 hover:bg-blue-800/50'
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- 逆变器设备卡片模块 -->
    <div class="mt-8">
      <div class="grid grid-cols-8 gap-4">
        <div 
          v-for="device in deviceList" 
          :key="device.id"
          :class="[
            'rounded overflow-hidden border transition-all',
            device.status === 'normal' ? 'bg-[#112546] border-blue-500/70' : '',
            device.status === 'alarm' ? 'bg-[#2a1520] border-red-500' : '',
            device.status === 'warning' ? 'bg-[#2a2518] border-yellow-500' : '',
            device.status === 'stop' ? 'bg-[#1e2530] border-gray-400' : '',
          ]"
        >
          <!-- 设备编号标题 -->
          <div :class="[
            'px-3 py-2 font-semibold text-white',
            device.status === 'normal' ? 'bg-blue-500/80' : '',
            device.status === 'alarm' ? 'bg-red-500' : '',
            device.status === 'warning' ? 'bg-yellow-500' : '',
            device.status === 'stop' ? 'bg-gray-500' : '',
          ]">
            {{ device.name }}
          </div>
          <!-- 设备数据内容 -->
          <div class="p-3 flex gap-3">
            <!-- 逆变器图标 -->
            <div :class="[
              'w-16 h-16 rounded flex items-center justify-center shrink-0',
              device.status === 'normal' ? 'bg-blue-500/20 text-blue-400' : '',
              device.status === 'alarm' ? 'bg-red-500/20 text-red-400' : '',
              device.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : '',
              device.status === 'stop' ? 'bg-gray-500/20 text-gray-400' : '',
            ]">
              <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 4v12h8V6H8zm2 2h4v8h-4V8z" />
                <path d="M9 10h2v4H9v-4zm4 0h2v4h-2v-4z" />
              </svg>
            </div>
            <!-- 数据列表 -->
            <div class="text-sm space-y-1 flex-1">
              <div class="flex justify-between">
                <span class="opacity-80">有功功率</span>
                <span class="font-semibold">{{ device.activePower }} kW</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-80">日发电量</span>
                <span class="font-semibold">{{ device.dailyPower }} kWh</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-80">等效小时数</span>
                <span class="font-semibold">{{ device.equivalentHours }} h</span>
              </div>
            </div>
          </div>
          <!-- 底部装机容量 -->
          <div class="px-3 py-1 text-sm border-t border-white/10">
            <span class="font-semibold">{{ device.installedCapacity }} kWp</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 保留原有页面布局配置
definePageMeta({
  layout: 'layout'
})

// 分页状态 - 匹配设计稿当前选中第2页
const currentPage = ref(2)

// 区域列表数据 - 1:1匹配设计稿内容
const areaList = ref([
  { id: 1, name: '1#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 2, name: '2#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 21 },
  { id: 3, name: '3#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 4, name: '4#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 5, name: '5#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 6, name: '6#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 7, name: '7#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 8, name: '8#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 9, name: '9#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 10, name: '10#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 11, name: '11#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 12, name: '12#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 13, name: '13#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 14, name: '14#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 15, name: '15#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 16, name: '16#区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
])

// 逆变器设备列表数据 - 1:1匹配设计稿状态与数值
const deviceList = ref([
  { id: 1, name: 'N01-01', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 2, name: 'N01-02', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 3, name: 'N01-03', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 4, name: 'N01-04', status: 'alarm', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 5, name: 'N01-05', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 6, name: 'N01-06', status: 'warning', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 7, name: 'N01-07', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 8, name: 'N01-08', status: 'stop', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 9, name: 'N01-09', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 10, name: 'N01-10', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 11, name: 'N01-11', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 12, name: 'N01-12', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 13, name: 'N01-13', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 14, name: 'N01-14', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 15, name: 'N01-15', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 16, name: 'N01-16', status: 'normal', activePower: '3,512', dailyPower: '52,680', installedCapacity: '76.8', equivalentHours: '2.32' },
])
</script>

<style scoped>
/* 适配大屏滚动，保证布局不溢出 */
* {
  box-sizing: border-box;
}
</style>