<template>
    <div class="bg-[#0A162C]/10 rounded-lg flex flex-col gap-6 relative overflow-hidden" style="padding: 0.5rem 1.2rem 1rem 1.5rem;">
      <!-- 标题 -->
      <div class="w-full bg-gradient-to-r from-[#0F3460] to-transparent flex items-center py-3.5 px-4 relative -ml-3 -mr-4 -pt-5">
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]"></div>
        <h3 class="text-sm font-bold text-white ml-1 leading-none">
          核心资产状态
        </h3>
      </div>
  
      <!-- 光伏系统段落 -->
      <div class="flex flex-col gap-1 -mt-2">
        <div class="flex items-center justify-between">
          <span class="text-[14px] font-bold text-cyan-400">光伏系统</span>
          <StatusBadge text="并网运行" />
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(item, index) in pvData" :key="index" class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <svg class="w-3 h-3 text-cyan-400 fill-current" viewBox="0 0 12 12">
                <path d="M6 0L12 6L6 12L0 6L6 0Z" />
              </svg>
              <span class="text-[11px] font-bold text-gray-200">{{ item.label }}</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-[14px] font-bold text-cyan-400 font-mono">{{ item.value }}</span>
              <span class="text-[12px] text-gray-300">{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-800/50 to-transparent mt-2" />
      </div>
  
      <!-- 储能系统段落 -->
      <div class="flex flex-col gap-3 -mt-2">
        <div class="flex items-center justify-between">
          <span class="text-[14px] font-bold text-cyan-400">{{ energyStorageData.title }}</span>
          <StatusBadge :text="energyStorageData.status" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gradient-to-r from-[#076193a0] to-transparent px-4 py-2 flex flex-col gap-1">
            <span class="text-[11px] font-medium text-gray-200">{{ energyStorageData.charge.label }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[14px] font-bold text-cyan-400 font-mono">{{ energyStorageData.charge.value }}</span>
              <span class="text-[11px] text-gray-300">{{ energyStorageData.charge.unit }}</span>
            </div>
          </div>
          <div class="bg-gradient-to-r from-[#076193a0] to-transparent px-4 py-2 flex flex-col gap-1">
            <span class="text-[11px] font-medium text-gray-200">{{ energyStorageData.discharge.label }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[14px] font-bold text-cyan-400 font-mono">{{ energyStorageData.discharge.value }}</span>
              <span class="text-[11px] text-gray-300">{{ energyStorageData.discharge.unit }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between w-full">
          <span class="text-[12px] font-medium text-gray-200">{{ energyStorageData.soc.label }}</span>
          <div class="flex items-center gap-2">
            <svg class="w-8 h-4" viewBox="0 0 32 16" fill="none">
              <rect x="1" y="1" width="26" height="14" rx="2" stroke="#5EEAD4" stroke-width="1.5" />
              <rect x="28" y="4" width="2" height="8" rx="1" fill="#5EEAD4" />
              <rect x="3" y="3" width="19" height="10" rx="1" fill="#5EEAD4" />
            </svg>
            <span class="text-[14px] font-bold text-emerald-400 font-mono">{{ energyStorageData.soc.percent }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between w-full gap-1">
          <span class="text-[12px] font-medium text-gray-200 whitespace-nowrap">{{ energyStorageData.health.label }}</span>
          <div class="flex-1 h-2 bg-[#1A2A4A] rounded-full overflow-hidden">
            <div class="h-full bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.6)]" :style="{ width: energyStorageData.health.percent }"></div>
          </div>
          <span class="text-[14px] font-bold text-emerald-400 font-mono whitespace-nowrap">{{ energyStorageData.health.percent }}</span>
        </div>
        <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-800/50 to-transparent" />
      </div>
  
      <!-- 核心负荷段落 -->
      <div class="flex flex-col gap-3 -mt-2">
        <span class="text-[14px] font-bold text-cyan-400">核心负荷_1.5MW</span>
        <div class="grid grid-cols-[0.75fr_0.5fr_0.5fr_0.5fr_1fr]">
          <span class="text-[12px] text-gray-300"></span>
          <span class="text-[12px] text-gray-300 text-center font-medium">总数</span>
          <span class="text-[12px] text-gray-300 text-center font-medium">运行数</span>
          <span class="text-[12px] text-gray-300 text-center font-medium">异常数</span>
          <span class="text-[12px] text-gray-300 text-center font-medium">当前总功率(kW)</span>
        </div>
        <div class="flex flex-col gap-1 -mt-3">
          <div v-for="(item, index) in loadData" :key="index" class="grid grid-cols-[0.75fr_0.5fr_0.5fr_0.5fr_1fr] items-center bg-gradient-to-r from-[#071123]/50 to-transparent rounded-full px-3 py-2 border-b border-cyan-800/20 shadow-[0_2px_8px_rgba(6,182,212,0.1)]">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.7)]"></div>
              <span class="text-[12px] font-medium text-white">{{ item.name }}</span>
            </div>
            <span class="text-[14px] font-bold text-cyan-400 font-mono text-center">{{ item.total }}</span>
            <span class="text-[14px] font-bold text-emerald-400 font-mono text-center">{{ item.running }}</span>
            <span class="text-[14px] font-bold text-red-500 font-mono text-center">{{ item.error }}</span>
            <span class="text-[14px] font-bold text-white font-mono text-center">{{ item.power }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import StatusBadge from './StatusBadge.vue'  
  
  const loadData = [
    { name: '增氧机', total: 100, running: 80, error: 0, power: 400 },
    { name: '投料机', total: 100, running: 80, error: 0, power: 300 },
    { name: '循环水泵', total: 100, running: 80, error: 0, power: 800 },
  ];
  
  const pvData = [
    { label: '装机容量', value: '2', unit: 'MW' },
    { label: '当前功率', value: '800', unit: 'kW' },
    { label: '今日发电量', value: '200', unit: 'kWh' },
  ];
  
  const energyStorageData = {
    title: '储能系统_2MW/4MWh',
    status: '放电中',
    charge: { label: '今日充电量', value: '1,000', unit: 'kWh' },
    discharge: { label: '今日放电量', value: '2,000', unit: 'kWh' },
    soc: { label: 'SOC余量1480KWh', percent: '74%' },
    health: { label: '健康度', percent: '98%' }
  };
  </script>