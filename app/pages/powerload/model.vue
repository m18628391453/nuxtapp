<template>
  <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">
    <div class="flex gap-2 flex-1 w-full overflow-hidden">
      <!-- 左侧树状菜单 完全保留 不要修改！！！ -->
      <div class="w-[280px] shrink-0 flex flex-col h-full bg-transparent" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
        <div class="flex justify-between items-center mt-1 mb-2">
          <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷区域</span>
          <div class="flex gap-1 text-[12px] p-1 mt-1 mr-1">
              <button 
                  v-for="btn in buttons" 
                  :key="btn" 
                  @click="handleBtnClick(btn)"
                  class="px-2 text-[10px] rounded transition-all" 
                  :class="btn === activeBtn ? 'bg-cyan-600/30 text-[#32AFFF] border border-cyan-500/50 cursor-pointer' : 'text-[#FFFFFFCC] hover:text-gray-300 cursor-pointer'"
                  >
                  {{ btn }}
              </button>
          </div>
        </div>
        
        <div class="mb-3 px-2 custom-search">
          <a-input
            v-model:value="searchValue"
            placeholder="请输入"
            allow-clear
            @pressEnter="onQuery"
          >
            <template #suffix>
              <svg @click="onQuery" class="w-4 h-4 cursor-pointer text-[#fefefe66] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </template>
          </a-input>
        </div>
        
        <div class="flex-1 overflow-auto custom-tree-wrapper pr-2">
          <a-tree
            v-model:selectedKeys="selectedKeys"
            v-model:expandedKeys="expandedKeys"
            :tree-data="filteredTreeData"
            :show-icon="false"
            @select="handleTreeSelect"
          >
            <template #title="{ title }">
              <span class="text-[13px]">{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      
      <!-- 右侧区域 修复宽度溢出问题 关键：加overflow:hidden和width:0 -->
      <div class="flex-1 flex flex-col h-full bg-transparent overflow-hidden" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
        <!-- 满行搜索栏 完全和左侧一致 带搜索图标 -->
        <div class="bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] px-2 py-1 mx-4 mb-4 shrink-0 w-[calc(100%-32px)] mt-3.5">
          <div class="grid grid-cols-1 gap-4 items-center custom-search content-search">
            <a-input
              v-model:value="modelSearchValue"
              placeholder="搜索"
              allow-clear
              class="border border-[#FFFFFF00]"
              @pressEnter="onModelQuery"
            >
              <template #suffix>
                <svg @click="onModelQuery" class="w-4 h-4 cursor-pointer text-[#fefefe66] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </template>
            </a-input>
          </div>
        </div>
        
        <!-- 表格容器 关键：加width:100%和overflow:hidden -->
        <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] flex flex-col min-h-0 overflow-hidden mx-4 mb-4 w-[calc(100%-32px)]">
          <!-- 表格标题与操作按钮 -->
          <div class="flex justify-between items-center px-6 py-2 border-b border-[#FFFFFF14] shrink-0">
            <span class="text-[14px] font-normal text-white tracking-wide">负荷模型列表</span>
            <div class="flex gap-2 shrink-0">
              <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80" @click="handleAdd">新增</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]" @click="handleEdit">编辑</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FF4D4F] hover:!text-[#FF4D4F] hover:!border-[#fefefe30]" @click="handleDelete">删除</a-button>
              <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]" @click="handleExport">导出</a-button>
            </div>
          </div>
          
          <!-- 表格主体 关键：加width:100%，表格scroll同时设置x和y -->
          <div class="flex-1 overflow-hidden flex flex-col p-2 pb-0 custom-table-container w-full">
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="paginationConfig"
              @change="handlePaginationChange"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :scroll="{ x: '100%', y: 'max-content' }"
              class="custom-dark-table border border-[#FFFFFF1F] flex-1 w-full"
              row-key="id"
              :table-layout="'fixed'"
            >
              <template #bodyCell="{ column, text, record, index }">
                <template v-if="column.key === 'index'">
                  <span class="text-[#FFFFFF60] text-[14px]">{{ index + 1 }}</span>
                </template>
                
                <template v-else-if="column.key === 'code'">
                  <span class="text-[#32AFFF] text-[14px] cursor-pointer hover:underline">{{ text }}</span>
                </template>
                
                <template v-else-if="column.key === 'description'">
                  <!-- 负荷区域描述内容左对齐 标题保持居中 -->
                  <span class="text-[#FFFFFFCC] text-[14px] text-left block">{{ text }}</span>
                </template>
                
                <template v-else-if="column.key === 'action'">
                  <a-button type="link" class="!text-[#32AFFF] !text-[14px] !p-0 !mr-2" @click="handleEdit(record)">修改</a-button>
                  <a-button type="link" class="!text-[#FF4D4F] !text-[14px] !p-0" @click="handleDelete(record)">删除</a-button>
                </template>
                
                <template v-else>
                  <span class="text-[#FFFFFFCC] text-[14px]">{{ text }}</span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 区域对话框（新增/编辑共用） -->
  <a-modal
    v-model:open="areaModalVisible"
    :title="isEditMode ? '编辑区域' : '新增区域'"
    @ok="handleAreaSubmit"
    @cancel="closeAreaModal"
  >
    <a-form layout="vertical">
      <a-form-item label="区域名称">
        <a-input v-model:value="areaForm.name" placeholder="请输入区域名称" />
      </a-form-item>
      <a-form-item label="区域编码">
        <a-input v-model:value="areaForm.code" placeholder="请输入区域编码" />
      </a-form-item>
      <a-form-item label="区域描述">
        <a-textarea v-model:value="areaForm.description" placeholder="请输入区域描述" rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 设备对话框（新增/编辑共用） -->
  <a-modal
    v-model:open="deviceModalVisible"
    :title="isEditMode ? '编辑设备' : '新增设备'"
    @ok="handleDeviceSubmit"
    @cancel="closeDeviceModal"
  >
    <a-form layout="vertical">
      <a-form-item label="设备名称">
        <a-input v-model:value="deviceForm.name" placeholder="请输入设备名称" />
      </a-form-item>
      <a-form-item label="设备编码">
        <a-input v-model:value="deviceForm.code" placeholder="请输入设备编码" />
      </a-form-item>
      <a-form-item label="设备描述">
        <a-textarea v-model:value="deviceForm.description" placeholder="请输入设备描述" rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, computed,onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRequest } from "~/composables/useRequest"
import { message, Modal } from 'ant-design-vue'
definePageMeta({
  layout: 'layout'
})

const searchValue = ref('')
const selectedKeys = ref([])
const expandedKeys = ref([])
const modelAreaTreeData = ref([])
const modelCategoryTreeData = ref([])
// 当前选中的树节点数据
const selectedNodeData = ref(null)
// 过滤后的树数据
const filteredTreeData = ref([])
// 按钮切换处理
const buttons = ref(['区域', '设备'])
const activeBtn = ref('区域')
// 模拟表格数据 完全匹配设计稿内容
const tableData = ref([])
// 表格选中行 
const selectedRowKeys = ref([])

// 当前树数据计算属性
const currentTreeData = computed(() => {
  return activeBtn.value === '区域' ? modelAreaTreeData.value : modelCategoryTreeData.value
})

// 树节点选择事件处理
const handleTreeSelect = (selectedKeys, info) => {
  console.log('选中的节点:', info)
  // 获取选中的节点数据
  if (info.selected && info.node && info.node) {
    selectedNodeData.value = info.node
    console.log('选中节点数据:', selectedNodeData.value)
    // 重新加载表格数据，传入选中节点的 key 作为 parentId
    loadTableData(info.node.key)
  } else {
    // 取消选中时，查询所有数据
    selectedNodeData.value = null
    loadTableData(null)
  }
}

// 按钮点击事件处理
const handleBtnClick = (btn) => {
  activeBtn.value = btn
  console.log('切换到:', btn)
  console.log('当前 activeBtn 值:', activeBtn.value)
  console.log('当前树数据:', currentTreeData.value)
  selectedKeys.value = []
  selectedNodeData.value = null
  // 更新过滤后的树数据
  filteredTreeData.value = currentTreeData.value
  // 重新加载表格数据
  loadTableData()
}

// 加载表格数据
const loadTableData = async (parentId = null) => {
  console.log('加载表格数据，当前模式:', activeBtn.value, 'parentId:', parentId)
  const { get } = useRequest()
  
  if (activeBtn.value === '区域') {
    const areaData = await get('/powerload/load-model-area/page', {
      pageNo: paginationConfig.value.current,
      pageSize: paginationConfig.value.pageSize,
      parentId: parentId || ''
    })
    tableData.value = areaData.data.list || []
    // 更新总条数
    if (areaData.data.total) {
      paginationConfigs.value['区域'].total = areaData.data.total
    }
  } else {
    const categoryData = await get('/powerload/load-model-category/page', {
      pageNo: paginationConfig.value.current,
      pageSize: paginationConfig.value.pageSize,
      parentId: parentId || ''
    })
    tableData.value = categoryData.data.list || []
    // 更新总条数
    if (categoryData.data.total) {
      paginationConfigs.value['设备'].total = categoryData.data.total
    }
  }
}

// 分页变化事件处理
const handlePaginationChange = (pagination) => {
  console.log('分页变化:', pagination)
  // 更新对应按钮类型的分页配置
  paginationConfigs.value[activeBtn.value].current = pagination.current
  paginationConfigs.value[activeBtn.value].pageSize = pagination.pageSize
  // 重新加载表格数据
  loadTableData(selectedNodeData.value?.key || null)
}
// 搜索事件
const onQuery = () => {
  console.log('执行左侧搜索，关键字:', searchValue.value)
  // 过滤树数据
  filterTreeData()
}

// 过滤树数据
const filterTreeData = () => {
  const keyword = searchValue.value.trim()
  if (!keyword) {
    // 如果搜索词为空，显示所有数据
    filteredTreeData.value = currentTreeData.value
    return
  }
  
  // 递归过滤树节点
  const filterNodes = (nodes) => {
    return nodes
      .map(node => {
        const filteredChildren = node.children ? filterNodes(node.children) : []
        const nodeMatches = node.title.toLowerCase().includes(keyword.toLowerCase())
        
        // 如果节点本身匹配或者有匹配的子节点，保留该节点
        if (nodeMatches || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          }
        }
        return null
      })
      .filter(Boolean)
  }
  
  filteredTreeData.value = filterNodes(currentTreeData.value)
}
// 自适应窗口
const resizeCharts = () => {

}

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', resizeCharts)
    initData();
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
})

// -------------------------- 左侧原有代码结束 --------------------------
// 右侧搜索框
const modelSearchValue = ref('')
// 右侧搜索事件
const onModelQuery = () => {
  console.log('执行右侧搜索，关键字:', modelSearchValue.value)
  // 此处可添加相应的过滤或接口请求逻辑
}

const initData = async () => {
  console.log('初始化数据')
  const { post } = useRequest()
  try {
    const data = await post('/powerload/common/list-loadModelAreaTree', {})
    modelAreaTreeData.value = data.data || []
    console.log('区域树数据:', modelAreaTreeData.value)
    
    const categoryData = await post('/powerload/common/list-loadModelCategoryTree', {})
    modelCategoryTreeData.value = categoryData.data || []
    console.log('设备树数据:', modelCategoryTreeData.value)
  
  // 更新过滤后的树数据
  filteredTreeData.value = currentTreeData.value
  // 根据当前激活的按钮加载表格数据
  loadTableData()
  } catch (error) {
    console.error('加载树数据失败:', error)
    // 加载失败时使用默认数据
    modelAreaTreeData.value = []
    modelCategoryTreeData.value = []
    // 更新过滤后的树数据
    filteredTreeData.value = currentTreeData.value
  }
}


const onSelectChange = (keys) => { selectedRowKeys.value = keys }

// 表格列配置 完全匹配设计稿 关键：给每列设置固定宽度 防止自动计算溢出
const columns = [
  { title: '序号', key: 'index', width: 80, align: 'center' },
  { title: '区域编码', dataIndex: 'code', key: 'code', width: 150, align: 'center' },
  { title: '区域名称', dataIndex: 'name', key: 'name', width: 150, align: 'center' },
  { title: '负荷区域描述', dataIndex: 'description', key: 'description', width: 350, align: 'center' },
  { title: '操作', key: 'action', align: 'center', width: 120 }
]


// 分页配置 完全匹配设计稿
// 为区域和设备分别维护分页状态
const paginationConfigs = ref({
  '区域': {
    total: 200,
    current: 1,
    pageSize: 10,
    pageNo: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共${total}条数据`,
    size: 'small'
  },
  '设备': {
    total: 200,
    current: 1,
    pageSize: 10,
    pageNo: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共${total}条数据`,
    size: 'small'
  }
})

// 当前分页配置计算属性
const paginationConfig = computed(() => {
  return paginationConfigs.value[activeBtn.value] || paginationConfigs.value['区域']
})

// 对话框相关
const areaModalVisible = ref(false)
const deviceModalVisible = ref(false)
// 是否为编辑模式
const isEditMode = ref(false)

// 区域表单数据（新增/编辑共用）
const areaForm = ref({
  id: '',
  name: '',
  code: '',
  description: ''
})

// 设备表单数据（新增/编辑共用）
const deviceForm = ref({
  id: '',
  name: '',
  code: '',
  description: ''
})

// 新增按钮点击事件
const handleAdd = () => {
  // 校验是否选中左侧树节点
  if (selectedKeys.value.length === 0) {
    // 提示用户选择树节点
    message.warning('请先选择左侧树节点')
    return
  }
  
  // 设置为新增模式
  isEditMode.value = false
  
  // 根据当前激活的按钮类型显示不同的对话框
  if (activeBtn.value === '区域') {
    // 重置表单
    areaForm.value = {
      id: '',
      name: '',
      code: '',
      description: ''
    }
    areaModalVisible.value = true
  } else {
    // 重置表单
    deviceForm.value = {
      id: '',
      name: '',
      code: '',
      description: ''
    }
    deviceModalVisible.value = true
  }
}

// 关闭区域对话框
const closeAreaModal = () => {
  areaModalVisible.value = false
  isEditMode.value = false
  // 重置表单
  areaForm.value = {
    id: '',
    name: '',
    code: '',
    description: ''
  }
}

// 关闭设备对话框
const closeDeviceModal = () => {
  deviceModalVisible.value = false
  isEditMode.value = false
  // 重置表单
  deviceForm.value = {
    id: '',
    name: '',
    code: '',
    description: ''
  }
}

// 刷新树数据
const refreshTreeData = async () => {
  const { post } = useRequest()
  try {
    const data = await post('/powerload/common/list-loadModelAreaTree', {})
    modelAreaTreeData.value = data.data || []
    
    const categoryData = await post('/powerload/common/list-loadModelCategoryTree', {})
    modelCategoryTreeData.value = categoryData.data || []
  
    // 更新过滤后的树数据
    filteredTreeData.value = currentTreeData.value
  } catch (error) {
    console.error('刷新树数据失败:', error)
  }
}

// 区域表单提交（新增/编辑）
const handleAreaSubmit = async () => {
  try {
    if (isEditMode.value) {
      // 编辑模式
      const { put } = useRequest()
      
      // 调用更新接口
      await put('/powerload/load-model-area/update', {
        id: areaForm.value.id,
        name: areaForm.value.name,
        code: areaForm.value.code,
        description: areaForm.value.description
      })
    } else {
      // 新增模式
      const { post } = useRequest()
      // 获取选中的树节点 key 作为 parentId
      const parentId = selectedKeys.value[0]
      // 调用保存接口
      await post('/powerload/load-model-area/create', {
        parentId,
        name: areaForm.value.name,
        code: areaForm.value.code,
        description: areaForm.value.description,
        parkCode: selectedNodeData.value?.parkCode || '',
        parkPowerLoadCode: selectedNodeData.value?.parkPowerLoadCode || '',
        status: 1,
        fullId: selectedNodeData.value?.fullId || '',
        fullName: selectedNodeData.value?.fullName || '',
        fullCode: selectedNodeData.value?.fullCode || ''
      })
    }
    
    // 关闭对话框
    closeAreaModal()
    
    // 刷新树数据
    await refreshTreeData()
    
    // 根据左侧树选中的节点刷新表格数据
    if (selectedNodeData.value && selectedNodeData.value.key) {
      loadTableData(selectedNodeData.value.key)
    } else {
      loadTableData()
    }
  } catch (error) {
    console.error(isEditMode.value ? '更新区域失败:' : '保存区域失败:', error)
  }
}

// 设备表单提交（新增/编辑）
const handleDeviceSubmit = async () => {
  try {
    if (isEditMode.value) {
      // 编辑模式
      const { put } = useRequest()
      
      // 调用更新接口
      await put('/powerload/load-model-category/update', {
        id: deviceForm.value.id,
        name: deviceForm.value.name,
        code: deviceForm.value.code,
        description: deviceForm.value.description
      })
    } else {
      // 新增模式
      const { post } = useRequest()
      // 获取选中的树节点 key 作为 parentId
      const parentId = selectedKeys.value[0]
      
      // 调用保存接口
      await post('/powerload/load-model-category/create', {
        parentId,
        name: deviceForm.value.name,
        code: deviceForm.value.code,
        description: deviceForm.value.description,
        parkCode: selectedNodeData.value?.parkCode || '',
        parkPowerLoadCode: selectedNodeData.value?.parkPowerLoadCode || '',
        status: 1,
        type: selectedNodeData.value?.type || 0,
        fullId: selectedNodeData.value?.fullId || '',
        fullName: selectedNodeData.value?.fullName || '',
        fullCode: selectedNodeData.value?.fullCode || ''
      })
    }
    
    // 关闭对话框
    closeDeviceModal()
    
    // 刷新树数据
    await refreshTreeData()
    
    // 根据左侧树选中的节点刷新表格数据
    if (selectedNodeData.value && selectedNodeData.value.key) {
      loadTableData(selectedNodeData.value.key)
    } else {
      loadTableData()
    }
  } catch (error) {
    console.error(isEditMode.value ? '更新设备失败:' : '保存设备失败:', error)
  }
}

// 编辑按钮点击事件
const handleEdit = (record) => {
  console.log('编辑数据:', record)
  let targetRecord = record
  
  // 如果 record 为空，从表格复选框中获取选中的数据
  if (!record || !record.id) {
    // 检查是否选中了数据
    if (!selectedRowKeys.value || selectedRowKeys.value.length === 0) {
      message.warning('请选择要编辑的项')
      return
    }
    
    // 检查是否选中了多条数据
    if (selectedRowKeys.value.length > 1) {
      message.warning('只需要选择一条数据')
      return
    }
    
    // 从 tableData 中找到选中的记录
    targetRecord = tableData.value.find(item => item.id === selectedRowKeys.value[0])
    
    // 如果没找到对应记录
    if (!targetRecord) {
      message.warning('请选择要编辑的项')
      return
    }
  }
  
  // 设置为编辑模式
  isEditMode.value = true
  
  // 根据当前激活的按钮类型显示不同的编辑对话框
  if (activeBtn.value === '区域') {
    // 填充表单数据
    areaForm.value = {
      id: targetRecord.id || '',
      name: targetRecord.name || '',
      code: targetRecord.code || '',
      description: targetRecord.description || ''
    }
    areaModalVisible.value = true
  } else {
    // 填充表单数据
    deviceForm.value = {
      id: targetRecord.id || '',
      name: targetRecord.name || '',
      code: targetRecord.code || '',
      description: targetRecord.description || ''
    }
    deviceModalVisible.value = true
  }
}

// 删除按钮点击事件
const handleDelete = (record) => {
  console.log('删除数据:', record)
  let deleteIds = []
  
  // 如果传入了 record，说明是单个删除
  if (record && record.id) {
    deleteIds = [record.id]
  } else {
    // 否则从表格复选框中获取选中的数据
    if (!selectedRowKeys.value || selectedRowKeys.value.length === 0) {
      message.warning('请选择要删除的项')
      return
    }
    deleteIds = selectedRowKeys.value
  }
  
  // 弹出删除确认框
  Modal.confirm({
    title: '确认删除',
    content: `您确定要删除${deleteIds.length > 1 ? '这些' : '这条'}数据吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        const { delete: deleteRequest } = useRequest()
        
        // 调用删除接口
        for (const id of deleteIds) {
          if (activeBtn.value === '区域') {
            await deleteRequest('/powerload/load-model-area/delete', { id })
          } else {
            await deleteRequest('/powerload/load-model-category/delete', { id })
          }
        }
        
        // 刷新树数据
        await refreshTreeData()
        
        // 根据左侧树选中的节点刷新表格数据
        if (selectedNodeData.value && selectedNodeData.value.key) {
          loadTableData(selectedNodeData.value.key)
        } else {
          loadTableData()
        }
        
        // 清空选中状态
        selectedRowKeys.value = []
        
        message.success('删除成功')
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    }
  })
}
// 导出按钮点击事件
const handleExport = () => {
  // 根据当前激活的按钮类型选择导出接口
  let url = ''
  if (activeBtn.value === '区域') {
    url = '/powerload/load-model-area/export-excel'
  } else {
    url = '/powerload/load-model-category/export-excel'
  }
  
  
}
// -------------------------- 右侧新增代码结束 --------------------------
</script>

<style scoped>
@import url('../../assets/css/antd.css');
/* 修复搜索框背景与边框样式 */
:deep(.custom-search .ant-input),
:deep(.custom-search .ant-input-affix-wrapper) {
  background-color: transparent !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  border-radius: 4px;
  box-shadow: none !important;
}
:deep(.custom-search .ant-input-affix-wrapper:hover),
:deep(.custom-search .ant-input-affix-wrapper-focused) {
  border-color: #32AFFF66 !important;
}
:deep(.custom-search .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.content-search .ant-input),
:deep(.content-search .ant-input-affix-wrapper),
:deep(.content-search .ant-input-affix-wrapper:hover),
:deep(.content-search .ant-input-affix-wrapper-focused) {
  border-color: rgba(255, 255, 255, 0.0) !important;
}

:deep(.content-search .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.95);
}

/* Tree 样式覆盖 */
:deep(.custom-tree-wrapper .ant-tree) {
  background: transparent !important;
  color: rgba(255, 255, 255, 0.85);
}
:deep(.custom-tree-wrapper .ant-tree-node-content-wrapper:hover) {
  background-color: rgba(24, 144, 255, 0.15) !important;
}
:deep(.custom-tree-wrapper .ant-tree-node-selected) {
  background-color: rgba(24, 144, 255, 0.25) !important;
  color: #32AFFF !important;
}
:deep(.custom-tree-wrapper .ant-tree-switcher) {
  color: rgba(255, 255, 255, 0.45);
}
/* 通用滚动条定制 */
.custom-tree-wrapper::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-tree-wrapper::-webkit-scrollbar-thumb,
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-tree-wrapper::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.metric-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 13px;
  color: #FFFFFFCC;
}
.metric-values {
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 28px;
  color: #FFFFFF;
  line-height: 42px;
}
.img-content {
  height: 40%;
}
.monitor-button {
  background: rgba(7,59,109,0.5);
}

/* -------------------------- 新增表格相关样式 完全参考告警页面 -------------------------- */
:deep(.ant-table.ant-table-fixed-header) {
  height: calc(100% - 120px);
}
/* 深色表格样式覆盖 */
:deep(.custom-dark-table .ant-table-thead > tr > th) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr > td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr:hover > td) {
  background-color: rgba(50, 175, 255, 0.1) !important;
}
:deep(.custom-dark-table .ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: rgba(50, 175, 255, 0.2) !important;
}
/* 深色输入框样式 */
:deep(.custom-dark-input .ant-input) {
  background-color: transparent !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  border-radius: 4px;
  box-shadow: none !important;
}
:deep(.custom-dark-input .ant-input:hover),
:deep(.custom-dark-input .ant-input-focused) {
  border-color: #32AFFF66 !important;
}
:deep(.custom-dark-input .ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

/* 关键修复：强制表格宽度不超过父容器 */
:deep(.custom-dark-table .ant-table-container) {
  width: 100% !important;
  overflow-x: auto !important;
}
:deep(.custom-dark-table table) {
  width: 100% !important;
  table-layout: fixed !important;
}
</style>