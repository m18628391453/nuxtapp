<template>
  <div class="w-full h-full min-h-screen bg-transparent overflow-auto px-4 py-4 font-yahei text-white">
    <div class="flex justify-between items-center mb-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A] max-h-[56px]">
      <div class="flex items-center">
        <button
          v-for="layout in layoutOptions"
          :key="layout.value"
          @click="currentLayout = layout.value"
          :class="[
            'w-8 h-7 flex items-center justify-center border transition-all duration-200',
            currentLayout === layout.value 
              ? 'border-[#FFFFFF2A] text-[#32AFFF] bg-[#32AFFF10]' 
              : 'border-[#FFFFFF2A] text-[#FFFFFF99] bg-transparent hover:bg-[#FFFFFF0A]',
            layout.value === 'card' ? 'rounded-l-[2px] border-r-0' : 'rounded-r-[2px]'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <template v-if="layout.value === 'card'">
              <path d="M3 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3zM3 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6z" />
            </template>
            <template v-else>
              <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4zm0 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2zm0 6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z" />
            </template>
          </svg>
        </button>

        <a-select
          v-if="currentLayout === 'table'"
          v-model:value="currentAreaId"
          :options="areaOptions"
          class="ml-4 w-[140px]"
          placeholder="请选择区域"
          :dropdownStyle="{ backgroundColor: '#0A1A30', color: '#fff' }"
        />
      </div>
      <div class="flex items-center gap-6">
        <label 
          v-for="filter in filterOptions" 
          :key="filter.value" 
          class="flex items-center gap-2 cursor-pointer text-sm text-[#FFFFFF99] hover:text-white transition-colors"
        >
          <input 
            type="checkbox" 
            :checked="filter.checked"
            @change="handleFilterChange(filter)"
            class="w-4 h-4 rounded-[2px] bg-transparent border border-[#FFFFFF2A] appearance-none relative flex items-center justify-center transition-colors checked:border-[#32AFFF] checked:bg-transparent
            after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:flex after:items-center after:justify-center
            checked:after:content-['✓'] checked:after:text-[12px] checked:after:font-bold checked:after:text-[#32AFFF]"
          />
          <span>{{ filter.label }}</span>
        </label>
      </div>
    </div>

    <div v-show="currentLayout === 'card'" class="mb-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A] max-h-[380px] min-h-[360px]">
      <div class="grid grid-cols-8 gap-4 mb-6 mt-2">
        <div 
          v-for="area in areaList" 
          :key="area.id"
          @click="currentAreaId = area.id"
          @dblclick="openAreaModal(area.id)"
          :class="[
            'relative rounded-[2px] px-3 pb-3 pt-[42px] transition-all duration-200 cursor-pointer min-h-[135px] flex flex-col justify-end',
            'bg-[#0A1A30] border',
            currentAreaId === area.id ? 'border-[#3AB2FF6F]' : 'border-[#FFFFFF0F]',
            'hover:border-[#3AB2FF3F] hover:bg-[#0E2544]'
          ]"
          :style="{
            backgroundColor: 'rgba(50,175,255,0.1)',
            boxShadow: currentAreaId === area.id ? '0 0 4px rgba(50,175,255,0.8)' : '',
          }"
        >
          <div class="absolute top-2 left-0 h-[28px] pl-3 pr-6 flex items-center justify-start z-10"
               style="background: linear-gradient(90deg, #19ADD8 0%, #0E9ED3 50%, #4FB2E5 100%); clip-path: polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%);">
            <span class="font-bold text-[14px] text-white tracking-wide">
              {{ area.name }}
            </span>
          </div>
          
          <span v-if="area.warnCount" class="absolute top-1 right-2 bg-[#FF4B4B] text-white text-[12px] font-bold rounded-full w-[22px] h-[22px] flex items-center justify-center z-10 shadow-md">
            {{ area.warnCount }}
          </span>
          <div class="text-[13px] w-full flex flex-col gap-[6px]">
            <div class="flex justify-between items-center w-full">
              <span class="text-[#FFFFFF99]">日发电量(kWh):</span>
              <span class="font-bold text-white text-[14px]">{{ area.dailyPower }}</span>
            </div>
            <div class="flex justify-between items-center w-full">
              <span class="text-[#FFFFFF99]">实时功率(kW):</span>
              <span class="font-bold text-white text-[14px]">{{ area.realTimePower }}</span>
            </div>
            <div class="flex justify-between items-center w-full">
              <span class="text-[#FFFFFF99]">装机容量(kWp):</span>
              <span class="font-bold text-white text-[14px]">{{ area.installedCapacity }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center items-center gap-3 -mt-2">
        <button 
          v-for="page in [1,2,3]" 
          :key="page"
          :class="[
            'w-7 h-7 rounded-full flex items-center justify-center text-sm border transition-all',
            currentPage === page 
              ? 'bg-[#32AFFF] text-white border-[#32AFFF] font-bold shadow-[0_0_8px_rgba(50,175,255,0.5)]' 
              : 'bg-transparent text-white border-[#FFFFFF33] hover:border-[#32AFFF] hover:text-[#32AFFF]'
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <div v-show="currentLayout === 'card'" class="mt-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A]">
      <div class="grid grid-cols-8 gap-4 mb-6 mt-2">
        <div 
          v-for="device in deviceList" 
          :key="device.id"
          @click="currentDeviceId = device.id"
          @dblclick="openInverterModal(device.id)"
          :class="[
            'relative rounded-[2px] transition-all duration-200 cursor-pointer min-h-[160px] flex flex-col pt-10 pb-3 px-3 border bg-[#0A1A30]',
            currentDeviceId === device.id ? getDeviceActiveBorderClass(device.status) : 'border-[#FFFFFF0F]',
            getDeviceHoverClass(device.status)
          ]"
          :style="{
            backgroundColor: getDeviceBgColor(device.status),
            boxShadow: currentDeviceId === device.id ? getDeviceActiveShadow(device.status) : 'none'
          }"
        >
          <div class="absolute top-2 left-0 px-3 py-1 text-[13px] font-bold text-white z-10 rounded-br-[4px] rounded-tr-[4px]"
               :style="{
                 background: device.status === 'normal' ? '#32AFFF' :
                             device.status === 'alarm' ? 'linear-gradient(45deg, #FF4D4F, #FD6365)' :
                             device.status === 'warning' ? 'linear-gradient(45deg, #E4B243, #FDCF68)' :
                             'linear-gradient(45deg, #888888, #999999)'
               }">
            {{ device.name }}
          </div>
          <div class="flex gap-2 h-full items-center">
            <div class="flex flex-col items-center justify-center w-[45%]">
              <div class="w-[68px] h-[55px] flex items-center justify-center"
                   :style="{
                     color: device.status === 'normal' ? '#32AFFF' :
                            device.status === 'alarm' ? '#FF4D4F' :
                            device.status === 'warning' ? '#E4B243' :
                            '#888888'
                   }">
                <svg t="1775716366040" class="w-full h-full" viewBox="0 0 1118 1024" fill="currentColor">
                  <path d="M1083.076923 74.486154a12.8 12.8 0 0 0 11.667692-7.532308l22.252308-48.836923A12.8 12.8 0 0 0 1105.329231 0H12.849231A12.8 12.8 0 0 0 1.181538 18.116923l22.252308 48.836923a12.8 12.8 0 0 0 11.667692 7.532308 12.750769 12.750769 0 0 1 12.8 12.8v849.181538a12.8 12.8 0 0 1-12.8 12.8H14.769231a12.750769 12.750769 0 0 0-12.8 12.8v48.836923A12.8 12.8 0 0 0 14.769231 1024h1086.326154a12.849231 12.849231 0 0 0 12.8-12.849231v-48.836923a12.8 12.8 0 0 0-12.8-12.8H1083.076923a12.8 12.8 0 0 1-12.8-12.8V87.286154a12.750769 12.750769 0 0 1 12.8-12.8z m-91.470769 856.615384a12.849231 12.849231 0 0 1-12.8 12.8H139.273846a12.849231 12.849231 0 0 1-12.849231-12.8V91.175385a12.8 12.8 0 0 1 12.849231-12.8h839.532308a12.8 12.8 0 0 1 12.8 12.8z" />
                  <path d="M933.513846 117.710769H577.969231a18.904615 18.904615 0 0 0-18.904616 18.904616v748.8a18.855385 18.855385 0 0 0 18.904616 18.855384h355.544615a18.855385 18.855385 0 0 0 18.855385-18.855384V136.615385a18.904615 18.904615 0 0 0-18.855385-18.904616z m-93.538461 521.846154a18.806154 18.806154 0 0 1-18.855385 18.855385H686.769231a18.855385 18.855385 0 0 1-18.904616-18.855385V384a18.904615 18.904615 0 0 1 18.904616-18.904615h134.350769a18.855385 18.855385 0 0 1 18.855385 18.904615zM500.824615 117.710769H184.664615a18.855385 18.855385 0 0 0-18.855384 18.904616v748.8a18.806154 18.806154 0 0 0 18.855384 18.855384h316.16a18.855385 18.855385 0 0 0 18.904616-18.855384V136.615385a18.904615 18.904615 0 0 0-18.904616-18.904616z m-201.846153 540.553846L343.433846 526.769231l-86.055384-31.507693 63.507692-130.067692h72.664615L343.433846 462.769231l86.055385 18.756923z" />
                </svg>
              </div>
              
              <div class="mt-2 flex items-baseline"
                   :style="{
                     color: device.status === 'normal' ? '#32AFFF' :
                            device.status === 'alarm' ? '#FF4D4F' :
                            device.status === 'warning' ? '#E4B243' :
                            '#888888'
                   }">
                <span class="font-bold text-[15px]">{{ device.installedCapacity }}</span>
                <span class="text-[12px] ml-[2px]">kWp</span>
              </div>
            </div>
            <div class="flex flex-col justify-center w-[55%] text-[12px] space-y-[6px]">
              <div class="flex flex-col">
                <span class="text-[#FFFFFF99] leading-tight mb-1">有功功率</span>
                <div class="flex items-baseline"
                     :style="{
                       color: device.status === 'normal' ? '#32AFFF' :
                              device.status === 'alarm' ? '#FF4D4F' :
                              device.status === 'warning' ? '#E4B243' :
                              '#888888'
                     }">
                  <span class="font-bold text-[15px]">{{ device.activePower }}</span>
                  <span class="text-[#FFFFFF99] scale-90 ml-1">kW</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-[#FFFFFF99] leading-tight mb-1">日发电量</span>
                <div class="flex items-baseline"
                     :style="{
                       color: device.status === 'normal' ? '#32AFFF' :
                              device.status === 'alarm' ? '#FF4D4F' :
                              device.status === 'warning' ? '#E4B243' :
                              '#888888'
                     }">
                  <span class="font-bold text-[13px]">{{ device.dailyPower }}</span>
                  <span class="text-[#FFFFFF99] scale-90 ml-1">kWh</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-[#FFFFFF99] leading-tight mb-1">等效小时数</span>
                <div class="flex items-baseline"
                     :style="{
                       color: device.status === 'normal' ? '#32AFFF' :
                              device.status === 'alarm' ? '#FF4D4F' :
                              device.status === 'warning' ? '#E4B243' :
                              '#888888'
                     }">
                  <span class="font-bold text-[13px]">{{ device.equivalentHours }}</span>
                  <span class="text-[#FFFFFF99] scale-90 ml-1">h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentLayout === 'table'" class="flex flex-col gap-[2px] overflow-y-auto overflow-x-hidden max-h-[calc(100vh-120px)] pb-4">
      <div 
        v-for="device in deviceList" 
        :key="device.id"
        @click="currentDeviceId = device.id"
        @dblclick="openInverterModal(device.id)"
        class="flex h-[42px] text-[13px] border border-[#FFFFFF1A] bg-[#0A1A30] hover:border-[#3AB2FF6F] transition-colors cursor-pointer group"
        :class="{ 'border-[#3AB2FF6F] shadow-[0_0_6px_rgba(50,175,255,0.4)]': currentDeviceId === device.id }"
      >
        <div class="w-[120px] flex items-center pl-5 font-bold text-white shrink-0"
             :class="{
               'bg-[#1890FF]': device.status === 'normal',
               'bg-[#FF4D4F]': device.status === 'alarm',
               'bg-[#E4B243]': device.status === 'warning',
               'bg-[#888888]': device.status === 'stop'
             }">
          {{ device.name }}
        </div>
        
        <div class="flex-1 flex items-center px-6 gap-10 bg-[#0B2240] group-hover:bg-[#0E2544] transition-colors shrink-0">
          <div class="flex items-center gap-2">
            <span class="text-[#FFFFFF99]">有功功率(kW)</span>
            <span class="font-bold text-white">{{ device.activePower }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#FFFFFF99]">输入功率(kW)</span>
            <span class="font-bold text-white">{{ getMockInputPower(device.activePower) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#FFFFFF99]">日发电量(kWh)</span>
            <span class="font-bold text-white">{{ device.dailyPower }}</span>
          </div>
        </div>

        <div class="flex h-full shrink-0">
          <div 
            v-for="status in tableStatuses" 
            :key="status"
            class="w-[110px] border-l border-[#FFFFFF1A] flex items-center justify-center text-[12px]"
            :class="getTableStatusStyle(device, status)"
          >
            {{ status }}
          </div>
        </div>
      </div>
    </div>

    <InverterDetailModal v-model:visible="showInverterModal" />
    <AreaDetailModal v-model:visible="showAreaModal" :area-id="currentAreaId" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InverterDetailModal from '@/components/energy/InverterDetailModal.vue'
import AreaDetailModal from '@/components/energy/AreaDetailModal.vue'

definePageMeta({ layout: 'layout' })

// 布局切换
const currentLayout = ref('card')
const layoutOptions = ref([
  { label: '图标布局', value: 'card' },
  { label: 'table布局', value: 'table' }
])

// 筛选
const filterOptions = ref([
  { label: '全部 600', value: 'all', checked: false },
  { label: '正常 25', value: 'normal', checked: true },
  { label: '停机 1', value: 'stop', checked: true },
  { label: '告警 2', value: 'alarm', checked: false },
  { label: '通讯中断 1', value: 'offline', checked: false }
])

const handleFilterChange = (clickedFilter) => {
  if (clickedFilter.value === 'all') {
    const isChecked = !clickedFilter.checked;
    filterOptions.value.forEach(item => {
      item.checked = item.value === 'all' ? isChecked : false;
    });
  } else {
    clickedFilter.checked = !clickedFilter.checked;
    const allFilter = filterOptions.value.find(item => item.value === 'all');
    if (allFilter) allFilter.checked = false;
  }
}

// 分页与选中
const currentPage = ref(1)
const currentAreaId = ref(1)
const currentDeviceId = ref(1) 

// 弹窗控制
const showInverterModal = ref(false)
const showAreaModal = ref(false)

const openInverterModal = (id) => {
  currentDeviceId.value = id
  showInverterModal.value = true
}

const openAreaModal = (id) => {
  currentAreaId.value = id
  showAreaModal.value = true
}

// ================== 新增代码区 ====================

// 把区域数据映射为 Ant Design Select 的 options
const areaOptions = computed(() => {
  return areaList.value.map(area => ({
    value: area.id,
    label: area.name
  }))
})

// 列表模式的状态栏标题
const tableStatuses = ['通讯故障', '残余电流异常', '系统接地异常', '绝缘阻抗低', '温度过高', '设备异常']

// 模拟“输入功率”（因为原数据里没有，为了UI饱满奶奶给你算一个）
const getMockInputPower = (activePower) => {
  if (!activePower) return '0.000'
  const num = parseFloat(String(activePower).replace(/,/g, ''))
  return (num * 1.015).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

// 控制列表模式下的状态块样式
const getTableStatusStyle = (device, statusName) => {
  // 奶奶特意比对了你的设计图，正常情况是绿底黑字
  const normalStyle = 'bg-[#52C41A] text-[#141414] font-medium'
  const stopStyle = 'bg-[#888888] text-white font-medium'
  const errorStyle = 'bg-[#FF4D4F] text-white font-medium'

  if (device.status === 'stop') return stopStyle
  
  // 模拟异常亮红逻辑 (仅为演示)
  if (device.status === 'alarm' && statusName === '通讯故障') return errorStyle
  if (device.status === 'warning' && statusName === '温度过高') return 'bg-[#E4B243] text-white font-medium'

  return normalStyle
}

// ==================================================

// 设备样式 (原有逻辑完好保留)
const getDeviceActiveBorderClass = (status) => {
  switch(status) {
    case 'normal': return 'border-[#3AB2FF6F]';
    case 'alarm': return 'border-[#FF4D4F6F]';
    case 'warning': return 'border-[#E4B2436F]';
    default: return 'border-[#8888886F]';
  }
}

const getDeviceHoverClass = (status) => {
  switch(status) {
    case 'normal': return 'hover:border-[#3AB2FF3F] hover:bg-[#0E2544]';
    case 'alarm': return 'hover:border-[#FF4D4F3F] hover:bg-[#0E2544]';
    case 'warning': return 'hover:border-[#E4B2433F] hover:bg-[#0E2544]';
    default: return 'hover:border-[#8888883F] hover:bg-[#0E2544]';
  }
}

const getDeviceBgColor = (status) => {
  switch(status) {
    case 'normal': return 'rgba(50,175,255,0.06)'
    case 'alarm': return 'rgba(255,77,79,0.1)'
    case 'warning': return 'rgba(228,178,67,0.1)'
    default: return 'rgba(136,136,136,0.1)'
  }
}

const getDeviceActiveShadow = (status) => {
  switch(status) {
    case 'normal': return '0 0 8px rgba(50,175,255,0.6)';
    case 'alarm': return '0 0 8px rgba(255,77,79,0.6)';
    case 'warning': return '0 0 8px rgba(228,178,67,0.6)';
    default: return '0 0 8px rgba(136,136,136,0.6)';
  }
}

// 区域数据
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

const deviceList = ref([
  { id: 1, name: 'N25-6', status: 'normal', activePower: '165.984', dailyPower: '314.12', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 2, name: 'N20-12', status: 'normal', activePower: '285.835', dailyPower: '544.53', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 3, name: 'N9-13', status: 'normal', activePower: '207.361', dailyPower: '394.16', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 4, name: 'N54-14', status: 'alarm', activePower: '280.019', dailyPower: '522.41', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 5, name: 'N14-6', status: 'normal', activePower: '238.131', dailyPower: '447.71', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 6, name: 'N20-9', status: 'warning', activePower: '284.212', dailyPower: '529.23', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 7, name: 'N48-13', status: 'normal', activePower: '285.288', dailyPower: '529.74', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 8, name: 'N19-8', status: 'stop', activePower: '266.577', dailyPower: '505.69', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 9, name: 'N42-2', status: 'normal', activePower: '284.256', dailyPower: '526.52', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 10, name: 'N19-10', status: 'normal', activePower: '266.805', dailyPower: '503.82', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 11, name: 'N48-15', status: 'normal', activePower: '283.756', dailyPower: '526.76', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 12, name: 'N14-15', status: 'normal', activePower: '271.366', dailyPower: '499.98', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 13, name: 'N19-12', status: 'normal', activePower: '275.496', dailyPower: '503.13', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 14, name: 'N20-8', status: 'normal', activePower: '270.932', dailyPower: '500.13', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 15, name: 'N42-15', status: 'normal', activePower: '268.593', dailyPower: '498.34', installedCapacity: '76.8', equivalentHours: '2.32' },
  { id: 16, name: 'N19-3', status: 'normal', activePower: '267.698', dailyPower: '496.77', installedCapacity: '76.8', equivalentHours: '2.32' },
])
</script>

<style scoped>
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* 覆盖 Ant Design 下拉框部分默认样式，避免在暗黑模式下边框太突兀 */
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}
:deep(.ant-select-arrow) {
  color: rgba(255, 255, 255, 0.6) !important;
}
</style>