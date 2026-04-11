<template>
  <div class="w-full h-full min-h-screen bg-transparent flex flex-col p-4 font-sans text-white gap-4 box-border">

    <!-- 只修改了这部分顶部指标栏 -->
    <div class="grid grid-cols-5 gap-2 h-[72px] shrink-0">
      <div v-for="(card, index) in summaryCards" :key="index"
        class="bg-[#32AFFF2A] border border-[#32AFFF2F] rounded p-4 flex items-center gap-4 relative overflow-hidden transition-all duration-300 hover:border-[#32AFFF3F] hover:shadow-[0_0_15px_rgba(50,175,255,0.3)] cursor-pointer">
        <div class="w-12 h-12 flex items-center justify-center shrink-0">
          <component :is="card.icon" class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <span class="text-[12px] text-[#FFFFFF99]">{{ card.title }}</span>
          <span class="text-[22px] metric-value">{{ card.value }}</span>
        </div>
        <!-- 卡片发光效果 -->
        <div
          class="absolute inset-0 border-2 border-[#32AFFF] rounded opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none">
        </div>
      </div>
    </div>

    <!-- 下面的筛选栏、表格、分页都保持原样不动 -->
    <div class="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-[4px] p-4 flex flex-wrap items-center gap-4 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">选择日期:</span>
        <a-range-picker v-model:value="searchDate" class="custom-dark-range-picker"
          dropdownClassName="custom-dark-datepicker-dropdown"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode" />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">告警级别:</span>
        <a-select v-model:value="filterLevel" class="custom-dark-select" style="width: 120px;"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode">
          <a-select-option value="all">全部级别</a-select-option>
          <a-select-option value="fatal">严重</a-select-option>
          <a-select-option value="major">重要</a-select-option>
        </a-select>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[14px] text-[#FFFFFF99]">设备类型:</span>
        <a-select v-model:value="filterType" class="custom-dark-select" style="width: 140px;"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode">
          <a-select-option value="all">全部设备</a-select-option>
          <a-select-option value="inverter">逆变器</a-select-option>
          <a-select-option value="combiner">汇流箱</a-select-option>
        </a-select>
      </div>
      <div class="flex-1 min-w-[200px]">
        <a-input v-model:value="searchKey" placeholder="请输入搜索内容" class="custom-dark-input">
          <template #prefix>
            <svg class="w-4 h-4 text-[#FFFFFF66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </a-input>
      </div>
      <div class="flex gap-2">
        <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80">查询</a-button>
        <a-button
          class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-white">重置</a-button>
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

// 图标组件（新增用于顶部卡片）
const PowerIcon = () => null;
const ShieldIcon = () => null;
const BatteryIcon = () => null;
const WifiIcon = () => null;
const BellIcon = () => null;

// 顶部卡片数据（修改为5个，符合设计稿）
const summaryCards = ref([
  { title: '停机告警(台)', value: '200', icon: PowerIcon },
  { title: '安全告警(台)', value: '620', icon: ShieldIcon },
  { title: '电量告警(台)', value: '4000', icon: BatteryIcon },
  { title: '通讯告警(台)', value: '60', icon: WifiIcon },
  { title: '其他告警(台)', value: '4000', icon: BellIcon }
]);

// 下面的所有数据和逻辑都保持原样不动
const searchDate = ref([]);
const filterLevel = ref('all');
const filterType = ref('all');
const searchKey = ref('');
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
.metric-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22px;
  color: #FFFFFF;
  line-height: 30px;
}
</style>