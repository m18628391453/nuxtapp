<template>
  <div class="load-dashboard w-full h-screen bg-transparent text-white font-sans flex flex-col relative z-0 overflow-hidden">
    <div class="relative z-10 flex flex-col h-full p-4 gap-2">
      <!-- 顶部指标卡片（保留原有代码，仅调整布局类） -->
      <div class="flex gap-2 h-[90px] shrink-0 w-full mb-2">
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #428EF4 0%, #3859E8 100%); border-radius: 2px;">
          <img src="/image/power_icon.png" alt="发电量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">发电量(MWh)</span>
            <span class="metric-values mb-0.5">38,642.50</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #6C6AFF 0%, #4D27D5 100%); border-radius: 2px;">
          <img src="/image/certificate_icon.png" alt="理论绿证签发量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">理论绿证签发量(万张)</span>
            <span class="metric-values mb-0.5">126,814</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #65C7F8 0%, #4491E2 100%); border-radius: 2px;">
          <img src="/image/issued_icon.png" alt="实际绿证签发量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">实际绿证签发量(万张)</span>
            <span class="metric-values mb-0.5">12,380</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #52A9DE 0%, #6CDDB1 100%); border-radius: 2px;">
          <img src="/image/transaction_icon.png" alt="实际绿证交易量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">实际绿证交易量(万张)</span>
            <span class="metric-values mb-0.5">25,623</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(0deg, #EF898B 0%, #F2CA69 100%); border-radius: 2px;">
          <img src="/image/tradable_icon.png" alt="可交易绿证数量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">可交易绿证数量(万张)</span>
            <span class="metric-values mb-0.5">18,243</span>
          </div>
        </div>
        <div class="flex-1 flex items-center gap-4 px-4 relative overflow-hidden" style="background: linear-gradient(180deg, #5B64FF 0%, #353DD4 100%); border-radius: 2px;">
          <img src="/image/pending_icon.png" alt="待签发绿证数量" class="w-10 h-10 z-10 -ml-1" onerror="this.style.display='none'" />
          <div class="flex flex-col justify-center z-10">
            <span class="metric-title mb-0.5">待签发绿证数量(万张)</span>
            <span class="metric-values mb-0.5">12,332</span>
          </div>
        </div>
      </div>

      <!-- 中间图表区域（2x2，参照smldaydata的flex等高布局，去掉固定宽度） -->
      <div class="flex-[1] flex flex-col gap-2 min-h-0">
        <div class="grid grid-cols-2 grid-rows-2 gap-2 h-full">
          <!-- 图表1：发电量 -->
          <div class="chart-card flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
              <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">发电量</h3>
            </div>
            <div class="flex-1 w-full min-h-0">
              <VueECharts :option="powerOption" autoresize />
            </div>
          </div>

          <!-- 图表2：绿电交易进度 -->
          <div class="chart-card flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
              <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">绿电交易进度</h3>
              <div class="flex items-center gap-4 text-[10px] text-[#9CA3AF] z-10">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#10B981]"></span> 发电量(MWh)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#38BDF8]"></span> 绿电交易量(MWh)</span>
              </div>
            </div>
            <div class="flex-1 w-full min-h-0">
              <VueECharts :option="greenPowerOption" autoresize />
            </div>
          </div>

          <!-- 图表3：绿证签发进度 -->
          <div class="chart-card flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
              <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">绿证签发进度</h3>
              <div class="flex items-center gap-4 text-[10px] text-[#9CA3AF] z-10">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#10B981]"></span> 实际绿证签发量(万张)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#38BDF8]"></span> 待签发绿证(万张)</span>
              </div>
            </div>
            <div class="flex-1 w-full min-h-0">
              <VueECharts :option="certIssueOption" autoresize />
            </div>
          </div>

          <!-- 图表4：绿证交易进度 -->
          <div class="chart-card flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
              <h3 class="text-[14px] font-bold text-white ml-1.5 leading-none z-10">绿证交易进度</h3>
              <div class="flex items-center gap-4 text-[10px] text-[#9CA3AF] z-10">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#10B981]"></span> 实际绿证签发量(万张)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#3B82F6]"></span> 实际绿证交易量(万张)</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-[#67E8F9]"></span> 剩余可交易绿证(万张)</span>
              </div>
            </div>
            <div class="flex-1 w-full min-h-0">
              <VueECharts :option="certTradeOption" autoresize />
            </div>
          </div>
        </div>
      </div>

      <!-- 下部表格区域（与中间区域等高，表格内容滚动，分页固定底部） -->
      <div class="table-panel flex-[1] flex flex-col gap-2 min-h-0 mb-20">
        <!-- 搜索栏 -->
        <div class="flex items-center gap-4 mb-2 shrink-0">
          <div class="flex items-center gap-2 ">
            <label class="text-[12px] text-[#9CA3AF] whitespace-nowrap">项目名称:</label>
            <a-input v-model:value="projectName" placeholder="请输入" class="custom-dark-input w-[180px] min-w-[180px]" />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-[12px] text-[#9CA3AF] whitespace-nowrap">负责单位:</label>
            <a-select v-model:value="department" class="custom-dark-select w-[180px] min-w-[180px]"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode">
              <a-select-option value="">请选择</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-[12px] text-[#9CA3AF] whitespace-nowrap">建档立卡状态:</label>
            <a-select v-model:value="filingStatus" class="custom-dark-select w-[180px] min-w-[180px]"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode">
              <a-select-option value="">请选择</a-select-option>
            </a-select>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-[12px] text-[#9CA3AF] whitespace-nowrap">账户持有状态:</label>
            <a-select v-model:value="accountStatus" class="custom-dark-select w-[180px] min-w-[180px]"
              :getPopupContainer="(triggerNode) => triggerNode.parentNode">
              <a-select-option value="">请选择</a-select-option>
            </a-select>
          </div>
          <div class="flex-1"></div>
          <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80 w-[64px] min-w-[64px]">新增</a-button>
          <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30] w-[64px] min-w-[64px]">导出</a-button>
        </div>

        <!-- 表格容器（核心改造：flex-col + 内容滚动 + 分页固定底部） -->
        <div class="flex-1 bg-[#0A162C]/10 rounded overflow-hidden flex flex-col min-h-0">
          <!-- 表格内容区域（可滚动） -->
          <div class="flex-1 py-2 overflow-auto min-h-0">
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :row-key="(record) => record.projectCode"
              :scroll="{ x: '100%', y: '100%' }"
              class="custom-dark-table border border-[#FFFFFF1F]"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <button class="text-[#32AFFF] hover:text-cyan-300 mr-2">查看</button>
                  <button class="text-[#FAAD14] hover:text-yellow-300 mr-2">编辑</button>
                  <button class="text-[#FF4D4F] hover:text-red-300">删除</button>
                </template>
              </template>
            </a-table>
          </div>

          <!-- 分页栏（固定在底部） -->
          <div class="shrink-0 h-[40px] py-4 px-2 border-t border-[#FFFFFF1F] flex items-center justify-end">
            <a-pagination
              :total="pagination.total"
              :current="pagination.current"
              :page-size="pagination.pageSize"
              :show-size-changer="pagination.showSizeChanger"
              :page-size-options="pagination.pageSizeOptions"
              :show-quick-jumper="pagination.showQuickJumper"
              :show-total="(total) => `共 ${total} 条数据`"
              :size="pagination.size"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
              class="!text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'

definePageMeta({
  layout: 'layout'
})

// 搜索栏绑定变量
const projectName = ref('')
const department = ref('')
const filingStatus = ref('')
const accountStatus = ref('')

// 表格列定义
const columns = [
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', align: 'left' },
  { title: '项目编码', dataIndex: 'projectCode', key: 'projectCode', align: 'left' },
  { title: '负责单位', dataIndex: 'department', key: 'department', align: 'left' },
  { title: '时间', dataIndex: 'time', key: 'time', align: 'left' },
  { title: '资产操作', dataIndex: 'operation', key: 'operation', align: 'left' },
  { title: '操作数量', dataIndex: 'quantity', key: 'quantity', align: 'left' },
  { title: '单位', dataIndex: 'unit', key: 'unit', align: 'left' },
  { title: '操作', key: 'action', align: 'center' }
]

// 表格数据
const tableData = ref([
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' },
  { projectName: '通威天门沉湖500MW光伏电站', projectCode: 'PPC202039', department: '天门通力渔光科技有限公司', time: '2023-06-29', operation: '绿电出售', quantity: 2392, unit: 'MWh' }
])

// 分页配置
const pagination = reactive({
  total: 200,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  size: 'small'
})

// 分页事件处理
const handlePageChange = (page) => {
  pagination.current = page
}

const handleSizeChange = (current, size) => {
  pagination.pageSize = size
  pagination.current = current
}

const commonTooltip = {
  trigger: 'axis',
  axisPointer: { type: 'shadow' },
  backgroundColor: 'rgba(5, 13, 29, 0.95)',
  borderColor: '#1A2A4A',
  borderWidth: 1,
  textStyle: { color: '#fff', fontSize: 11 },
  confine: true
}

const commonGrid = {
  top: 15,
  right: 10,
  bottom: 5,
  left: 25,
  containLabel: true
}

const commonXAxis = {
  type: 'category',
  data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'],
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: '#9CA3AF', fontSize: 10, margin: 12, fontFamily: 'monospace' }
}

const commonYAxis = {
  type: 'value',
  min: 0,
  max: 6000,
  interval: 1000,
  splitLine: {
    lineStyle: { color: 'rgba(75, 85, 99, 0.3)', type: 'dashed' }
  },
  axisLabel: { color: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }
}

const powerOption = {
  tooltip: commonTooltip,
  grid: commonGrid,
  xAxis: commonXAxis,
  yAxis: commonYAxis,
  series: [
    {
      name: '发电量',
      type: 'bar',
      barWidth: 14,
      showBackground: true,
      backgroundStyle: { color: 'rgba(255,255,255,0.05)', borderRadius: 2 },
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0, color: '#10B981' },
          { offset: 1, color: '#34D399' }
        ])
      },
      data: [4500, 4400, 3000, 2900, 4500, 3000, 3000, 4400, 3000, 4400, 4400, 3000]
    }
  ]
}

const greenPowerOption = {
  tooltip: commonTooltip,
  legend: { show: false },
  grid: commonGrid,
  xAxis: commonXAxis,
  yAxis: commonYAxis,
  series: [
    {
      name: '发电量',
      type: 'bar',
      barWidth: 12,
      barGap: '20%',
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#10B981' },
      data: [3500, 3500, 2500, 2500, 3500, 3500, 2500, 2500, 2500, 3500, 3500, 2500]
    },
    {
      name: '绿电交易量',
      type: 'bar',
      barWidth: 12,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#38BDF8' },
      data: [4800, 4800, 4800, 3500, 4800, 4800, 3500, 4800, 3500, 3500, 3500, 4800]
    }
  ]
}

const certIssueOption = {
  tooltip: commonTooltip,
  legend: { show: false },
  grid: commonGrid,
  xAxis: commonXAxis,
  yAxis: commonYAxis,
  series: [
    {
      name: '实际绿证签发量',
      type: 'bar',
      stack: 'Total',
      barWidth: 14,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#10B981' },
      data: [3000, 2400, 3000, 1800, 2400, 1800, 1500, 1500, 1900, 900, 1200, 2800]
    },
    {
      name: '待签发绿证',
      type: 'bar',
      stack: 'Total',
      barWidth: 14,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#38BDF8' },
      data: [2600, 2300, 2600, 1900, 2300, 1800, 1600, 1600, 1900, 1400, 1500, 2500]
    }
  ]
}

const certTradeOption = {
  tooltip: commonTooltip,
  legend: { show: false },
  grid: commonGrid,
  xAxis: commonXAxis,
  yAxis: commonYAxis,
  series: [
    {
      name: '实际绿证签发量',
      type: 'bar',
      stack: 'Total',
      barWidth: 14,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#10B981' },
      data: [5200, 4000, 5200, 3000, 4000, 2900, 2400, 2500, 1500, 2000, 4800, 4900]
    },
    {
      name: '实际绿证交易量',
      type: 'bar',
      stack: 'Total',
      barWidth: 14,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#3B82F6' },
      data: [3100, 2500, 3100, 2500, 2500, 1800, 1800, 1600, 1000, 1300, 2900, 3000]
    },
    {
      name: '剩余可交易绿证',
      type: 'bar',
      stack: 'Total',
      barWidth: 14,
      itemStyle: { borderRadius: [2, 2, 0, 0], color: '#67E8F9' },
      data: [2100, 1500, 2100, 1500, 1500, 1100, 1100, 800, 500, 700, 1900, 2000]
    }
  ]
}
</script>

<style scoped>
@import url(@/assets/css/antd.css);

.chart-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 12px;
}

.table-panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 16px 16px 2px 16px;
  margin-inline: 0px;
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
  font-size: 24px;
  color: #FFFFFF;
  line-height: 1.2;
}
</style>