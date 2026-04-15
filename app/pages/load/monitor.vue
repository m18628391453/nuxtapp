<template>
    <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">
      
      <div class="flex gap-2 h-[90px] shrink-0 w-full mb-2">
        <div 
          class="flex-1 flex flex-col justify-center px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #428EF4 0%, #3859E8 100%); border-radius: 2px;"
        >
          <span class="text-sm opacity-80 mb-1 z-10">系统运行功率(MW)</span>
          <span class="text-3xl font-bold z-10">120.00</span>
        </div>
        
        <div 
          class="flex-1 flex flex-col justify-center px-6 relative overflow-hidden" 
          style="background: linear-gradient(180deg, #6C6AFF 0%, #4D27D5 100%); border-radius: 2px;"
        >
          <span class="text-sm opacity-80 mb-1 z-10">日累计用电量(kWh)</span>
          <span class="text-3xl font-bold z-10">162.10</span>
        </div>
        
        <div 
          class="flex-1 flex flex-col justify-center px-6 relative overflow-hidden" 
          style="background: linear-gradient(180deg, #65C7F8 0%, #4491E2 100%); border-radius: 2px;"
        >
          <span class="text-sm opacity-80 mb-1 z-10">月累计用电量(kWh)</span>
          <span class="text-3xl font-bold z-10">1,400.00</span>
        </div>
        
        <div 
          class="flex-1 flex flex-col justify-center px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #52A9DE 0%, #6CDDB1 100%); border-radius: 2px;"
        >
          <span class="text-sm opacity-80 mb-1 z-10">年累计用电量(kWh)</span>
          <span class="text-3xl font-bold z-10">360,400.00</span>
        </div>
        
        <div 
          class="flex-1 flex flex-col justify-center px-6 relative overflow-hidden" 
          style="background: linear-gradient(0deg, #EF898B 0%, #F2CA69 100%); border-radius: 2px;"
        >
          <span class="text-sm opacity-80 mb-1 z-10">额定用电功率(MW)</span>
          <span class="text-3xl font-bold z-10">5,400.00</span>
        </div>
      </div>
  
      <div class="flex gap-2 flex-1 w-full overflow-hidden">
        
        <div class="w-[280px] shrink-0 flex flex-col h-[98%] bg-transparent" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
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
          
          <div class="mb-4 custom-search">
            <a-input
                class="custom-dark-input w-full"
              v-model:value="searchValue"
              placeholder="请输入"
              allow-clear
            />
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
          <div class="flex w-full justify-between items-center mt-1 pb-1.5 border-b border-[#FFFFFF2A]">
            <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷监测</span>
            <div class="flex gap-1 text-[12px] p-1 mt-1 mr-1"></div>
          </div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
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
  </script>
  
  <style scoped>
  @import url('../../assets/css/antd.css');
  /* 覆盖 Ant Design Vue 的默认亮色样式，适配暗黑 UI */
  :deep(.custom-search .ant-input-search .ant-input) {
    background-color: transparent !important;
    border-color: #2A3B5D !important;
    color: #fff !important;
    border-radius: 2px;
  }
  :deep(.custom-search .ant-input-search .ant-input-wrapper) {
    background-color: transparent !important;
  }
  :deep(.custom-search .ant-input-group-addon) {
    background: transparent !important;
  }
  :deep(.custom-search .ant-btn) {
    border-color: #2A3B5D !important;
    background-color: transparent !important;
    color: #1890FF !important;
  }
  :deep(.custom-search .ant-input::placeholder) {
    color: rgba(255, 255, 255, 0.3);
  }
  
  :deep(.custom-tree-wrapper .ant-tree) {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.85);
  }
  :deep(.custom-tree-wrapper .ant-tree-node-content-wrapper:hover) {
    background-color: rgba(24, 144, 255, 0.2) !important;
  }
  :deep(.custom-tree-wrapper .ant-tree-node-selected) {
    background-color: rgba(24, 144, 255, 0.2) !important;
    color: #1890FF !important;
  }
  :deep(.custom-tree-wrapper .ant-tree-switcher) {
    color: rgba(255, 255, 255, 0.45);
  }
  /* 自定义滚动条 */
  .custom-tree-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  .custom-tree-wrapper::-webkit-scrollbar-thumb {
    background-color: #2A3B5D;
    border-radius: 4px;
  }
  .custom-tree-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }
  </style>