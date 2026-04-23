<template>
  <a-dropdown 
    v-model:open="dropdownOpen" 
    trigger="click" 
    placement="bottomLeft"
    :overlay-style="{ minWidth: width }"
  >
    <!-- 下拉触发器 -->
    <template #overlay>
      <div class="custom-tree-dropdown-wrapper" :class="`theme-${theme}`" :style="{ width: width }">
        <a-tree
          v-model:expandedKeys="expandedKeys"
          :tree-data="treeData"
          :show-icon="false"
          :block-node="true"
          @select="handleTreeSelect"
          class="custom-tree"
        >
          <template #title="{ title, name }">
            <span class="text-[13px]">{{ title || name }}</span>
          </template>
        </a-tree>
      </div>
    </template>

    <!-- 选择框显示区域 -->
    <div 
      class="custom-tree-select-trigger" 
      :class="{ 'trigger-focused': isFocused, [`theme-${theme}`]: true }"
      tabindex="0"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="dropdownOpen = !dropdownOpen"
    >
      <span v-if="selectedTitle" class="trigger-text">{{ selectedTitle }}</span>
      <span v-else class="trigger-placeholder">{{ placeholder }}</span>
      <svg 
        class="trigger-arrow" 
        :class="{ 'rotate-180': dropdownOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </a-dropdown>
</template>

<script setup>
import { ref } from 'vue'

// 组件 Props 定义
const props = defineProps({
  /** 树数据源 */
  treeData: {
    type: Array,
    default: () => []
  },
  /** 占位符文本 */
  placeholder: {
    type: String,
    default: '请选择'
  },
  /** 绑定的值 */
  modelValue: {
    type: String,
    default: ''
  },
  /** 初始化方法 */
  initMethod: {
    type: Function,
    default: null
  },
  /** 主题模式：dark 或 light */
  theme: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  },
  /** 下拉树宽度 */
  width: {
    type: String,
    default: '200px'
  }
})

// 组件事件定义
const emit = defineEmits(['select', 'update:modelValue'])

// 内部状态
const dropdownOpen = ref(false)
const expandedKeys = ref([])
const selectedTitle = ref(props.modelValue)
const isFocused = ref(false)

/**
 * 处理 focus 事件
 */
const handleFocus = () => {
  isFocused.value = true
}

/**
 * 处理 blur 事件
 */
const handleBlur = () => {
  isFocused.value = false
}

/**
 * 树节点选择事件处理
 */
const handleTreeSelect = (selectedKeys, info) => {
  if (info.selected && info.node) {
    // 更新显示的标题
    selectedTitle.value = info.node.title || info.node.name // 兼容 title/name 字段
    // 暴露选中节点给父组件
    emit('select', info.node)
    // 触发 modelValue 更新 - 关键修改：传递完整的显示值（title 或 name）
    emit('update:modelValue', info.node.title || info.node.name)
    // 点击后收起下拉
    dropdownOpen.value = false
  }
}

// 监听 modelValue 变化
import { watch } from 'vue'
watch(
  () => props.modelValue,
  (newValue) => {
    selectedTitle.value = newValue
  }
)

/**
 * 暴露给父组件的方法：清空选择
 */
defineExpose({
  clearSelection: () => {
    selectedTitle.value = ''
  },
  /**
   * 初始化方法：打开下拉并加载数据
   */
  init: async () => {
    // 先调用父组件传递的初始化方法
    if (props.initMethod) {
      await props.initMethod()
    }
    // 然后打开下拉
    dropdownOpen.value = true
  }
})
</script>

<style scoped>
/* 下拉触发器样式 */
.custom-tree-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  border: 1px solid #e0dcdc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  outline: none;
}
.custom-tree-select-trigger:hover {
  border-color: #32AFFF;
}
.custom-tree-select-trigger.trigger-focused {
  border-color: #32AFFF;
  box-shadow: 0 0 0 2px rgba(50, 175, 255, 0.2);
}

/* 深色主题 */
.custom-tree-select-trigger.theme-dark {
  background-color: transparent;
  border-color: #e0dcdc;
}
.custom-tree-select-trigger.theme-dark .trigger-text {
  font-size: 13px;
  color: #ffffff;
}
.custom-tree-select-trigger.theme-dark .trigger-placeholder {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
}
.custom-tree-select-trigger.theme-dark .trigger-arrow {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.45);
  transition: transform 0.3s;
}

/* 浅色主题 */
.custom-tree-select-trigger.theme-light {
  background-color: #ffffff;
  border-color: #d9d9d9;
}
.custom-tree-select-trigger.theme-light .trigger-text {
  font-size: 13px;
  color: #000000;
}
.custom-tree-select-trigger.theme-light .trigger-placeholder {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}
.custom-tree-select-trigger.theme-light .trigger-arrow {
  width: 14px;
  height: 14px;
  color: rgba(0, 0, 0, 0.45);
  transition: transform 0.3s;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 下拉菜单容器样式 */
.custom-tree-dropdown-wrapper {
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
}

/* 深色主题下拉菜单 */
.custom-tree-dropdown-wrapper.theme-dark {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 浅色主题下拉菜单 */
.custom-tree-dropdown-wrapper.theme-light {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 树组件样式 */
:deep(.custom-tree) {
  background: transparent !important;
  transition: all 0.2s;
}
:deep(.custom-tree .ant-tree-node-content-wrapper) {
  padding: 4px 0;
}

/* 深色主题树 */
.custom-tree-dropdown-wrapper.theme-dark :deep(.custom-tree) {
  color: rgba(255, 255, 255, 0.85);
}
.custom-tree-dropdown-wrapper.theme-dark :deep(.custom-tree .ant-tree-node-content-wrapper:hover) {
  background-color: rgba(24, 144, 255, 0.15) !important;
}
.custom-tree-dropdown-wrapper.theme-dark :deep(.custom-tree .ant-tree-node-selected) {
  background-color: rgba(24, 144, 255, 0.25) !important;
  color: #32AFFF !important;
}
.custom-tree-dropdown-wrapper.theme-dark :deep(.custom-tree .ant-tree-switcher) {
  color: rgba(255, 255, 255, 0.45);
}

/* 浅色主题树 */
.custom-tree-dropdown-wrapper.theme-light :deep(.custom-tree) {
  color: rgba(0, 0, 0, 0.85);
}
.custom-tree-dropdown-wrapper.theme-light :deep(.custom-tree .ant-tree-node-content-wrapper:hover) {
  background-color: #e6f7ff !important;
}
.custom-tree-dropdown-wrapper.theme-light :deep(.custom-tree .ant-tree-node-selected) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}
.custom-tree-dropdown-wrapper.theme-light :deep(.custom-tree .ant-tree-switcher) {
  color: rgba(0, 0, 0, 0.45);
}

/* 滚动条样式 */
.custom-tree-dropdown-wrapper::-webkit-scrollbar {
  width: 4px;
}
.custom-tree-dropdown-wrapper.theme-dark::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-tree-dropdown-wrapper.theme-light::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.custom-tree-dropdown-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
</style>