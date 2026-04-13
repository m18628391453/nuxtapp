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

    <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] flex flex-col min-h-0">
      <div class="flex border-b border-[#FFFFFF1A] shrink-0">
        <button v-for="tab in tabs" :key="tab.key" @click="currentTab = tab.key"
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
                <span class="px-2 py-0.5 rounded-[2px] text-[11px]"
                  :style="{ backgroundColor: item.levelColor + '20', color: item.levelColor, border: '1px solid ' + item.levelColor + '40' }">
                  {{ item.levelText }}
                </span>
              </td>
              <td class="py-4 text-[#FFFFFF99]">{{ item.type }}</td>
              <td class="py-4 text-[#E5E7EB]">{{ item.content }}</td>
              <td class="py-4 text-[#FFFFFF99]">{{ item.time }}</td>
              <td class="py-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="item.status === 'unhandled' ? 'bg-[#FF4D4F]' : 'bg-[#00FA9A]'"></span>
                  <span :class="item.status === 'unhandled' ? 'text-[#FF4D4F]' : 'text-[#00FA9A]'">{{ item.statusText
                    }}</span>
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
        <a-pagination size="small" :total="totalCount" :show-size-changer="false" class="custom-dark-pagination" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';

definePageMeta({ layout: 'layout' })

const activeCard = ref(0);
const summaryCards = ref([
  { title: '停机告警(台)', value: '200', icon: 'switch.png' },
  { title: '安全告警(台)', value: '620', icon: 'warnning.png' },
  { title: '电量告警(台)', value: '4000', icon: 'record.png' },
  { title: '通讯告警(台)', value: '60', icon: 'offline.png' },
  { title: '其他告警(台)', value: '4000', icon: 'alarm.png' }
]);

const searchDate = ref(null);
const filterLevel = ref('all');
const filterType = ref('all');
const deviceName = ref('');
const alarmName = ref('all');
const recoveryStatus = ref('all');

const currentTab = ref('all');
const tabs = [
  { label: '全部告警', key: 'all' },
  { label: '待处理', key: 'pending' },
  { label: '已处理', key: 'resolved' }
];
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
@import url(../../assets/css/antd.css);

/* 核心优化：统一边框颜色为微透蓝，降低白色突兀感 */
:deep(.custom-dark-input),
:deep(.custom-dark-select .ant-select-selector),
:deep(.ant-picker.custom-dark-datepicker) { /* 这里的选择器专门强化了 DatePicker */
  background-color: transparent !important;
  border: 1px solid rgba(50, 175, 255, 0.25) !important; /* 统一使用微透蓝边框 */
  color: #ffffff !important;
  border-radius: 4px;
  transition: all 0.3s;
}

/* 统一悬浮效果 */
:deep(.custom-dark-input:hover),
:deep(.custom-dark-select:hover .ant-select-selector),
:deep(.ant-picker.custom-dark-datepicker:hover) {
  border-color: rgba(50, 175, 255, 0.6) !important;
}

/* 统一焦点效果 */
:deep(.custom-dark-input:focus),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused) {
  border-color: #32AFFF !important;
  box-shadow: 0 0 4px rgba(50, 175, 255, 0.2) !important;
}

:deep(.ant-select-arrow), :deep(.ant-picker-suffix) {
  color: rgba(255, 255, 255, 0.45) !important;
}

:deep(.ant-input::placeholder),
:deep(.ant-select-selection-placeholder),
:deep(.ant-picker-input input::placeholder) {
  color: rgba(255, 255, 255, 0.35) !important;
}

:deep(.ant-picker-input > input) {
  color: #fff !important;
}

.metric-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22px;
  color: #FFFFFF;
  line-height: 30px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>