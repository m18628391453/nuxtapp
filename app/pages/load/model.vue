<template>
  <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">
    <div class="flex gap-2 flex-1 w-full overflow-hidden">
      <!-- 左侧树状菜单 完全保留 不要修改！！！ -->
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
      
      <!-- 右侧区域 修复宽度溢出问题 关键：加overflow:hidden和width:0 -->
      <div class="flex-1 flex flex-col h-full bg-transparent overflow-hidden" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
        <!-- 满行搜索栏 完全和左侧一致 带搜索图标 -->
        <div class="bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] px-2 py-1 mx-4 mb-4 shrink-0 w-[calc(100%-32px)] mt-3.5">
          <div class="grid grid-cols-1 gap-4 items-center custom-search content-search">
            <a-input
              v-model:value="modelSearchValue"
              placeholder="搜索"
              allow-clear
              class="border border-[#FFFFFF00]"
              @pressEnter="onModelQuery"
            >
              <template #suffix>
                <svg @click="onModelQuery" class="w-4 h-4 cursor-pointer text-[#fefefe66] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </template>
            </a-input>
          </div>
        </div>
        
        <!-- 表格容器 关键：加width:100%和overflow:hidden -->
        <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] flex flex-col min-h-0 overflow-hidden mx-4 mb-4 w-[calc(100%-32px)]">
          <!-- 表格标题与操作按钮 -->
          <div class="flex justify-between items-center px-6 py-2 border-b border-[#FFFFFF14] shrink-0">
            <span class="text-[14px] font-normal text-white tracking-wide">负荷模型列表</span>
            <div class="flex gap-2 shrink-0">
              <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80">新增</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]">编辑</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]">删除</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]">导出</a-button>
            </div>
          </div>
          
          <!-- 表格主体 关键：加width:100%，表格scroll同时设置x和y -->
          <div class="flex-1 overflow-hidden flex flex-col p-2 pb-0 custom-table-container w-full">
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="paginationConfig"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :scroll="{ x: '100%', y: 'max-content' }"
              class="custom-dark-table border border-[#FFFFFF1F] flex-1 w-full"
              row-key="id"
              :table-layout="'fixed'"
            >
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.key === 'index'">
                  <span class="text-[#FFFFFF60] text-[14px]">{{ index + 1 }}</span>
                </template>
                
                <template v-else-if="column.key === 'areaCode'">
                  <span class="text-[#32AFFF] text-[14px] cursor-pointer hover:underline">{{ text }}</span>
                </template>
                
                <template v-else-if="column.key === 'areaDesc'">
                  <!-- 负荷区域描述内容左对齐 标题保持居中 -->
                  <span class="text-[#FFFFFFCC] text-[14px] text-left block">{{ text }}</span>
                </template>
                
                <template v-else-if="column.key === 'action'">
                  <a-button type="link" class="!text-[#32AFFF] !text-[14px] !p-0 !mr-2">修改</a-button>
                  <a-button type="link" class="!text-[#FF4D4F] !text-[14px] !p-0">删除</a-button>
                </template>
                
                <template v-else>
                  <span class="text-[#FFFFFFCC] text-[14px]">{{ text }}</span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

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
  console.log('执行左侧搜索，关键字:', searchValue.value)
  // 此处可添加相应的过滤或接口请求逻辑
}
// 自适应窗口
const resizeCharts = () => {

}

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', resizeCharts)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
})

// -------------------------- 左侧原有代码结束 --------------------------
// 右侧搜索框
const modelSearchValue = ref('')
// 右侧搜索事件
const onModelQuery = () => {
  console.log('执行右侧搜索，关键字:', modelSearchValue.value)
  // 此处可添加相应的过滤或接口请求逻辑
}

// 表格选中行 模拟设计稿默认选中第4行
const selectedRowKeys = ref([4])
const onSelectChange = (keys) => { selectedRowKeys.value = keys }

// 表格列配置 完全匹配设计稿 关键：给每列设置固定宽度 防止自动计算溢出
const columns = [
  { title: '序号', key: 'index', width: 80, align: 'center' },
  { title: '区域编码', dataIndex: 'areaCode', key: 'areaCode', width: 150, align: 'center' },
  { title: '区域名称', dataIndex: 'areaName', key: 'areaName', width: 150, align: 'center' },
  { title: '负荷区域描述', dataIndex: 'areaDesc', key: 'areaDesc', width: 350, align: 'center' },
  { title: '组件ID', dataIndex: 'componentId', key: 'componentId', width: 150, align: 'center' },
  { title: '操作', key: 'action', align: 'center', width: 120 }
]

// 模拟表格数据 完全匹配设计稿内容
const tableData = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  areaCode: `FHLX-000${i+1}`,
  areaName: `${i+1}#养殖池`,
  areaDesc: [
    '在保障固定负荷后，可中断运行',
    '可按时段配置充放时段',
    '优先保障供电，仅在极端情况下短时限制',
    '在保障固定负荷后，尽可能保障，必要时可降额运行'
  ][i % 4],
  componentId: `AREA-010${i+1}`
})))

// 分页配置 完全匹配设计稿
const paginationConfig = ref({
  total: 200,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共${total}条数据`,
  size: 'small'
})
// -------------------------- 右侧新增代码结束 --------------------------
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

:deep(.content-search .ant-input),
:deep(.content-search .ant-input-affix-wrapper),
:deep(.content-search .ant-input-affix-wrapper:hover),
:deep(.content-search .ant-input-affix-wrapper-focused) {
  border-color: rgba(255, 255, 255, 0.0) !important;
}

:deep(.content-search .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.95);
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

/* -------------------------- 新增表格相关样式 完全参考告警页面 -------------------------- */
:deep(.ant-table.ant-table-fixed-header) {
  height: calc(100% - 120px);
}
/* 深色表格样式覆盖 */
:deep(.custom-dark-table .ant-table-thead > tr > th) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr > td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr:hover > td) {
  background-color: rgba(50, 175, 255, 0.1) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: rgba(50, 175, 255, 0.2) !important;
}
/* 深色输入框样式 */
:deep(.custom-dark-input .ant-input) {
  background-color: transparent !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  border-radius: 4px;
  box-shadow: none !important;
}
:deep(.custom-dark-input .ant-input:hover),
:deep(.custom-dark-input .ant-input-focused) {
  border-color: #32AFFF66 !important;
}
:deep(.custom-dark-input .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

/* 关键修复：强制表格宽度不超过父容器 */
:deep(.custom-dark-table .ant-table-container) {
  width: 100% !important;
  overflow-x: auto !important;
}
:deep(.custom-dark-table table) {
  width: 100% !important;
  table-layout: fixed !important;
}
</style>