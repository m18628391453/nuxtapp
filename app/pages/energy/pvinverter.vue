<template>
  <div class="w-full h-full min-h-screen bg-[#061122] overflow-auto px-4 py-4 font-yahei text-white">
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

    <div class="mb-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A] max-h-[380px] min-h-[360px]">
      <div class="grid grid-cols-8 gap-4 mb-6 mt-2">
        <div 
          v-for="area in areaList" 
          :key="area.id"
          @click="currentAreaId = area.id"
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

    <div class="mt-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A] ">
      <div class="grid grid-cols-8 gap-4 mb-6 mt-2">
        <div 
          v-for="device in deviceList" 
          :key="device.id"
          @click="() => { showInverterModal = true; currentDeviceId = device.id }"
          :class="[
            'relative rounded-[2px] transition-all duration-300 flex flex-col min-h-[160px] cursor-pointer pt-10 pb-3 px-3 border',
            'hover:bg-[#0E2544]',
            device.status === 'normal' ? 'hover:border-[#32AFFFBF]' :
            device.status === 'alarm' ? 'hover:border-[#FF4D4FBF]' :
            device.status === 'warning' ? 'hover:border-[#E4B243BF]' :
            'hover:border-[#888888BF]'
          ]"
          :style="{
            backgroundColor: device.status === 'normal' ? 'rgba(50,175,255,0.06)' :
                             device.status === 'alarm' ? 'rgba(255,77,79,0.1)' :
                             device.status === 'warning' ? 'rgba(228,178,67,0.1)' :
                             'rgba(136,136,136,0.1)',
            borderColor: currentDeviceId === device.id ? (
                           device.status === 'normal' ? '#32AFFF' :
                           device.status === 'alarm' ? '#FF4D4F' :
                           device.status === 'warning' ? '#E4B243' :
                           '#888888'
                         ) : 'rgba(255,255,255,0.06)',
            boxShadow: currentDeviceId === device.id ? (
                         device.status === 'normal' ? '0 0 8px rgba(50,175,255,0.6)' :
                         device.status === 'alarm' ? '0 0 8px rgba(255,77,79,0.6)' :
                         device.status === 'warning' ? '0 0 8px rgba(228,178,67,0.6)' :
                         '0 0 8px rgba(136,136,136,0.6)'
                       ) : 'none'
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
                <svg t="1775716366040" class="w-full h-full" viewBox="0 0 1118 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="35010" fill="currentColor">
                  <path d="M1083.076923 74.486154a12.8 12.8 0 0 0 11.667692-7.532308l22.252308-48.836923A12.8 12.8 0 0 0 1105.329231 0H12.849231A12.8 12.8 0 0 0 1.181538 18.116923l22.252308 48.836923a12.8 12.8 0 0 0 11.667692 7.532308 12.750769 12.750769 0 0 1 12.8 12.8v849.181538a12.8 12.8 0 0 1-12.8 12.8H14.769231a12.750769 12.750769 0 0 0-12.8 12.8v48.836923A12.8 12.8 0 0 0 14.769231 1024h1086.326154a12.849231 12.849231 0 0 0 12.8-12.849231v-48.836923a12.8 12.8 0 0 0-12.8-12.8H1083.076923a12.8 12.8 0 0 1-12.8-12.8V87.286154a12.750769 12.750769 0 0 1 12.8-12.8z m-91.470769 856.615384a12.849231 12.849231 0 0 1-12.8 12.8H139.273846a12.849231 12.849231 0 0 1-12.849231-12.8V91.175385a12.8 12.8 0 0 1 12.849231-12.8h839.532308a12.8 12.8 0 0 1 12.8 12.8z" p-id="35011"></path>
                  <path d="M933.513846 117.710769H577.969231a18.904615 18.904615 0 0 0-18.904616 18.904616v748.8a18.855385 18.855385 0 0 0 18.904616 18.855384h355.544615a18.855385 18.855385 0 0 0 18.855385-18.855384V136.615385a18.904615 18.904615 0 0 0-18.855385-18.904616z m-93.538461 521.846154a18.806154 18.806154 0 0 1-18.855385 18.855385H686.769231a18.855385 18.855385 0 0 1-18.904616-18.855385V384a18.904615 18.904615 0 0 1 18.904616-18.904615h134.350769a18.855385 18.855385 0 0 1 18.855385 18.904615zM500.824615 117.710769H184.664615a18.855385 18.855385 0 0 0-18.855384 18.904616v748.8a18.806154 18.806154 0 0 0 18.855384 18.855384h316.16a18.855385 18.855385 0 0 0 18.904616-18.855384V136.615385a18.904615 18.904615 0 0 0-18.904616-18.904616z m-201.846153 540.553846L343.433846 526.769231l-86.055384-31.507693 63.507692-130.067692h72.664615L343.433846 462.769231l86.055385 18.756923z" p-id="35012"></path>
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
    <InverterDetailModal v-model:visible="showInverterModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InverterDetailModal from '@/components/energy/InverterDetailModal.vue'

definePageMeta({
  layout: 'layout'
})

const currentLayout = ref('card')
const layoutOptions = ref([
  { label: '图标布局', value: 'card' },
  { label: 'table布局', value: 'table' }
])
const showInverterModal = ref(false);

const filterOptions = ref([
  { label: '全部 600', value: 'all', checked: false },
  { label: '正常 25', value: 'normal', checked: true },
  { label: '停机 1', value: 'stop', checked: true },
  { label: '告警 2', value: 'alarm', checked: false },
  { label: '通讯中断 1', value: 'offline', checked: false }
])

// 奶奶写的核心逻辑1：处理勾选框联动
const handleFilterChange = (clickedFilter) => {
  if (clickedFilter.value === 'all') {
    // 如果点的是“全部”
    const newState = !clickedFilter.checked;
    filterOptions.value.forEach(item => {
      item.checked = item.value === 'all' ? newState : false;
    });
  } else {
    // 如果点的是其他选项
    clickedFilter.checked = !clickedFilter.checked;
    // 只要有点选其他，就把“全部”取消勾选
    const allFilter = filterOptions.value.find(item => item.value === 'all');
    if (allFilter) allFilter.checked = false;
  }
}

const currentPage = ref(1)
const currentAreaId = ref(1)
const currentDeviceId = ref(1) 

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
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>