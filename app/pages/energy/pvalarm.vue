<template>
  <div class="w-full h-full min-h-screen bg-[#061122] flex flex-col p-4 font-sans text-white gap-4 box-border">
    
    <div class="grid grid-cols-4 gap-4 h-[110px] shrink-0">
      <div v-for="(card, index) in summaryCards" :key="index" 
        class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center gap-2">
          <div class="w-1 h-3" :style="{ backgroundColor: card.color }"></div>
          <span class="text-[#FFFFFF99] text-[14px]">{{ card.title }}</span>
        </div>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="text-[32px] font-bold leading-none" :style="{ color: card.color }">{{ card.value }}</span>
          <span class="text-[12px] text-[#FFFFFF66]">{{ card.unit }}</span>
        </div>
        <div class="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12" :style="{ color: card.color }">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>
    </div>

    <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 flex flex-wrap items-center gap-4 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">选择日期:</span>
        <a-range-picker 
          v-model:value="searchDate" 
          class="custom-dark-range-picker"
          dropdownClassName="custom-dark-datepicker-dropdown"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">告警级别:</span>
        <a-select v-model:value="filterLevel" class="custom-dark-select" style="width: 120px;" :getPopupContainer="(triggerNode) => triggerNode.parentNode">
          <a-select-option value="all">全部级别</a-select-option>
          <a-select-option value="fatal">严重</a-select-option>
          <a-select-option value="major">重要</a-select-option>
        </a-select>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">设备类型:</span>
        <a-select v-model:value="filterType" class="custom-dark-select" style="width: 140px;" :getPopupContainer="(triggerNode) => triggerNode.parentNode">
          <a-select-option value="all">全部设备</a-select-option>
          <a-select-option value="inverter">逆变器</a-select-option>
          <a-select-option value="combiner">汇流箱</a-select-option>
        </a-select>
      </div>

      <div class="flex-1 min-w-[200px]">
        <a-input v-model:value="searchKey" placeholder="请输入搜索内容" class="custom-dark-input">
          <template #prefix>
            <svg class="w-4 h-4 text-[#FFFFFF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </template>
        </a-input>
      </div>

      <div class="flex gap-2">
        <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80">查询</a-button>
        <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-white">重置</a-button>
      </div>
    </div>

    <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] flex flex-col min-h-0">
      <div class="flex border-b border-[#FFFFFF1A] shrink-0">
        <button v-for="tab in tabs" :key="tab.key" 
          @click="currentTab = tab.key"
          :class="['px-6 py-3 text-[14px] transition-all relative', currentTab === tab.key ? 'text-[#32AFFF] font-medium' : 'text-[#FFFFFF99] hover:text-white']">
          {{ tab.label }}
          <div v-if="currentTab === tab.key" class="absolute bottom-0 left-0 w-full h-[2px] bg-[#32AFFF]"></div>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4 custom-scrollbar">
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left text-[#FFFFFF66] text-[13px] border-b border-[#FFFFFF1A]">
              <th class="pb-3 pl-2 font-normal">告警ID</th>
              <th class="pb-3 font-normal">设备名称</th>
              <th class="pb-3 font-normal">告警级别</th>
              <th class="pb-3 font-normal">告警类型</th>
              <th class="pb-3 font-normal">告警内容</th>
              <th class="pb-3 font-normal">发生时间</th>
              <th class="pb-3 font-normal">状态</th>
              <th class="pb-3 pr-2 text-right font-normal">操作</th>
            </tr>
          </thead>
          <tbody class="text-[13px]">
            <tr v-for="(item, index) in tableData" :key="index" 
              class="border-b border-[#FFFFFF05] hover:bg-[#FFFFFF05] transition-colors group">
              <td class="py-4 pl-2 text-[#FFFFFF99]">{{ item.id }}</td>
              <td class="py-4 text-[#E5E7EB]">{{ item.deviceName }}</td>
              <td class="py-4">
                <span class="px-2 py-0.5 rounded-[2px] text-[11px]" :style="{ backgroundColor: item.levelColor + '20', color: item.levelColor, border: '1px solid ' + item.levelColor + '40' }">
                  {{ item.levelText }}
                </span>
              </td>
              <td class="py-4 text-[#FFFFFF99]">{{ item.type }}</td>
              <td class="py-4 text-[#E5E7EB]">{{ item.content }}</td>
              <td class="py-4 text-[#FFFFFF99]">{{ item.time }}</td>
              <td class="py-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full" :class="item.status === 'unhandled' ? 'bg-[#FF4D4F]' : 'bg-[#00FA9A]'"></span>
                  <span :class="item.status === 'unhandled' ? 'text-[#FF4D4F]' : 'text-[#00FA9A]'">{{ item.statusText }}</span>
                </div>
              </td>
              <td class="py-4 pr-2 text-right">
                <button class="text-[#32AFFF] hover:underline">详情</button>
                <button class="ml-3 text-[#FFFFFF66] hover:text-white">处理</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-[#FFFFFF1A] flex justify-between items-center shrink-0">
        <span class="text-[12px] text-[#FFFFFF66]">共 {{ totalCount }} 条记录</span>
        <a-pagination 
          size="small" 
          :total="totalCount" 
          :show-size-changer="false"
          class="custom-dark-pagination"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';

definePageMeta({
  layout: 'layout'
})

// 顶部卡片
const summaryCards = ref([
  { title: '当日告警总数', value: '1,524', unit: '条', color: '#32AFFF' },
  { title: '严重告警', value: '28', unit: '条', color: '#FF4D4F' },
  { title: '重要告警', value: '142', unit: '条', color: '#FAAD14' },
  { title: '次要告警', value: '356', unit: '条', color: '#FADB14' }
]);

// 筛选条件
const searchDate = ref([]);
const filterLevel = ref('all');
const filterType = ref('all');
const searchKey = ref('');

// Tab
const currentTab = ref('all');
const tabs = [
  { label: '全部告警', key: 'all' },
  { label: '待处理', key: 'pending' },
  { label: '已处理', key: 'resolved' }
];

// 模拟表格数据
const totalCount = ref(1524);
const tableData = ref([
  { id: 'AL-20260411-001', deviceName: '1#逆变器', levelText: '严重', levelColor: '#FF4D4F', type: '设备故障', content: 'IGBT模块超温报警', time: '2026-04-11 09:12:05', status: 'unhandled', statusText: '待处理' },
  { id: 'AL-20260411-002', deviceName: '5#汇流箱', levelText: '重要', levelColor: '#FAAD14', type: '通讯异常', content: 'RS485通讯链路中断', time: '2026-04-11 08:45:22', status: 'unhandled', statusText: '待处理' },
  { id: 'AL-20260411-003', deviceName: '环境检测仪', levelText: '提示', levelColor: '#32AFFF', type: '数据越限', content: '环境风速传感器数值偏离正常范围', time: '2026-04-11 08:30:11', status: 'resolved', statusText: '已处理' },
  { id: 'AL-20260411-004', deviceName: '3#变压器', levelText: '严重', levelColor: '#FF4D4F', type: '电气保护', content: '变压器瓦斯保护跳闸', time: '2026-04-11 07:55:00', status: 'unhandled', statusText: '待处理' },
  { id: 'AL-20260411-005', deviceName: '2#逆变器', levelText: '次要', levelColor: '#FADB14', type: '性能下降', content: '直流侧输入功率异常偏低', time: '2026-04-11 07:20:15', status: 'resolved', statusText: '已处理' },
  { id: 'AL-20260411-006', deviceName: '15#逆变器', levelText: '重要', levelColor: '#FAAD14', type: '参数设置', content: '系统时间未同步', time: '2026-04-11 06:10:05', status: 'unhandled', statusText: '待处理' },
  { id: 'AL-20260411-007', deviceName: '8#汇流箱', levelText: '提示', levelColor: '#32AFFF', type: '开关状态', content: '支路空开已断开', time: '2026-04-11 05:45:12', status: 'resolved', statusText: '已处理' }
]);
</script>

<style scoped>
/* 1. 顶部 Antd 组件通用深色样式 */
:deep(.custom-dark-select .ant-select-selector),
:deep(.custom-dark-input),
:deep(.custom-dark-range-picker) {
  background-color: transparent !important;
  border: 1px solid #FFFFFF1A !important;
  color: #FFFFFF !important;
  border-radius: 4px !important;
}

:deep(.custom-dark-input::placeholder) {
  color: #FFFFFF44 !important;
}

:deep(.ant-select-arrow), :deep(.ant-picker-suffix) {
  color: #FFFFFF66 !important;
}

/* 2. Range Picker 内部文字颜色 */
:deep(.custom-dark-range-picker .ant-picker-input > input) {
  color: #FFFFFF !important;
}
:deep(.custom-dark-range-picker .ant-picker-range-separator) {
  color: #FFFFFF66 !important;
}

/* 3. 分页器深色适配 */
:deep(.custom-dark-pagination .ant-pagination-item),
:deep(.custom-dark-pagination .ant-pagination-prev),
:deep(.custom-dark-pagination .ant-pagination-next) {
  background-color: transparent !important;
  border-color: #FFFFFF1A !important;
}
:deep(.custom-dark-pagination .ant-pagination-item a) {
  color: #FFFFFF99 !important;
}
:deep(.custom-dark-pagination .ant-pagination-item-active) {
  border-color: #32AFFF !important;
  background-color: #32AFFF20 !important;
}
:deep(.custom-dark-pagination .ant-pagination-item-active a) {
  color: #32AFFF !important;
}

/* 4. 下拉面板全局样式（必须是全局或者 :global） */
:global(.custom-dark-datepicker-dropdown) {
  background-color: #032748 !important;
  border: 1px solid #1C3E73 !important;
}
:global(.ant-picker-panel-container) {
  background: #032748 !important;
}
:global(.ant-picker-content th, .ant-picker-content td, .ant-picker-header, .ant-picker-header button) {
  color: #FFFFFF !important;
}

/* 5. 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #FFFFFF1A;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #FFFFFF33;
}
</style>