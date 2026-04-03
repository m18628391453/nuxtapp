<template>
    <Teleport to="body">
      <!-- 遮罩层 -->
      <div
        v-if="visible"
        class="fixed inset-0 bg-black/50 z-[9999] flex items-start justify-center pt-[10vh]"
        @click.self="handleClose"
      >
        <!-- 弹窗主体 -->
        <div
          class="w-[60%] max-w-[800px] bg-[#0A162C]/90 rounded-2xl border border-gray-100/10 shadow-2xl overflow-hidden flex flex-col"
          @click.stop
        >
          <!-- 顶部搜索栏 -->
          <div class="flex items-center gap-4 px-6 py-4 border-b border-gray-100/10">
            <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchKeyword"
              type="text"
              placeholder="搜索导航菜单"
              class="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder:text-gray-400"
              @keydown="handleKeydown"
            />
            <button
              class="text-gray-400 hover:text-white transition-colors shrink-0"
              @click="handleClose"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <!-- 中间内容区 -->
          <div class="flex-1 min-h-[300px] max-h-[300px] overflow-y-auto p-4">
            <!-- 无搜索内容时显示 -->
            <div v-if="filteredMenuList.length === 0" class="w-full h-full flex items-center justify-center">
              <span class="text-[14px] text-gray-400/80 mt-[10%]">没有搜索记录</span>
            </div>
            <!-- 搜索结果列表 -->
            <ul v-else class="w-full flex flex-col gap-1">
              <li
                v-for="(item, index) in filteredMenuList"
                :key="item.name"
                class="rounded-lg px-4 py-3 cursor-pointer transition-colors"
                :class="currentActiveIndex === index ? 'bg-[#32AFFF]/20 border-b border-gray-100/10' : 'hover:bg-white/5'"
                @click="handleSelect(item)"
                @mouseenter="currentActiveIndex = index"
              >
                <span class="text-lg" :class="currentActiveIndex === index ? 'text-[#32AFFF]' : 'text-white'">
                  {{ item.name }}
                </span>
              </li>
            </ul>
          </div>
  
          <!-- 底部快捷键提示 -->
          <div class="px-6 py-4 border-t border-gray-100/10 flex items-center gap-6 text-gray-400 text-[13px]">
            <div class="flex items-center gap-2">
              <span>←</span>
              <span>选择</span>
            </div>
            <div class="flex items-center gap-2">
              <span>↑</span>
              <span>↓</span>
              <span>导航</span>
            </div>
            <div class="flex items-center gap-2">
              <span>ESC</span>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, watch, computed, nextTick } from 'vue'
  
  // 组件入参
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    // 菜单列表
    menuList: {
      type: Array,
      default: () => []
    }
  })
  
  // 组件事件
  const emit = defineEmits(['update:visible', 'select'])
  
  // 搜索输入框ref
  const searchInputRef = ref(null)
  // 搜索关键词
  const searchKeyword = ref('')
  // 键盘选中的索引
  const currentActiveIndex = ref(0)
  
  // 过滤后的菜单列表（模糊搜索）
  const filteredMenuList = computed(() => {
    if (!searchKeyword.value.trim()) return []
    const keyword = searchKeyword.value.trim().toLowerCase()
    return props.menuList.filter(item => item.name.toLowerCase().includes(keyword))
  })
  
  // 关闭弹窗
  const handleClose = () => {
    emit('update:visible', false)
    searchKeyword.value = ''
    currentActiveIndex.value = 0
  }
  
  // 选中菜单
  const handleSelect = (item) => {
    emit('select', item)
    handleClose()
  }
  
  // 输入框键盘事件
  const handleKeydown = (e) => {
    const list = filteredMenuList.value
    if (!list.length) return
  
    // 下箭头
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      currentActiveIndex.value = (currentActiveIndex.value + 1) % list.length
    }
    // 上箭头
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      currentActiveIndex.value = (currentActiveIndex.value - 1 + list.length) % list.length
    }
    // 回车/左箭头 确认选择
    if (e.key === 'Enter' || e.key === 'ArrowLeft') {
      e.preventDefault()
      handleSelect(list[currentActiveIndex.value])
    }
    // ESC关闭
    if (e.key === 'Escape') {
      handleClose()
    }
  }
  
  // 弹窗打开时自动聚焦输入框
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
      document.addEventListener('keydown', handleGlobalEsc)
    } else {
      document.removeEventListener('keydown', handleGlobalEsc)
    }
  })
  
  // 全局ESC关闭弹窗
  const handleGlobalEsc = (e) => {
    if (e.key === 'Escape') handleClose()
  }
  
  // 搜索关键词变化时重置选中索引
  watch(searchKeyword, () => {
    currentActiveIndex.value = 0
  })
  </script>
  
  <style scoped>
  /* 滚动条美化 */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #374151;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #4B5563;
  }
  </style>