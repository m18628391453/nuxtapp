<template>
  <div class="flex w-full h-full p-4 gap-4 box-border overflow-hidden bg-transparent text-white font-sans">
    <!-- 左侧区域 -->
    <div class="flex-1 flex flex-col gap-4 h-full min-w-[500px]">
      <!-- 上部：动态厂区视图 -->
      <PlantView class="flex-1" />
      <!-- 下部：能源供需平衡分析 -->
      <BalanceChart class="max-h-[340px] h-[340px] shrink-0 mb-5" />
    </div>

    <!-- 右侧区域（固定420px宽度） -->
    <div class="min-w-[420px] max-w-[420px] flex flex-col h-full shrink-0 gap-4">
      <!-- 模式切换 -->
      <OperationMode title="模式切换" modeText="自动模式" />
      
      <!-- 电价信息 -->
      <div class="flex-[8] -mt-1">
        <ElectricityPrice class="min-h-[150px]" />
      </div>

      <!-- 出力情况折线图 -->
      <div class="flex-[10] -mt-8">
        <LineBarChart 
          title="出力情况"
          :barData="[]"
          :lineData="[320, 280, 300, 260, 310, 290, 270, 250, 260, 280, 270, 260]"
          :lineXAxisData="['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']"
          :yAxisMax="350"
          :yAxisInterval="50"
          :buttons="[]"
          class="flex-1 min-h-[160px]"
        />
      </div>
      
      <!-- 负荷运行情况折线图 -->
      <div class="flex-[10] -mt-6">
        <LineBarChart 
          title="负荷运行情况"
          :barData="[]"
          :lineData="[280, 250, 270, 300, 260, 290, 250, 270, 240, 260, 250, 240]"
          :lineXAxisData="['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']"
          :yAxisMax="350"
          :yAxisInterval="50"
          :buttons="[]"
          lineColor="#10B981"
          :lineAreaColor="['rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.0)']"
          class="flex-1 min-h-[160px]"
        />
      </div>
      
    </div>
  </div>
</template>
<script setup>
import PlantView from '@/components/dashboard/PlantView.vue';
import BalanceChart from '@/components/chart/BalanceChart.vue';
import LineBarChart from '@/components/chart/LineBarChart.vue';
import OperationMode from '@/components/dashboard/OperationMode.vue';
import ElectricityPrice from '@/components/dashboard/ElectricityPrice.vue';

definePageMeta({
  layout: 'layout'
})
</script>