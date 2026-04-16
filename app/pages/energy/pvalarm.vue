<template>
  <div class="w-full h-full min-h-screen bg-transparent flex flex-col p-4 font-sans text-white gap-4 box-border">
    <div class="grid grid-cols-5 gap-2 h-[72px] shrink-0">
      <div v-for="(card, index) in summaryCards" :key="index"
        @click="activeCard = index"
        :class="['bg-[#32AFFF2A] border border-[#32AFFF2F] rounded p-4 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:border-[#32AFFF4F] hover:shadow-[0_0_14px_rgba(50,175,255,0.5)] cursor-pointer', activeCard === index ? 'shadow-[0_0_12px_rgba(50,175,255,0.5)] border-[#32AFFF4F]' : '']">
        <div class="w-15 h-15 flex items-center justify-center shrink-0 ml-2">
          <img :src="`/image/${card.icon}`" :alt="card.title" class="w-8" />
        </div>
        <div class="flex flex-col">
          <span class="text-[12px] text-[#FFFFFF99]">{{ card.title }}</span>
          <span class="text-[22px] metric-value">{{ card.value }}</span>
        </div>
        <div class="absolute inset-0 border-2 border-[#32AFFF] rounded opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
    <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 flex flex-col gap-4 shrink-0">
      <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">设备名称:</span>
          <a-input v-model:value="deviceName" placeholder="请输入" class="custom-dark-input w-full" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">设备类型:</span>
          <a-select v-model:value="filterType" class="custom-dark-select w-full"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode">
            <a-select-option value="all">全部设备</a-select-option>
            <a-select-option value="inverter">逆变器</a-select-option>
            <a-select-option value="combiner">汇流箱</a-select-option>
          </a-select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">发生时间:</span>
          <a-date-picker v-model:value="searchDate" class="custom-dark-datepicker w-full"
            placeholder="请选择日期"
            dropdownClassName="custom-dark-datepicker-dropdown"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">告警等级:</span>
          <a-select v-model:value="filterLevel" class="custom-dark-select w-full"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode">
            <a-select-option value="all">全部级别</a-select-option>
            <a-select-option value="fatal">严重</a-select-option>
            <a-select-option value="major">重要</a-select-option>
          </a-select>
        </div>
        <div class="flex justify-end gap-2 min-w-[180px]">
          <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80 w-[64px] min-w-[64px]">查询</a-button>
          <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30] w-[64px] min-w-[64px]">重置</a-button>
        </div>
      </div>
      <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-center">
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">告警名称:</span>
          <a-select v-model:value="alarmName" class="custom-dark-select w-full"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode">
            <a-select-option value="all">全部告警</a-select-option>
          </a-select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[14px] text-[#FFFFFF99] whitespace-nowrap">恢复状态:</span>
          <a-select v-model:value="recoveryStatus" class="custom-dark-select w-full"
            :getPopupContainer="(triggerNode) => triggerNode.parentNode">
            <a-select-option value="all">全部状态</a-select-option>
            <a-select-option value="unhandled">未恢复</a-select-option>
            <a-select-option value="resolved">已恢复</a-select-option>
          </a-select>
        </div>
        <div class="flex items-center gap-2"></div>
        <div class="flex items-center gap-2"></div>
        <div class="flex justify-end gap-2 min-w-[180px] opacity-0 pointer-events-none">
          <div class="w-[64px]"></div>
          <div class="w-[64px]"></div>
        </div>
      </div>
    </div>
    <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] flex flex-col min-h-0 overflow-hidden">
      
      <div class="flex justify-between items-center px-6 py-2 border-b border-[#FFFFFF14] shrink-0">
        <div class="flex items-center gap-8">
          <span class="text-[14px] font-normal text-white tracking-wide">告警列表</span>
          <div class="flex items-center gap-2 cursor-pointer select-none">
             <a-checkbox v-model:checked="autoRefresh" class="custom-dark-checkbox">
               <span class="text-[#FFFFFFC0] text-[14px] ml-1">自动刷新</span>
             </a-checkbox>
          </div>
        </div>
        <button class="text-[#FFFFFF80] hover:text-[#32AFFF] transition-all duration-300 cursor-pointer">
          <Settings :size="18" stroke-width="2" />
        </button>
      </div>
      <div class="flex-1 overflow-hidden flex flex-col p-2 pb-0 custom-table-container">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :pagination="paginationConfig"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ y: 'calc(100vh - 460px)' }"
          class="custom-dark-table border border-[#FFFFFF1F]"
          row-key="id"
        >
          <template #bodyCell="{ column, text, record, index }">
            <template v-if="column.key === 'index'">
              <span class="text-[#FFFFFF60] text-[14px]">{{ index + 1 }}</span>
            </template>
            
            <template v-else-if="column.key === 'alarmLevel'">
              <span :class="['text-[14px]', text === '重要' ? 'text-[#FF4D4F]' : 'text-[#32AFFF]']">
                {{ text }}
              </span>
            </template>
            
            <template v-else-if="column.key === 'deviceName'">
              <span class="text-[#32AFFF] text-[14px] cursor-pointer hover:underline">{{ text }}</span>
            </template>
            <template v-else>
              <span class="text-[#FFFFFFCC] text-[14px]">{{ text }}</span>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import { Settings } from 'lucide-vue-next';
definePageMeta({ layout: 'layout' })
const activeCard = ref(0);
const autoRefresh = ref(false);
const selectedRowKeys = ref([4]); // 模拟设计稿选中第4行
const summaryCards = ref([
  { title: '停机告警(台)', value: '200', icon: 'switch.png' },
  { title: '安全告警(台)', value: '620', icon: 'warnning.png' },
  { title: '电量告警(台)', value: '4000', icon: 'record.png' },
  { title: '通讯告警(台)', value: '60', icon: 'offline.png' },
  { title: '其他告警(台)', value: '4000', icon: 'alarm.png' }
]);
const onSelectChange = (keys) => { selectedRowKeys.value = keys; };
// ---- 表格配置 ----
const columns = [
  { title: '序号', key: 'index', width: 80, align: 'center' },
  { title: '设备类型', dataIndex: 'deviceType', align: 'center' },
  { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', align: 'center' },
  { title: '告警名称', dataIndex: 'alarmName', align: 'center' },
  { title: '告警等级', dataIndex: 'alarmLevel', key: 'alarmLevel', align: 'center' },
  { title: '告警类型', dataIndex: 'alarmType', align: 'center' },
  { title: '发生时间', dataIndex: 'occurTime', align: 'center', width: 180 },
  { title: '告警时长(h)', dataIndex: 'duration', align: 'center' },
  { title: '恢复时间', dataIndex: 'recoverTime', align: 'center', width: 180 }
];
const tableData = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  deviceType: i < 8 ? '光伏设备' : (i < 10 ? '升压站设备' : '储能设备'),
  deviceName: 'N1-1',
  alarmName: i < 6 ? '绝缘阻抗低' : (i < 9 ? '残余电流异常' : '外部风扇异常'),
  alarmLevel: i < 7 ? '一般' : '重要',
  alarmType: i < 7 ? '电量告警' : '安全告警',
  occurTime: '2023-06-28 10:44:06',
  duration: '5.49',
  recoverTime: '2023-06-29 16:22:06'
})));
const paginationConfig = ref({
  total: 200,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共${total}条数据`,
  size: 'small'
});
</script>
<style scoped>
@import url(@/assets/css/antd.css);
.metric-value {
  font-family: 'DIN Alternate', 'Source Han Sans CN';
  font-size: 24px;
}
</style>