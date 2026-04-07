<template>
  <div class="grid grid-cols-6 gap-1 w-full pt-1">
    <div v-for="(item, idx) in metrics" :key="idx" class="flex flex-col justify-center py-1">
      <!-- 标题容器：相对定位，用于悬浮提示 -->
      <div class="relative w-full mb-1 group">
        <p class="w-full" 
           style="font-family: Microsoft YaHei; font-weight: 400; font-size: 11px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: default;">
          {{ item.title }}
        </p>
        <!-- 自定义悬浮提示气泡 -->
        <div v-if="layoutMode === 'sidebar'" class="absolute -bottom-1 left-0 mb-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style="font-family: Microsoft YaHei;cursor: default;">
          {{ item.title }}
        </div>
      </div>
      <div class="mb-1">
        <span class="text-[26px] font-semibold font-mono tracking-wider leading-none text-[#32AFFF]" :style="{ textShadow: '0 0 10px rgba(34,211,238,0.3)' }">
          {{ item.value }}
        </span>
      </div>
      <div class="flex items-center gap-1 text-[10px]">
        <span :class="`font-semibold ${item.arrowColor}`">{{ item.change }}</span>
        <span class="text-gray-500">{{ item.vs }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义 props，接收外部传入的指标数据
const props = defineProps({
  // 指标数据数组
  metricsData: {
    type: Array,
    required: false,
    default: () => []
  }
})

// 从父组件注入状态和方法
const layoutState = inject('layoutState')
const { layoutMode } = layoutState

// 默认指标数据（保持原有样式和功能不变）
const defaultMetrics = []

// 计算最终使用的 metrics：优先使用外部传入的数据，否则使用默认数据
const metrics = computed(() => {
  if (props.metricsData && props.metricsData.length > 0) {
    return props.metricsData
  }
  return defaultMetrics
})
</script>