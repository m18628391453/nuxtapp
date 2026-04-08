<template>
  <!-- 外层加容器，控制整体左右边距，完全贴合设计稿 -->
  <div class="w-full px-8 py-1">
    <!-- 内层flex布局，根据指标数量自动调整 -->
    <div class="flex w-full items-center " :style="layoutStyle">
      <div v-for="(item, idx) in metrics" :key="idx" class="flex flex-col justify-center py-1" :style="itemStyle">
        <!-- 标题容器：相对定位，用于悬浮提示，完全保留原有功能 -->
        <div class="relative w-full mb-1 group">
          <p class="w-full"
            style="font-family: Microsoft YaHei; font-weight: 400; font-size: 11px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: default;">
            {{ item.title }}
          </p>
          <!-- 自定义悬浮提示气泡，sidebar模式兼容完全保留 -->
          <div v-if="layoutMode === 'sidebar'"
            class="absolute -bottom-1 left-0 mb-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            style="font-family: Microsoft YaHei;cursor: default;">
            {{ item.title }}
          </div>
        </div>
        <!-- 数值展示，原有样式、字体、发光效果完全不变 -->
        <div class="mb-1">
          <span class="text-[26px] font-semibold font-mono tracking-wider leading-none text-[#32AFFF]"
            :style="{ textShadow: '0 0 10px rgba(34,211,238,0.3)' }">
            {{ item.value }}
          </span>
        </div>
        <!-- 变化率区域，原有样式完全不变 -->
        <div class="flex items-center gap-1 text-[10px]" :class="metrics.length < 6 ? 'justify-center' : ''">
          <span :class="`font-semibold ${item.arrowColor}`">{{ item.change }}</span>
          <span class="text-gray-500">{{ item.vs }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  metricsData: {
    type: Array,
    required: false,
    default: () => []
  }
})

const layoutState = inject('layoutState')
const { layoutMode } = layoutState

const defaultMetrics = []

const metrics = computed(() => {
  if (props.metricsData && props.metricsData.length > 0) {
    return props.metricsData
  }
  return defaultMetrics
})

// 核心：动态布局样式，根据指标数量自动调整，同时保证左右留白
const layoutStyle = computed(() => {
  const count = metrics.value.length
  switch (count) {
    // 6个指标时：两端对齐，和原有grid效果完全一致，左右留白保留
    case 6:
      return {
        justifyContent: 'space-between',
        gap: '0.25rem',
      }
    // 5个指标时：居中，间隙适中
    case 5:
      return {
        justifyContent: 'center',
        gap: '0.75rem',
      }
    // 4个指标时：居中，间隙放大，完全贴合设计稿
    case 4:
      return {
        justifyContent: 'center',
        gap: '1.75rem',
        width: '75%',
        margin: 'auto',
      }
    // 其他数量（1/2/3个）：居中，间隙自适应
    default:
      return {
        justifyContent: 'center',
        gap: '4rem',
      }
  }
})

// 核心：每个指标项的动态样式，保证不同数量下的展示效果
const itemStyle = computed(() => {
  const count = metrics.value.length
  // 6个指标时：完全沿用原有等宽左对齐，和之前效果一模一样
  if (count === 6) {
    return {
      flex: '1',
      minWidth: '0',
      maxWidth: 'none',
      textAlign: 'left',
    }
  }
  // 少于6个指标时：固定最小宽度，内容居中，视觉更协调
  else {
    return {
      flex: 'none',
      minWidth: '150px',
      textAlign: 'center',
    }
  }
})
</script>