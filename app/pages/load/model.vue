<template>
  <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">

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
          <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷模型列表</span>
        </div>

        <!-- 表格区域 -->
        <div class="flex flex-1 w-full h-full overflow-hidden p-4 gap-10">
          
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

// 搜索事件
const onQuery = () => {
  console.log('执行搜索，关键字:', searchValue.value)
  // 此处可添加相应的过滤或接口请求逻辑
}

// 自适应窗口
const resizeCharts = () => {

}

onMounted(() => {
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', resizeCharts)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
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
.img-content {
  height: 40%;
}
.monitor-button {
  background: rgba(7,59,109,0.5);
}
</style>