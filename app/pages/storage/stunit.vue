<template>
    <!-- 储能区域主页面 -->
    <div class="stunit-container">
      <!-- 页面头部：标题 + 模式切换 + 操作按钮 -->
      <div class="page-header">
        <div class="header-left">
          <!-- 储能区域图标 + 标题 -->
          <svg class="stunit-icon" aria-hidden="true">
            <!-- 替换成你的储能区域SVG图标内容，这里用示例路径/代码 -->
            <use xlink:href="#icon-storage-unit"></use>
            <!-- 如果是本地SVG文件，可这样写：
            <image xlink:href="@/assets/icons/stunit.svg" width="24" height="24" />
            -->
          </svg>
          <h2>储能区域</h2>
        </div>
  
        <!-- card/list模式切换按钮 -->
        <div class="mode-switch">
          <button 
            class="switch-btn" 
            :class="{ active: currentMode === 'card' }"
            @click="switchMode('card')"
          >
            <svg class="mode-icon" aria-hidden="true">
              <use xlink:href="#icon-card"></use>
            </svg>
            卡片模式
          </button>
          <button 
            class="switch-btn" 
            :class="{ active: currentMode === 'list' }"
            @click="switchMode('list')"
          >
            <svg class="mode-icon" aria-hidden="true">
              <use xlink:href="#icon-list"></use>
            </svg>
            列表模式
          </button>
        </div>
      </div>
  
      <!-- 内容区域：根据模式渲染不同布局 -->
      <div class="content-area">
        <!-- 卡片模式 -->
        <div class="card-mode" v-if="currentMode === 'card'">
          <div class="stunit-card" v-for="item in stunitData" :key="item.id">
            <div class="card-header">
              <h3>{{ item.name }}</h3>
              <span class="status" :class="item.status">{{ item.statusText }}</span>
            </div>
            <div class="card-body">
              <div class="data-item">
                <label>储能容量</label>
                <span>{{ item.capacity }} kWh</span>
              </div>
              <div class="data-item">
                <label>充放电功率</label>
                <span>{{ item.power }} kW</span>
              </div>
              <div class="data-item">
                <label>剩余电量</label>
                <span>{{ item.remainPower }} %</span>
              </div>
              <div class="data-item">
                <label>运行时长</label>
                <span>{{ item.runTime }} h</span>
              </div>
            </div>
            <div class="card-footer">
              <button class="operate-btn">详情</button>
              <button class="operate-btn">设置</button>
            </div>
          </div>
        </div>
  
        <!-- 列表模式 -->
        <div class="list-mode" v-else>
          <table class="stunit-list">
            <thead>
              <tr>
                <th>序号</th>
                <th>储能单元名称</th>
                <th>储能容量(kWh)</th>
                <th>充放电功率(kW)</th>
                <th>剩余电量(%)</th>
                <th>运行状态</th>
                <th>运行时长(h)</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in stunitData" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.capacity }}</td>
                <td>{{ item.power }}</td>
                <td>{{ item.remainPower }}</td>
                <td><span class="status" :class="item.status">{{ item.statusText }}</span></td>
                <td>{{ item.runTime }}</td>
                <td class="operate-col">
                  <button class="operate-btn">详情</button>
                  <button class="operate-btn">设置</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // 模式切换：默认卡片模式
  const currentMode = ref('card')
  
  // 切换模式方法
  const switchMode = (mode) => {
    currentMode.value = mode
  }
  
  // 模拟储能区域数据（和逆变器页面数据结构一致，仅名称/字段适配储能）
  const stunitData = ref([
    {
      id: 1,
      name: '储能区域-1号单元',
      capacity: 100,
      power: 50,
      remainPower: 85,
      runTime: 1200,
      status: 'normal',
      statusText: '正常运行'
    },
    {
      id: 2,
      name: '储能区域-2号单元',
      capacity: 200,
      power: 80,
      remainPower: 60,
      runTime: 850,
      status: 'warning',
      statusText: '低电量预警'
    },
    {
      id: 3,
      name: '储能区域-3号单元',
      capacity: 150,
      power: 60,
      remainPower: 0,
      runTime: 1500,
      status: 'error',
      statusText: '已断电'
    }
  ])
  </script>
  
  <style scoped>
  /* 全局容器样式 */
  .stunit-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #f5f7fa;
  }
  
  /* 页面头部 */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .stunit-icon {
    width: 24px;
    height: 24px;
    fill: #1890ff;
  }
  
  .page-header h2 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
  
  /* 模式切换按钮 */
  .mode-switch {
    display: flex;
    gap: 10px;
  }
  
  .switch-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .switch-btn.active {
    background: #1890ff;
    color: #fff;
    border-color: #1890ff;
  }
  
  .mode-icon {
    width: 16px;
    height: 16px;
  }
  
  /* 内容区域通用 */
  .content-area {
    width: 100%;
  }
  
  /* 卡片模式样式 */
  .card-mode {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .stunit-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f2f5;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }
  
  .status {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .status.normal {
    background: #f0f9ff;
    color: #1890ff;
  }
  
  .status.warning {
    background: #fdf6ec;
    color: #faad14;
  }
  
  .status.error {
    background: #fff2f0;
    color: #f5222d;
  }
  
  .card-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .data-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .data-item label {
    font-size: 12px;
    color: #909399;
  }
  
  .data-item span {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
  
  .card-footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .operate-btn {
    padding: 4px 12px;
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
    color: #606266;
    transition: all 0.2s;
  }
  
  .operate-btn:hover {
    color: #1890ff;
    border-color: #1890ff;
  }
  
  /* 列表模式样式 */
  .list-mode {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }
  
  .stunit-list {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stunit-list th,
  .stunit-list td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #f0f2f5;
  }
  
  .stunit-list th {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }
  
  .stunit-list td {
    font-size: 14px;
    color: #303133;
  }
  
  .operate-col {
    display: flex;
    gap: 8px;
  }
  </style>