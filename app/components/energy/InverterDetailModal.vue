<template>
    <Teleport to="body">
      <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center font-sans">
        <div class="absolute inset-0 bg-[#000000CC]" @click="closeModal"></div>
        <div class="relative w-[960px] bg-[#032748] border border-[#0327489F] rounded shadow-2xl flex flex-col text-white transform transition-all">
          
          <div class="flex items-center justify-between px-6 py-1.5">
            <div class="flex items-center text-[14px] font-normal">
              <span class="text-[#FFFFFF] mr-1">1#区域</span><span>/</span>
              <a-select
                v-model:value="selectedInverter"
                :bordered="false"
                class="custom-dark-select top-select"
                style="width: 160px; font-size: 14px;"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option value="N01-01">N01-01组串式逆变器</a-select-option>
                <a-select-option value="N01-02">N01-02组串式逆变器</a-select-option>
              </a-select>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors -mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div class="w-full h-px bg-[#D9D9D92A]"></div>
  
          <div class="flex items-center gap-3 px-6 py-4">
            <button 
              v-for="tab in tabs" 
              :key="tab.key"
              @click="activeTab = tab.key"
              class="relative flex items-center px-3 py-1.5 rounded text-sm transition-all duration-200"
              :class="activeTab === tab.key ? 'bg-[#32AFFF] text-white font-medium' : 'text-gray-400 hover:text-gray-200'"
            >
              {{ tab.label }}
              <span 
                v-if="tab.count > 0" 
                class="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none absolute -top-1 -right-1"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>
  
          <div class="px-10 py-6 flex items-center justify-between relative">
            <div class="flex flex-col items-center gap-2 z-10 w-[120px]">
              <div class="flex items-center justify-center p-1" style="width: 70px;height: 58px;">
                <svg viewBox="0 0 1274 1024" width="100%" height="100%"><path d="M1267.854471 588.537657l-106.936182-472.662366A163.069349 163.069349 0 0 0 1013.839397 0H270.22762a171.786369 171.786369 0 0 0-152.131432 112.044244v3.164778c0 3.2203-85.33796 347.015128-110.156482 473.051022a178.504582 178.504582 0 0 0 19.099713 147.078892A164.401887 164.401887 0 0 0 140.360679 799.522854h994.40655a153.297403 153.297403 0 0 0 112.710513-67.515263 203.489671 203.489671 0 0 0 20.987475-147.023369v3.553435z m-1127.105135 140.083066a95.720653 95.720653 0 0 1-61.740932-35.034647 107.713496 107.713496 0 0 1-7.606571-88.502738C97.71946 487.042672 174.729057 170.009651 183.223987 135.585751A98.219162 98.219162 0 0 1 270.893889 69.403026h743.556255a89.890799 89.890799 0 0 1 80.229897 64.294962l106.936182 470.496991a130.921867 130.921867 0 0 1-11.437619 89.113485 81.284824 81.284824 0 0 1-63.073469 35.034647z m544.11972 202.434745l212.65087 43.918235v49.026297h-515.248061V977.1946l204.988776-45.86152v-92.22274h98.052594zM227.641924 130.53321l55.52242-35.645393h288.716586l41.364204 36.922409v162.958304l-44.417937 44.417936H228.197148l-36.92241-49.026297L227.641924 130.53321z m-64.294963 294.268829L227.641924 368.613349h336.799002l49.026297 56.022122v204.988777l-52.246597 49.026297H163.291438l-42.696741-56.022122 42.696741-198.603698z m888.747384-294.268829l28.649569 160.404273-36.92241 49.026297h-342.573334l-44.417936-42.641219v-166.567261l43.307488-35.645394h296.489725z m56.632869 294.268829l42.696741 198.65922-42.696741 56.022122H710.686982l-52.191076-49.026297V424.024725l49.026298-56.022122h336.854524z" fill="#1890FF"></path></svg>
              </div>
              <span class="text-xs text-gray-300 border border-gray-600/50 px-3 py-1 rounded">组串</span>
            </div>
  
            <div class="flex-1 h-[1px] bg-[#1C3E73] relative overflow-hidden mx-2 -mt-8">
              <div class="absolute top-0 left-0 h-full w-[100px] bg-gradient-to-r from-transparent via-[#32AFFF] to-transparent animate-moving-light"></div>
            </div>
  
            <div class="flex flex-col items-center gap-2 z-10 w-[160px]">
              <div class="flex items-center justify-center p-2" style="width: 84px;height: 64px;">
                <svg viewBox="0 0 1118 1024" width="100%" height="100%"><path d="M1083.076923 74.486154a12.8 12.8 0 0 0 11.667692-7.532308l22.252308-48.836923A12.8 12.8 0 0 0 1105.329231 0H12.849231A12.8 12.8 0 0 0 1.181538 18.116923l22.252308 48.836923a12.8 12.8 0 0 0 11.667692 7.532308 12.750769 12.750769 0 0 1 12.8 12.8v849.181538a12.8 12.8 0 0 1-12.8 12.8H14.769231a12.750769 12.750769 0 0 0-12.8 12.8v48.836923A12.8 12.8 0 0 0 14.769231 1024h1086.326154a12.849231 12.849231 0 0 0 12.8-12.849231v-48.836923a12.8 12.8 0 0 0-12.8-12.8H1083.076923a12.8 12.8 0 0 1-12.8-12.8V87.286154a12.750769 12.750769 0 0 1 12.8-12.8z m-91.470769 856.615384a12.849231 12.849231 0 0 1-12.8 12.8H139.273846a12.849231 12.849231 0 0 1-12.849231-12.8V91.175385a12.8 12.8 0 0 1 12.849231-12.8h839.532308a12.8 12.8 0 0 1 12.8 12.8z" fill="#1890FF"></path><path d="M933.513846 117.710769H577.969231a18.904615 18.904615 0 0 0-18.904616 18.904616v748.8a18.855385 18.855385 0 0 0 18.904616 18.855384h355.544615a18.855385 18.855385 0 0 0 18.855385-18.855384V136.615385a18.904615 18.904615 0 0 0-18.855385-18.904616z m-93.538461 521.846154a18.806154 18.806154 0 0 1-18.855385 18.855385H686.769231a18.855385 18.855385 0 0 1-18.904616-18.855385V384a18.904615 18.904615 0 0 1 18.904616-18.904615h134.350769a18.855385 18.855385 0 0 1 18.855385 18.904615zM500.824615 117.710769H184.664615a18.855385 18.855385 0 0 0-18.855384 18.904616v748.8a18.806154 18.806154 0 0 0 18.855384 18.855384h316.16a18.855385 18.855385 0 0 0 18.904616-18.855384V136.615385a18.904615 18.904615 0 0 0-18.904616-18.904616z m-201.846153 540.553846L343.433846 526.769231l-86.055384-31.507693 63.507692-130.067692h72.664615L343.433846 462.769231l86.055385 18.756923z" fill="#1890FF"></path></svg>
              </div>
              <div class="border border-gray-600/50 rounded">
                 <a-select 
                  v-model:value="selectedInverter" 
                  :bordered="false" 
                  size="small" 
                  class="custom-dark-select" 
                  style="width: 140px;"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                >
                  <a-select-option value="N01-01">N01-01组串逆变器</a-select-option>
                  <a-select-option value="N01-02">N01-02组串逆变器</a-select-option>
                 </a-select>
              </div>
            </div>
  
            <div class="flex-1 h-[2px] bg-[#1C3E73] relative overflow-hidden mx-2 -mt-8">
              <div class="absolute top-0 left-0 h-full w-[100px] bg-gradient-to-r from-transparent via-[#32AFFF] to-transparent animate-moving-light" style="animation-delay: 0.5s;"></div>
            </div>
  
            <div class="flex flex-col items-center gap-2 z-10 w-[120px]">
              <div class="flex items-center justify-center p-1" style="width: 70px;height: 58px;">
                <svg viewBox="0 0 1031 1024" width="100%" height="100%"><path d="M1017.995821 91.333706L817.134843 2.092484a24.106956 24.106956 0 0 0-9.915691-2.092302h-586.754215a25.062137 25.062137 0 0 0-10.006661 2.183271L14.14578 91.197252 13.645447 91.424676a24.33438 24.33438 0 0 0-13.645447 21.78723V245.618226a49.260063 49.260063 0 0 0 49.260063 49.078124h933.439536a49.260063 49.260063 0 0 0 49.260063-49.260064v-131.905986a24.106956 24.106956 0 0 0-13.963841-22.196594zM914.24494 350.233318H120.62575a49.260063 49.260063 0 0 0-49.260063 49.442003V974.739937a49.260063 49.260063 0 0 0 49.260063 49.260063H914.24494a49.260063 49.260063 0 0 0 49.260064-49.260063H120.62575a49.260063 49.260063 0 0 0-49.260063 49.442003V974.739937a49.260063 49.260063 0 0 0 49.260063 49.260063H914.24494a49.260063 49.260063 0 0 0 49.260064-49.260063V399.675321A49.260063 49.260063 0 0 0 914.24494 350.233318zM455.621471 862.392424l61.813874-157.377487-119.352175-37.661433 88.058617-155.42164H586.754215l-69.500809 116.986964 119.534115 22.469503z" fill="#1890FF"></path></svg>
              </div>
              <span class="text-xs text-gray-300 border border-gray-600/50 px-3 py-1 rounded">箱变</span>
            </div>
          </div>
  
          <div class="flex px-6 pb-6 gap-8 h-[420px] overflow-hidden">
            
            <div v-if="activeTab === 'telemetry'" class="flex-1 flex w-full gap-8">
              <div class="flex-1 flex flex-col">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-1 h-3.5 bg-[#32AFFF]"></div>
                    <span class="text-[15px] font-medium">遥测</span>
                  </div>
                  <span class="text-xs text-gray-500">2026-03-12 16:12:23</span>
                </div>
                
                <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] overflow-y-auto custom-scrollbar pr-2">
                  <template v-for="(item, index) in telemetryData" :key="index">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">{{ item.label }}</span>
                      <span :class="item.highlight ? 'text-[#F59E0B] font-medium' : 'text-gray-200'">{{ item.value }}</span>
                    </div>
                  </template>
                </div>
              </div>
  
              <div class="flex-1 flex flex-col border-l border-[#D9D9D91A] pl-8">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-1 h-3.5 bg-[#32AFFF]"></div>
                    <span class="text-[15px] font-medium">遥信</span>
                  </div>
                  <span class="text-xs text-gray-500">2026-03-12 16:12:23</span>
                </div>
  
                <div class="grid grid-cols-2 gap-2 text-[13px] overflow-y-auto custom-scrollbar pr-2">
                  <div 
                    v-for="(item, index) in signallingData" 
                    :key="index"
                    class="flex items-center justify-center py-1.5 px-1 text-center font-normal"
                    :class="item.status === 'success' ? 'bg-[#00FA9A] text-gray-900' : 'bg-[#FF4D4F] text-white'"
                  >
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="flex-1 flex items-center justify-center text-gray-500 italic">
              正在加载 {{ tabs.find(t => t.key === activeTab)?.label }} 内容...
            </div>
  
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    visible: { type: Boolean, default: false }
  });
  
  const emit = defineEmits(['update:visible']);
  const closeModal = () => emit('update:visible', false);
  
  const selectedInverter = ref('N01-01');
  
  // --- 核心：Tab 栏配置 ---
  const activeTab = ref('telemetry');
  const tabs = ref([
    { label: '实时遥测', key: 'telemetry', count: 0 },
    { label: '设备告警', key: 'alarm', count: 2 },
    { label: '数据明细', key: 'detail', count: 0 }
  ]);
  
  const telemetryData = [
    { label: 'AB电压(V)', value: '35.64' }, { label: '转换效率', value: '125,764' },
    { label: 'BC电压(V)', value: '35.64' }, { label: '装机容量(kW)', value: '160,574' },
    { label: 'CA电压(V)', value: '35.64' }, { label: '等效小时数(h)', value: '30' },
    { label: 'A相电压(V)', value: '35.64' }, { label: '电流离散率', value: '20' },
    { label: 'B相电压(V)', value: '35.64' }, { label: '输入总功率(kW)', value: '260,5' },
    { label: 'C相电压(V)', value: '35.64' }, { label: '' },
    { label: 'A相电流(A)', value: '6.28' }, { label: '' },
    { label: 'B相电流(A)', value: '6.21' }, { label: '' },
    { label: 'C相电流(A)', value: '6.34', highlight: true }, { label: '' },
    { label: '有功功率(kW)', value: '6,202', highlight: true }, { label: '' },
    { label: '无功功率(kVar)', value: '2,642', highlight: true }, { label: '' },
    { label: '功率因数', value: '0.899' }, { label: '' },
    { label: '电网频率(Hz)', value: '0' }, { label: '' },
    { label: '机内温度 (℃)', value: '38' }, { label: '' },
    { label: '日发电量(kWh)', value: '125,764' }, { label: '' },
    { label: '额定总功率(kW)', value: '160,574' }, { label: '' },
    { label: '开机时间(秒)', value: '30' }, { label: '' },
    { label: '关机时间(秒)', value: '20' },
  ];
  
  const signallingData = [
    { label: '逆变器单元软启动故障', status: 'success' },
    { label: '逆变器单元直流电压采样故障', status: 'success' },
    { label: '逆变器单元电流不平衡', status: 'success' },
    { label: '逆变器单元驱动板故障', status: 'success' },
    { label: '逆变器单元运行', status: 'success' },
    { label: '逆变器单元载波同步故障', status: 'success' },
    { label: '逆变器单元直流空开', status: 'success' },
    { label: '逆变器单元直流开关状态', status: 'error' },
  ];
  </script>
  
  <style scoped>
  @keyframes movingLight {
    0% { left: -100px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }
  
  .animate-moving-light {
    animation: movingLight 2.5s infinite linear;
  }
  
  /* --- a-select 样式修复 --- */
  :deep(.custom-dark-select .ant-select-selection-item) {
    font-family: "Microsoft YaHei", sans-serif !important;
    font-weight: 400 !important;
    font-size: 12px !important;
    color: #FFFFFF !important;
    display: flex;
    align-items: center;
  }

  :deep(.top-select.custom-dark-select .ant-select-selection-item) {
    font-family: "Microsoft YaHei", sans-serif !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    color: #32AFFF !important;
    display: flex;
    align-items: center;
  }
  
  :deep(.custom-dark-select .ant-select-selector) {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 4px !important;
  }
  
  :deep(.custom-dark-select .ant-select-arrow) {
    color: #32AFFF !important;
  }
  
  :deep(.ant-select-dropdown) {
    background-color: #032748 !important;
    border: 1px solid #1C3E73 !important;
    padding: 4px 0 !important;
    z-index: 10000 !important; /* 确保下拉菜单比模态框更高 */
  }
  
  :deep(.ant-select-item-option-content) {
    font-family: "Microsoft YaHei", sans-serif !important;
    font-size: 12px !important;
    color: #FFFFFF !important;
  }
  
  :deep(.ant-select-item-option-active:not(.ant-select-item-option-disabled)) {
    background-color: #1C3E73 !important;
  }
  
  :deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
    background-color: #32AFFF !important;
  }
  
  /* 滚动条定制 */
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  </style>