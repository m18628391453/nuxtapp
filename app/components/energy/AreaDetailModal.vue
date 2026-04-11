<template>
    <Teleport to="body">
      <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center font-sans">
        <div class="absolute inset-0 bg-[#000000CC]" @click="closeModal"></div>
        <div class="relative w-[960px] bg-[#032748] border border-[#0327489F] rounded shadow-2xl flex flex-col text-white transform transition-all">
          
          <div class="flex items-center justify-between px-6 py-1.5">
            <div class="flex items-center text-[14px] font-normal">
              <span class="text-[#FFFFFF] mr-1">电站总览</span><span>/</span>
              <a-select
                v-model:value="selectedArea"
                :bordered="false"
                class="custom-dark-select top-select"
                style="width: 160px; font-size: 14px;"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              >
                <a-select-option value="1">1#区域</a-select-option>
                <a-select-option value="2">2#区域</a-select-option>
                <a-select-option value="3">3#区域</a-select-option>
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
                <svg viewBox="0 0 24 24" fill="#32AFFF" width="100%" height="100%">
                  <path d="M3 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3zM3 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6zm10 0a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6z" />
                </svg>
              </div>
              <span class="text-xs text-gray-300 border border-gray-600/50 px-3 py-1 rounded">区域</span>
            </div>
  
            <div class="flex-1 h-[1px] bg-[#1C3E73] relative overflow-hidden mx-2 -mt-8">
              <div class="absolute top-0 left-0 h-full w-[100px] bg-gradient-to-r from-transparent via-[#32AFFF] to-transparent animate-moving-light"></div>
            </div>
  
            <div class="flex flex-col items-center gap-2 z-10 w-[160px]">
              <div class="flex items-center justify-center p-2" style="width: 84px;height: 64px;">
                <svg viewBox="0 0 1118 1024" width="100%" height="100%" fill="#32AFFF">
                  <path d="M1083.076923 74.486154a12.8 12.8 0 0 0 11.667692-7.532308l22.252308-48.836923A12.8 12.8 0 0 0 1105.329231 0H12.849231A12.8 12.8 0 0 0 1.181538 18.116923l22.252308 48.836923a12.8 12.8 0 0 0 11.667692 7.532308 12.750769 12.750769 0 0 1 12.8 12.8v849.181538a12.8 12.8 0 0 1-12.8 12.8H14.769231a12.750769 12.750769 0 0 0-12.8 12.8v48.836923A12.8 12.8 0 0 0 14.769231 1024h1086.326154a12.849231 12.849231 0 0 0 12.8-12.849231v-48.836923a12.8 12.8 0 0 0-12.8-12.8H1083.076923a12.8 12.8 0 0 1-12.8-12.8V87.286154a12.750769 12.750769 0 0 1 12.8-12.8z m-91.470769 856.615384a12.849231 12.849231 0 0 1-12.8 12.8H139.273846a12.849231 12.849231 0 0 1-12.849231-12.8V91.175385a12.8 12.8 0 0 1 12.849231-12.8h839.532308a12.8 12.8 0 0 1 12.8 12.8z" />
                </svg>
              </div>
              <div class="border border-gray-600/50 rounded">
                 <a-select 
                  v-model:value="selectedArea" 
                  :bordered="false" 
                  size="small" 
                  class="custom-dark-select" 
                  style="width: 140px;"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                >
                  <a-select-option value="1">1#区域</a-select-option>
                  <a-select-option value="2">2#区域</a-select-option>
                 </a-select>
              </div>
            </div>
  
            <div class="flex-1 h-[2px] bg-[#1C3E73] relative overflow-hidden mx-2 -mt-8">
              <div class="absolute top-0 left-0 h-full w-[100px] bg-gradient-to-r from-transparent via-[#32AFFF] to-transparent animate-moving-light" style="animation-delay: 0.5s;"></div>
            </div>
  
            <div class="flex flex-col items-center gap-2 z-10 w-[120px]">
              <div class="flex items-center justify-center p-1" style="width: 70px;height: 58px;">
                <svg viewBox="0 0 1031 1024" width="100%" height="100%" fill="#32AFFF">
                  <path d="M1017.995821 91.333706L817.134843 2.092484a24.106956 24.106956 0 0 0-9.915691-2.092302h-586.754215a25.062137 25.062137 0 0 0-10.006661 2.183271L14.14578 91.197252 13.645447 91.424676a24.33438 24.33438 0 0 0-13.645447 21.78723V245.618226a49.260063 49.260063 0 0 0 49.260063 49.078124h933.439536a49.260063 49.260063 0 0 0 49.260063-49.260064v-131.905986a24.106956 24.106956 0 0 0-13.963841-22.196594zM914.24494 350.233318H120.62575a49.260063 49.260063 0 0 0-49.260063 49.442003V974.739937a49.260063 49.260063 0 0 0 49.260063 49.260063H914.24494a49.260063 49.260063 0 0 0 49.260064-49.260063H120.62575a49.260063 49.260063 0 0 0-49.260063 49.442003V974.739937a49.260063 49.260063 0 0 0 49.260063 49.260063H914.24494a49.260063 49.260063 0 0 0 49.260064-49.260063V399.675321A49.260063 49.260063 0 0 0 914.24494 350.233318z" />
                </svg>
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
                    <span class="text-[15px] font-medium">区域遥测</span>
                  </div>
                  <span class="text-xs text-gray-500">{{ nowTime }}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] overflow-y-auto custom-scrollbar pr-2">
                  <template v-for="(item, index) in areaTelemetryData" :key="index">
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
                    <span class="text-[15px] font-medium">区域状态</span>
                  </div>
                  <span class="text-xs text-gray-500">{{ nowTime }}</span>
                </div>
  
                <div class="grid grid-cols-2 gap-2 text-[13px] overflow-y-auto custom-scrollbar pr-2">
                  <div 
                    v-for="(item, index) in areaStatusData" 
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
    import { ref, computed } from 'vue';
    
    const props = defineProps({
      visible: { type: Boolean, default: false },
      areaId: { type: [String, Number], default: '' }
    });
    
    const emit = defineEmits(['update:visible']);
    const closeModal = () => emit('update:visible', false);
  
    const nowTime = computed(() => {
      const date = new Date()
      return date.toLocaleString('zh-CN')
    })
    
    const selectedArea = ref(props.areaId || '1');
    
    const activeTab = ref('telemetry');
    const tabs = ref([
      { label: '实时数据', key: 'telemetry', count: 0 },
      { label: '区域告警', key: 'alarm', count: 5 },
      { label: '统计明细', key: 'detail', count: 0 }
    ]);
    
    const areaTelemetryData = ref([
      { label: '区域日发电量(kWh)', value: '26,671', highlight: true },
      { label: '区域实时功率(kW)', value: '2,880', highlight: true },
      { label: '区域装机容量(kWp)', value: '1,700' },
      { label: '区域在线逆变器', value: '25' },
      { label: '区域告警逆变器', value: '2' },
      { label: '区域停机设备', value: '1' },
      { label: '区域总设备数', value: '28' },
      { label: '区域运行率', value: '92.8%' },
      { label: 'AB线电压(V)', value: '392.5' },
      { label: 'BC线电压(V)', value: '391.8' },
      { label: 'CA线电压(V)', value: '393.2' },
      { label: '输出总电流(A)', value: '42.6' },
      { label: '功率因数', value: '0.98' },
      { label: '电网频率(Hz)', value: '50.02' },
      { label: '环境温度(℃)', value: '26' },
      { label: '箱变温度(℃)', value: '42' },
    ]);
    
    const areaStatusData = ref([
      { label: '区域通信正常', status: 'success' },
      { label: '区域功率正常', status: 'success' },
      { label: '电压正常', status: 'success' },
      { label: '频率正常', status: 'success' },
      { label: '温度正常', status: 'success' },
      { label: '支路异常', status: 'error' },
      { label: '绝缘异常', status: 'success' },
      { label: '漏电流告警', status: 'error' },
    ]);
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
    
    :deep(.custom-dark-select .ant-select-selection-item) {
      font-family: "Microsoft YaHei", sans-serif !important;
      font-weight: 400 !important;
      font-size: 12px !important;
      color: #FFFFFF !important;
      display: flex;
      align-items: center;
    }
    :deep(.top-select.custom-dark-select .ant-select-selection-item) {
      font-size: 14px !important;
      color: #32AFFF !important;
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
      z-index: 10000 !important;
    }
    
    :deep(.ant-select-item-option-content) {
      font-size: 12px !important;
      color: #FFFFFF !important;
    }
    
    :deep(.ant-select-item-option-active) {
      background-color: #1C3E73 !important;
    }
    
    :deep(.ant-select-item-option-selected) {
      background-color: #32AFFF !important;
    }
    
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
    }
    </style>