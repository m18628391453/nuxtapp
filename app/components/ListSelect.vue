<template>
  <a-dropdown
    v-model:open="dropdownOpen"
    trigger="click"
    placement="bottomLeft"
    :overlay-style="{ minWidth: width }"
  >
    <template #overlay>
      <div class="custom-list-dropdown-wrapper" :class="`theme-${theme}`" :style="{ width: width }">
        <div class="list-items">
          <div
            v-for="item in listData"
            :key="item[idKey]"
            class="list-item"
            :class="{ selected: selectedValue === item[idKey] }"
            @click="handleSelect(item)"
          >
            <span class="text-[13px]">{{ item[nameKey] }}</span>
          </div>
        </div>
      </div>
    </template>

    <div
      class="custom-list-select-trigger"
      :class="{ 'trigger-focused': isFocused, [`theme-${theme}`]: true }"
      tabindex="0"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @click="dropdownOpen = !dropdownOpen"
    >
      <span v-if="showText" class="trigger-text">{{ showText }}</span>
      <span v-else class="trigger-placeholder">{{ placeholder }}</span>
      <svg class="trigger-arrow" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </a-dropdown>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  listData: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '请选择' },
  theme: { type: String, default: 'dark' },
  width: { type: String, default: '200px' },
  idKey: { type: String, default: 'id' },
  nameKey: { type: String, default: 'name' },
})

const emit = defineEmits(['update:modelValue', 'select'])

const dropdownOpen = ref(false)
const isFocused = ref(false)
const selectedValue = ref(props.modelValue)

const showText = computed(() => {
  const item = props.listData.find(i => i[props.idKey] === selectedValue.value)
  return item ? item[props.nameKey] : ''
})

function handleSelect(item) {
  selectedValue.value = item[props.idKey]
  emit('update:modelValue', item[props.idKey])
  emit('select', item)
  dropdownOpen.value = false
}

watch(() => props.modelValue, (val) => {
  selectedValue.value = val
})
</script>

<style scoped>
.custom-list-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  outline: none;
}
.custom-list-select-trigger:hover {
  border-color: #32AFFF;
}
.custom-list-select-trigger.trigger-focused {
  border-color: #32AFFF;
  box-shadow: 0 0 0 2px rgba(50, 175, 255, 0.2);
}

/* 深色 */
.custom-list-select-trigger.theme-dark {
  background: transparent;
  border-color: rgba(255,255,255,0.2);
}
.custom-list-select-trigger.theme-dark .trigger-text {
  font-size: 13px;
  color: #fff;
}
.custom-list-select-trigger.theme-dark .trigger-placeholder {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
}
.custom-list-select-trigger.theme-dark .trigger-arrow {
  width: 14px;
  height: 14px;
  color: rgba(255,255,255,0.5);
  transition: transform 0.3s;
}

/* 浅色 */
.custom-list-select-trigger.theme-light {
  background: #fff;
  border-color: #d9d9d9;
}
.custom-list-select-trigger.theme-light .trigger-text {
  font-size: 13px;
  color: #000;
}
.custom-list-select-trigger.theme-light .trigger-placeholder {
  font-size: 13px;
  color: rgba(0,0,0,0.5);
}
.custom-list-select-trigger.theme-light .trigger-arrow {
  width: 14px;
  height: 14px;
  color: rgba(0,0,0,0.5);
  transition: transform 0.3s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.custom-list-dropdown-wrapper {
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 4px;
  padding: 6px;
}
.custom-list-dropdown-wrapper.theme-dark {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
}
.custom-list-dropdown-wrapper.theme-light {
  background: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.list-item {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
.theme-dark .list-item {
  color: rgba(255,255,255,0.85);
}
.theme-dark .list-item:hover {
  background: rgba(50, 175, 255, 0.15);
}
.theme-dark .list-item.selected {
  background: rgba(50, 175, 255, 0.25);
  color: #32AFFF;
}

.theme-light .list-item {
  color: rgba(0,0,0,0.85);
}
.theme-light .list-item:hover {
  background: #e6f7ff;
}
.theme-light .list-item.selected {
  background: #e6f7ff;
  color: #1890ff;
}

.custom-list-dropdown-wrapper::-webkit-scrollbar {
  width: 4px;
}
.custom-list-dropdown-wrapper::-webkit-scrollbar-thumb {
  border-radius: 4px;
}
.theme-dark::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
}
.theme-light::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
}
</style>