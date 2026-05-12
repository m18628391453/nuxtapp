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
        <!-- 搜索框 -->
        <div v-if="searchable" class="tree-search-input-wrapper mb-2">
          <a-input
            v-model:value="searchValue"
            placeholder="请输入关键词搜索"
            size="small"
            :class="`theme-${theme}`"
          />
        </div>
        <!-- 树组件 -->
        <a-tree
          v-model:expandedKeys="expandedKeys"
          :tree-data="processedTreeData"
          :show-icon="false"
          :block-node="true"
          @select="handleTreeSelect"
          class="custom-tree"
          :field-names="{ title: 'title', key: 'key', children: 'children' }"
        >
          <template #title="{ title, name, disabled }">
            <span 
              class="text-[13px] node-title-text"
              :class="{ 'node-unselectable': disabled }"
            >
              {{ title || name }}
            </span>
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
import { ref, computed, watch } from 'vue'

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
  },
  /** 是否显示搜索框 */
  searchable: {
    type: Boolean,
    default: true
  },
  /** 允许选择的节点类型（nodeType）数组，为空则所有节点可选 */
  nodeTypes: {
    type: Array,
    default: () => []
  }
})

// 组件事件定义
const emit = defineEmits(['select', 'update:modelValue'])

// 内部状态
const dropdownOpen = ref(false)
const expandedKeys = ref([])
const isFocused = ref(false)
const searchValue = ref('') // 搜索框值

/**
 * 核心逻辑：处理树数据（添加 disabled 属性 + 搜索过滤）
 * 不破坏原数据引用，只在表层增加 computed 属性
 */
const processedTreeData = computed(() => {
  // 1. 先根据 nodeTypes 给节点打上 disabled 标签
  const dataWithDisabled = addDisabledFlag(props.treeData)
  // 2. 再根据搜索关键词过滤
  if (!searchValue.value) return dataWithDisabled
  return filterTreeData(dataWithDisabled, searchValue.value)
})

/**
 * 递归：给节点添加 disabled 属性
 */
const addDisabledFlag = (nodes) => {
  return nodes.map(node => {
    const isDisabled = props.nodeTypes.length > 0 && !props.nodeTypes.includes(node.nodeType)
    const newNode = {
      ...node,
      disabled: isDisabled,
      // 确保 children 也被处理
      children: node.children && node.children.length > 0 ? addDisabledFlag(node.children) : undefined
    }
    return newNode
  })
}

/**
 * 递归：过滤树数据（保留父节点结构）
 */
const filterTreeData = (nodes, keyword) => {
  const result = []
  for (const node of nodes) {
    const title = node.title || node.name || ''
    const matchKeyword = title.toLowerCase().includes(keyword.toLowerCase())
    
    let filteredChildren = []
    if (node.children && node.children.length > 0) {
      filteredChildren = filterTreeData(node.children, keyword)
    }

    if (matchKeyword || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      })
    }
  }
  return result
}

/**
 * 根据 code/key 在树中查找对应的 title
 */
const findTitleByCode = (nodes, code) => {
  for (const node of nodes) {
    if ((node.code || node.key) === code) {
      return node.title || node.name
    }
    if (node.children && node.children.length > 0) {
      const found = findTitleByCode(node.children, code)
      if (found) return found
    }
  }
  return null
}

/**
 * 计算显示的标题
 */
const selectedTitle = computed(() => {
  if (props.modelValue) {
    const title = findTitleByCode(props.treeData, props.modelValue)
    if (title) {
      return title
    }
    return props.modelValue
  }
  return ''
})

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
    // 再次校验：如果节点是 disabled 状态，直接返回
    if (info.node.disabled) {
      return
    }
    
    // 暴露选中节点给父组件
    emit('select', info.node)
    // 触发 modelValue 更新
    emit('update:modelValue', info.node.code || info.node.key)
    // 点击后收起下拉
    dropdownOpen.value = false
  }
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
  clearSelection: () => {
    emit('update:modelValue', '')
  },
  init: async () => {
    if (props.initMethod) {
      await props.initMethod()
    }
    dropdownOpen.value = true
  }
})

// 监听下拉关闭，清空搜索框
watch(dropdownOpen, (isOpen) => {
  if (!isOpen) {
    searchValue.value = ''
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
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
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

/* 搜索框样式 */
.tree-search-input-wrapper {
  width: 100%;
}
.tree-search-input-wrapper :deep(.ant-input) {
  background-color: transparent;
}
/* 简单的主题适配，若需更精细的 Input 样式控制可自行扩展 */
.tree-search-input-wrapper :deep(.ant-input.theme-dark) {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
}
.tree-search-input-wrapper :deep(.ant-input.theme-dark::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

/* 深色主题下拉菜单 */
.custom-tree-dropdown-wrapper.theme-dark {
  background-color: rgba(0, 20, 40, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.15);
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
  width: 100%;
}

/* 不可选节点基础样式 */
.node-unselectable {
  cursor: not-allowed;
}
/* 深色主题下的不可选文字（加深优化） */
.custom-tree-dropdown-wrapper.theme-dark :deep(.ant-tree-treenode-disabled .node-title-text) {
  color: rgba(255, 255, 255, 0.45) !important;
}
/* 浅色主题下的不可选文字（加深优化） */
.custom-tree-dropdown-wrapper.theme-light :deep(.ant-tree-treenode-disabled .node-title-text) {
  color: rgba(0, 0, 0, 0.5) !important;
}
/* 禁用态hover样式重置，避免高亮 */
:deep(.custom-tree .ant-tree-treenode-disabled .ant-tree-node-content-wrapper:hover) {
  background-color: transparent !important;
}

/* 深色主题树交互 */
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

/* 浅色主题树交互 */
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

.mb-2 {
  margin-bottom: 8px;
}
</style>