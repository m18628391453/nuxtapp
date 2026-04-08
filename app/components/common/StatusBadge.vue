<template>
  <div class="flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-900/30"
    style="padding: 2px 8px;">
    <span class="text-[10px] font-bold text-emerald-500">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: String
})
</script>