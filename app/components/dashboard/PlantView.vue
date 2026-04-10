<template>
    <div class="bg-[#0A162C]/10 rounded-lg p-4 flex flex-col h-full w-full relative overflow-hidden">
      <div class="flex items-center justify-between mb-2 shrink-0 relative py-1">
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1/2 bg-gradient-to-r from-[#173A6B]/60 to-transparent pointer-events-none"></div>
        <div class="absolute -left-1 top-[-4px] bottom-[-4px] w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-[14px] font-bold text-white ml-4 leading-none z-10">能源拓扑</h3>
        <!-- 顶部类型说明和状态说明（和设计稿一致） -->
        <div class="flex gap-6 text-[10px] text-[#9CA3AF] relative z-10">
          <div class="flex items-center gap-4">
            <span>类型说明:</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#10B981]"></span> 清洁能源</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#6366F1]"></span> 关键负荷</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#F59E0B]"></span> 可调负荷</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#EF4444]"></span> 可断负荷</span>
          </div>
          <div class="flex items-center gap-4">
            <span>状态说明:</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#10B981]"></span> 发电中</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#EF4444]"></span> 未运行</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#F59E0B]"></span> 待机中</span>
            <span class="flex items-center gap-1"><span class="w-3 h-1 bg-[#6B7280]"></span> 已离线</span>
          </div>
        </div>
      </div>
      <!-- 厂区视图内容区域（后续在这里添加拓扑图） -->
      <div class="flex-1 w-full flex items-center justify-center text-[#4B5563] text-sm">
        动态厂区拓扑图区域
      </div>
    </div>
  </template>
  <script setup>
  // 后续可以在这里添加拓扑图的逻辑和数据
  </script>