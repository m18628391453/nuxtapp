<template>
  <div class="flex flex-col w-full h-full min-h-screen bg-transparent p-4 box-border overflow-hidden font-yahei text-white">
    
    <div class="flex justify-between items-center mb-4 bg-[#FFFFFF0F] py-2 px-3 rounded-[4px] border border-[#FFFFFF1A] max-h-[56px] shrink-0">
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

    <div class="h-[30%] w-full overflow-x-auto overflow-y-auto rounded-[4px] border border-[#FFFFFF1A] bg-[#0A1A30] shrink-0 mb-4">
      <div class="flex flex-col gap-[0px] w-full min-w-max pb-1 table-container">
        <div 
          v-for="device in deviceList" 
          :key="device.id"
          @click="currentDeviceId = device.id"
          @dblclick="openInverterModal(device.id)"
          class="flex h-[35px] text-[13px] pb-[1px] border-b border-[#FFFFFF1A] hover:border-[#3AB2FFFF] group-hover:bg-[#3AB2FF] transition-colors cursor-pointer group items-center flex-nowrap w-full"
          :class="{ 'border-[#3AB2FF6F]': currentDeviceId === device.id }"
        >
          <div class="w-[180px] flex items-center py-1.5 my-1 pl-5 font-bold text-white shrink-0"
               :class="{
                 'bg-[#1890FF]': device.status === 'normal',
                 'bg-[#FF4D4F]': device.status === 'alarm',
                 'bg-[#E4B243]': device.status === 'warning',
                 'bg-[#888888]': device.status === 'stop'
               }">
            {{ device.name }}
          </div>
          
          <div class="w-[550px] mb-0 mt-0 flex items-center px-6 gap-0 data-column group-hover:bg-[#3AB2FF] bg-transparent transition-colors shrink-0">
            <div class="flex-[1] flex flex-row items-center bg-transparent gap-2">
              <span class="text-[#FFFFFF99] w-[90px]">有功功率(kW)</span>
              <span class="font-bold text-white ml-1 text-right">{{ device.activePower }}</span>
            </div>
            <div class="flex-[1] flex flex-row items-center bg-transparent gap-2">
              <span class="text-[#FFFFFF99] w-[90px]">输入功率(kW)</span>
              <span class="font-bold text-white m-1 text-right">{{ getMockInputPower(device.activePower) }}</span>
            </div>
            <div class="flex-[1] flex flex-row items-center bg-transparent gap-2">
              <span class="text-[#FFFFFF99] w-[90px]">日发电量(kWh)</span>
              <span class="font-bold text-white ml-1 text-right">{{ device.dailyPower }}</span>
            </div>
          </div>
          
          <div class="flex h-full flex-nowrap shrink-0">
            <div 
              v-for="status in tableStatuses" 
              :key="status"
              class="w-[150px] border-l border-[#FFFFFF1A] flex items-center justify-center text-[12px]" style="margin: 1px 2px"
              :class="getTableStatusStyle(device, status)"
            >
              {{ status }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto bg-[#FFFFFF0F] py-3 px-4 rounded-[4px] border border-[#FFFFFF1A] min-h-0">
      <div class="grid grid-cols-8 gap-3 mb-6 mt-2">
        <div 
          v-for="device in deviceList" 
          :key="device.id"
          @click="currentDeviceId = device.id"
          @dblclick="openInverterModal(device.id)"
          :class="[
            'relative rounded-[4px] transition-all duration-200 cursor-pointer min-h-[160px] flex flex-col pt-10 pb-3 px-3 border bg-[#0A1A30]',
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
          <div class="flex gap-3 h-full items-center">
            <div class="flex flex-col items-center justify-center w-[45%]">
              <div class="w-[70px] h-[58px] flex items-center justify-center"
                   :style="{
                     color: device.status === 'normal' ? '#32AFFF' :
                            device.status === 'alarm' ? '#FF4D4F' :
                            device.status === 'warning' ? '#E4B243' :
                            '#888888'
                   }">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                          <mask id="device-mask">
                              <rect x="0" y="0" width="100" height="100" fill="white" />
                              <rect x="20" y="33" width="18" height="5" rx="1" fill="black" />
                              <path d="M55 56 C 58 48, 62 48, 65 56 S 72 64, 75 56" stroke="black" stroke-width="5" stroke-linecap="round" fill="none" />
                          </mask>
                      </defs>
                      <rect x="25" y="13" width="18" height="8" rx="2" fill="currentColor" />
                      <rect x="57" y="13" width="18" height="8" rx="2" fill="currentColor" />
                      <rect x="12" y="23" width="76" height="53" rx="6" fill="currentColor" mask="url(#device-mask)" />
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
    <AreaDetailModal v-model:visible="showAreaModal" :area-id="currentAreaId" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// 如果有引入路径报错，请根据你实际的组件位置调整哈，奶奶这里照搬原页面的
import InverterDetailModal from '@/components/energy/InverterDetailModal.vue'
import AreaDetailModal from '@/components/energy/AreaDetailModal.vue'

definePageMeta({ layout: 'layout' })

const currentLayout = ref('card')
const layoutOptions = ref([
  { label: '图标布局', value: 'card' },
  { label: 'table布局', value: 'table' }
])

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

const currentPage = ref(1)
const currentAreaId = ref(1)
const currentDeviceId = ref(1) 
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

const areaList = ref([
  { id: 1, name: '1#储能区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 0 },
  { id: 2, name: '2#储能区域', dailyPower: '26,671', realTimePower: '2,880', installedCapacity: '1,700', warnCount: 21 },
  // ... 其他如果需要的话自己加，奶奶先按原样带过来
])

const areaOptions = computed(() => {
  return areaList.value.map(area => ({
    value: area.id,
    label: area.name
  }))
})

const tableStatuses = ['通讯故障', '残余电流异常', '系统接地异常', '绝缘阻抗低']

const getMockInputPower = (activePower) => {
  if (!activePower) return '0.000'
  const num = parseFloat(String(activePower).replace(/,/g, ''))
  return (num * 1.015).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

const getTableStatusStyle = (device, statusName) => {
  const normalStyle = 'bg-[#52C41A] text-[#141414] font-medium'
  const stopStyle = 'bg-[#888888] text-white font-medium'
  const errorStyle = 'bg-[#FF4D4F] text-white font-medium'
  if (device.status === 'stop') return stopStyle
  
  if (device.status === 'alarm' && statusName === '通讯故障') return errorStyle
  if (device.status === 'warning' && statusName === '温度过高') return 'bg-[#E4B243] text-white font-medium'
  return normalStyle
}

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
    case 'normal': return '0 0 6px rgba(50,175,255,0.6)';
    case 'alarm': return '0 0 6px rgba(255,77,79,0.6)';
    case 'warning': return '0 0 6px rgba(228,178,67,0.6)';
    default: return '0 0 6px rgba(136,136,136,0.6)';
  }
}

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
  { id: 10, name: 'N19-10', status: 'normal', activePower: '266.805', dailyPower: '503.82', installedCapacity: '76.8', equivalentHours: '2.32' }
])
</script>

<style scoped>
/* 如果你原来的项目里有这句，记得保留，没有的话注释掉就行 */
@import url('../../assets/css/antd.css');

input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  background-color: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.22) !important;
  color: white !important;
  height: 32px !important;
  display: flex;
  align-items: center;
}
:deep(.ant-select-arrow) {
  color: rgba(255, 255, 255, 0.65) !important;
}

/* 修复下拉框弹出时输入框字体变黑问题 */
:deep(.ant-select.ant-select-open .ant-select-selector),
:deep(.ant-select.ant-select-focused .ant-select-selector),
:deep(.ant-select .ant-select-selection-item),
:deep(.ant-select .ant-select-selection-placeholder) {
  color: white !important;
}

/* 表格数据列奇偶行换色 */
.table-container > div:nth-child(odd) {
  background-color: rgba(25, 71, 131, 0.2);
}
.table-container > div:nth-child(even) {
  background-color: rgb(7, 51, 113, 0.2);
}
</style>