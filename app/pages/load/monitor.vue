<template>
    <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">
      
      <div class="flex gap-2 h-[90px] shrink-0 w-full mb-2">
        <div 
          class="flex-1 flex items-center gap-4 px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #428EF4 0%, #3859E8 100%); border-radius: 2px;"
        >
          <img src="/image/loadmonitor1.png" alt="系统运行功率" class="w-10 h-10 z-10" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-1">系统运行功率(MW)</span>
            <span class="metric-values">120.00</span>
          </div>
        </div>
        
        <div 
          class="flex-1 flex items-center gap-4 px-6 relative overflow-hidden" 
          style="background: linear-gradient(180deg, #6C6AFF 0%, #4D27D5 100%); border-radius: 2px;"
        >
          <img src="/image/loadmonitor2.png" alt="日累计用电量" class="w-10 h-10 z-10" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-1">日累计用电量(kWh)</span>
            <span class="metric-values">162.10</span>
          </div>
        </div>
        
        <div 
          class="flex-1 flex items-center gap-4 px-6 relative overflow-hidden" 
          style="background: linear-gradient(180deg, #65C7F8 0%, #4491E2 100%); border-radius: 2px;"
        >
          <img src="/image/loadmonitor3.png" alt="月累计用电量" class="w-10 h-10 z-10" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-1">月累计用电量(kWh)</span>
            <span class="metric-values">1,400.00</span>
          </div>
        </div>
        
        <div 
          class="flex-1 flex items-center gap-4 px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #52A9DE 0%, #6CDDB1 100%); border-radius: 2px;"
        >
          <img src="/image/loadmonitor4.png" alt="年累计用电量" class="w-10 h-10 z-10" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-1">年累计用电量(kWh)</span>
            <span class="metric-values">360,400.00</span>
          </div>
        </div>
        
        <div 
          class="flex-1 flex items-center gap-4 px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #EF898B 0%, #F2CA69 100%); border-radius: 2px;"
        >
          <img src="/image/loadmonitor5.png" alt="额定用电功率" class="w-10 h-10 z-10" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-1">额定用电功率(MW)</span>
            <span class="metric-values">5,400.00</span>
          </div>
        </div>
      </div>
  
      <div class="flex gap-2 flex-1 w-full overflow-hidden">
        
        <div class="w-[280px] shrink-0 flex flex-col h-full bg-transparent" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
          <div class="flex justify-between items-center mt-1 mb-2">
            <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷区域</span>
            <div class="flex gap-1 text-[12px] p-1 mt-1 mr-1">
                <button 
                    v-for="btn in buttons" 
                    :key="btn" 
                    @click="activeBtn = btn"
                    class="px-2 text-[10px] rounded transition-all" 
                    :class="btn === activeBtn ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-[#FFFFFFCC] hover:text-gray-300 cursor-pointer'"
                    >
                    {{ btn }}
                </button>
            </div>
          </div>
          
          <div class="mb-3 px-2 custom-search">
            <a-input
              v-model:value="searchValue"
              placeholder="请输入"
              allow-clear
              @pressEnter="onQuery"
            >
              <template #suffix>
                <svg @click="onQuery" class="w-4 h-4 cursor-pointer text-[#fefefe66] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </template>
            </a-input>
          </div>
          
          <div class="flex-1 overflow-auto custom-tree-wrapper pr-2">
            <a-tree
              v-model:selectedKeys="selectedKeys"
              v-model:expandedKeys="expandedKeys"
              :tree-data="treeData"
              :show-icon="false"
            >
              <template #title="{ title }">
                <span class="text-[13px]">{{ title }}</span>
              </template>
            </a-tree>
          </div>
        </div>
  
        <div class="flex-1 flex flex-col h-full bg-transparent" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
          
          <div class="flex w-full justify-between items-center mt-1 pb-1.5 border-b border-[#FFFFFF2A] px-2">
            <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷监测</span>
          </div>
  
          <div class="flex flex-1 w-full h-full overflow-hidden p-4 gap-10">
            
            <div class="w-[37.5%] flex flex-col h-full gap-2 overflow-y-auto custom-scrollbar pr-2">
              
              <div class="h-[375px] w-full flex items-center justify-center relative z-10000">
                <div class="h-full w-full flex items-center justify-center ml-2" 
                  :style="{
                    backgroundImage: `url('/image/house.png')`,
                    backgroundSize: layoutMode === 'sidebar' ? '72%' : '65%',
                    backgroundPosition: layoutMode === 'sidebar' ? 'center -60px' : 'center -20px',
                    backgroundRepeat: 'no-repeat',
                  }"
                >
                </div>
              </div>
  
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-3">
                  <div class="text-[14px] font-bold border-l-[3px] border-[#32AFFF] pl-2 leading-none">遥测</div>
                  <div class="text-[12px] text-[#FFFFFF80]">2026-03-12 16:12:23</div>
                </div>
                <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-[12px]">
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">输入功率(kW)</span><span class="font-mono text-[13px]">586,781</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">累计发电量(万kWh)</span><span class="font-mono text-[13px]">3,424.91</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">输出功率(kW)</span><span class="font-mono text-[13px]">582,880</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">装机容量(MWp)</span><span class="font-mono text-[13px]">3,424.91</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">无功功率(kVar)</span><span class="font-mono text-[13px]">0.61</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">利用小时数(h)</span><span class="font-mono text-[13px]">6.54</span></div>
                  <div class="flex justify-between items-center"><span class="text-[#FFFFFF80]">日发电量(kWh)</span><span class="font-mono text-[13px]">822,700</span></div>
                </div>
              </div>
  
              <div class="flex flex-col mt-2">
                <div class="flex justify-between items-center mb-3">
                  <div class="text-[14px] font-bold border-l-[3px] border-[#32AFFF] pl-2 leading-none">遥信</div>
                  <div class="text-[12px] text-[#FFFFFF80]">2026-03-12 16:12:23</div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[12px] text-center">
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元软启动故障</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元直流电压采样故障</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元电流不平衡</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元驱动板故障</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元运行</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元载波同步故障</div>
                  <div class="bg-[#1ADF8C] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元直流空开</div>
                  <div class="bg-[#FB5252] text-[#262626] py-2 rounded-sm shadow-sm">逆变器单元直流开关状态</div>
                </div>
              </div>
            </div>
  
            <div class="flex-1 flex flex-col w-full h-full gap-4">
              
              <div class="flex-1 flex flex-col min-h-0">
                <div class="flex justify-between items-center mb-2">
                  <div class="text-[14px] font-bold border-l-[3px] border-[#32AFFF] pl-2 leading-none">运行功率分析</div>
                  <div class="flex gap-1">
                    <button v-for="t in timeFilters" :key="'p_'+t" class="px-3 py-1 text-[12px] rounded border border-[#2A3B5D] text-[#FFFFFF80] hover:text-[#32AFFF] hover:border-[#32AFFF] transition-colors bg-transparent cursor-pointer flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ t }}
                    </button>
                  </div>
                </div>
                <div ref="powerChartRef" class="flex-1 w-full bg-[#FFFFFF05] rounded-sm"></div>
              </div>
  
              <div class="flex-1 flex flex-col min-h-0">
                <div class="flex justify-between items-center mb-2">
                  <div class="text-[14px] font-bold border-l-[3px] border-[#32AFFF] pl-2 leading-none">用电量分析</div>
                  <div class="flex gap-1">
                    <button v-for="t in timeFilters" :key="'e_'+t" class="px-3 py-1 text-[12px] rounded border border-[#2A3B5D] text-[#FFFFFF80] hover:text-[#32AFFF] hover:border-[#32AFFF] transition-colors bg-transparent cursor-pointer flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ t }}
                    </button>
                  </div>
                </div>
                <div ref="energyChartRef" class="flex-1 w-full bg-[#FFFFFF05] rounded-sm"></div>
              </div>
  
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
  import * as echarts from 'echarts'
  
  definePageMeta({
    layout: 'layout'
  })
  
  const searchValue = ref('')
  const selectedKeys = ref(['1-1-1'])
  const expandedKeys = ref(['1', '1-1', '1-2'])
  
  const treeData = ref([
    {
      title: '养殖区',
      key: '1',
      children: [
        {
          title: '1#养殖车间',
          key: '1-1',
          children: [
            { title: '1#养殖池', key: '1-1-1' },
            { title: '2#养殖池', key: '1-1-2' },
            { title: '3#养殖池', key: '1-1-3' },
            { title: '4#养殖池', key: '1-1-4' },
            { title: '5#养殖池', key: '1-1-5' },
            { title: '6#养殖池', key: '1-1-6' },
          ]
        },
        {
          title: '2#养殖车间',
          key: '1-2',
          children: [
            { title: '1#养殖池', key: '1-2-1' },
            { title: '2#养殖池', key: '1-2-2' },
          ]
        }
      ]
    },
    { title: '办公区', key: '2' },
    { title: '仓储区', key: '3' },
    { title: '生活区', key: '4' },
  ])
  
  const buttons = ref(['区域', '设备']);
  const activeBtn = ref('区域');
  const timeFilters = ref(['日', '月', '年', '自定义']);
  
  // 搜索事件
  const onQuery = () => {
    console.log('执行搜索，关键字:', searchValue.value)
    // 此处可添加相应的过滤或接口请求逻辑
  }
  
  // ECharts 实例化
  const powerChartRef = ref(null)
  const energyChartRef = ref(null)
  let powerChart = null
  let energyChart = null
  
  const initCharts = () => {
    if (powerChartRef.value) {
      powerChart = echarts.init(powerChartRef.value)
      powerChart.setOption(getChartOption('#00FF9D', '运行功率'))
    }
    if (energyChartRef.value) {
      energyChart = echarts.init(energyChartRef.value)
      energyChart.setOption(getChartOption('#32AFFF', '用电量'))
    }
  }
  
  // 通用折线图配置获取
  const getChartOption = (colorHex, name) => {
    return {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.7)', textStyle: { color: '#fff' }, borderColor: 'transparent' },
      grid: { top: '15%', left: '3%', right: '4%', bottom: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['7:10', '8:10', '9:10', '10:10', '11:10', '12:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:10'],
        axisLine: { lineStyle: { color: '#2A3B5D' } },
        axisLabel: { color: '#FFFFFF80', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#2A3B5D', type: 'dashed' } },
        axisLabel: { color: '#FFFFFF80', fontSize: 10 }
      },
      series: [
        {
          name: name,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: colorHex },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${colorHex}66` }, // 40% 透明度
              { offset: 1, color: `${colorHex}00` }  // 0% 透明度
            ])
          },
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 20) + 10) // 模拟数据
        }
      ]
    }
  }
  
  // 自适应窗口
  const resizeCharts = () => {
    powerChart?.resize()
    energyChart?.resize()
  }
  
  onMounted(() => {
    nextTick(() => {
      initCharts()
      window.addEventListener('resize', resizeCharts)
    })
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts)
    powerChart?.dispose()
    energyChart?.dispose()
  })
  </script>
  
  <style scoped>
  @import url('../../assets/css/antd.css');
  
  /* 修复搜索框背景与边框样式 */
  :deep(.custom-search .ant-input),
  :deep(.custom-search .ant-input-affix-wrapper) {
    background-color: transparent !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
    border-radius: 4px;
    box-shadow: none !important;
  }
  :deep(.custom-search .ant-input-affix-wrapper:hover),
  :deep(.custom-search .ant-input-affix-wrapper-focused) {
    border-color: #32AFFF66 !important;
  }
  :deep(.custom-search .ant-input::placeholder) {
    color: rgba(255, 255, 255, 0.3);
  }
  
  /* Tree 样式覆盖 */
  :deep(.custom-tree-wrapper .ant-tree) {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.85);
  }
  :deep(.custom-tree-wrapper .ant-tree-node-content-wrapper:hover) {
    background-color: rgba(24, 144, 255, 0.15) !important;
  }
  :deep(.custom-tree-wrapper .ant-tree-node-selected) {
    background-color: rgba(24, 144, 255, 0.25) !important;
    color: #32AFFF !important;
  }
  :deep(.custom-tree-wrapper .ant-tree-switcher) {
    color: rgba(255, 255, 255, 0.45);
  }
  
  /* 通用滚动条定制 */
  .custom-tree-wrapper::-webkit-scrollbar,
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-tree-wrapper::-webkit-scrollbar-thumb,
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .custom-tree-wrapper::-webkit-scrollbar-track,
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .metric-title {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFFCC;
  }
  .metric-values {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 28px;
    color: #FFFFFF;
    line-height: 42px;
  }
  </style>