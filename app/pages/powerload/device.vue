<template>
  <div class="flex flex-col w-full h-screen p-4 box-border overflow-hidden bg-transparent text-white font-sans">
    <div class="flex gap-2 flex-1 w-full overflow-hidden">
      <!-- 左侧树状菜单 完全保留 不要修改！！！ -->
      <div class="w-[280px] shrink-0 flex flex-col h-full bg-transparent" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
        <div class="flex justify-between items-center mt-1 mb-2">
          <span class="font-bold text-[14px] ml-2 mt-1 p-1">负荷配置</span>
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
      
      <!-- 右侧配置 修复宽度溢出问题 关键：加overflow:hidden和width:0 -->
      <div class="flex-1 flex flex-col h-full bg-transparent overflow-hidden" style="border-radius: 2px; background: rgba(255,255,255,0.04);">
        <!-- 满行搜索栏 完全和左侧一致 带搜索图标 -->
        <div class="bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] px-2 py-1 mx-4 mb-4 shrink-0 w-[calc(100%-32px)] mt-3.5">
          <div class="flex gap-2 items-center custom-search content-search flex-wrap">
            <div class="flex items-center gap-1 flex-1 min-w-[200px]">
              <label class="text-[#FFFFFF99] text-sm min-w-[40px]">编码</label>
              <a-input
                v-model:value="modelSearchParams.code"
                placeholder=""
                allow-clear
                class="border border-[rgba(255,255,255,0.2)] flex-1"
              >
              </a-input>
            </div>
            <div class="flex items-center gap-1 flex-1 min-w-[200px]">
              <label class="text-[#FFFFFF99] text-sm min-w-[40px]">名称</label>
              <a-input
                v-model:value="modelSearchParams.name"
                placeholder=""
                allow-clear
                class="border border-[rgba(255,255,255,0.2)] flex-1"
              >
              </a-input>
            </div>
            <div class="flex items-center gap-1 flex-1 min-w-[200px]">
              <label class="text-[#FFFFFF99] text-sm min-w-[40px]">描述</label>
              <a-input
                v-model:value="modelSearchParams.description"
                placeholder=""
                allow-clear
                class="border border-[rgba(255,255,255,0.2)] flex-1"
              >
              </a-input>
            </div>
            <a-button type="primary" class="!bg-[#32AFFF] !border-[#32AFFF] hover:!opacity-80" @click="onModelQuery">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </a-button>
            <a-button class="!bg-transparent !border-[#FFFFFF33] !text-[#FFFFFF99] hover:!text-white hover:!border-[#fefefe30]" @click="clearModelSearch">
              清空
            </a-button>
          
          </div>
        </div>
        
        <!-- 表格容器 关键：加width:100%和overflow:hidden -->
        <div class="flex-1 bg-[#FFFFFF0A] border border-[#FFFFFF0D] rounded-[4px] flex flex-col min-h-0 overflow-hidden mx-4 mb-4 w-[calc(100%-32px)]">
          <!-- 表格标题与操作按钮 -->
          <div class="flex justify-between items-center px-6 py-2 border-b border-[#FFFFFF14] shrink-0">
            <span class="text-[14px] font-normal text-white tracking-wide">负荷配置列表</span>
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
                  <!-- 负荷配置描述内容左对齐 标题保持居中 -->
                  <span class="text-[#FFFFFFCC] text-[14px] text-left block">{{ text }}</span>
                </template>

                <template v-else-if="column.key === 'status'">
                  <span class="text-[14px]" :class="(text === 1 || text === '1') ? 'text-green-400' : 'text-red-400'">
                    {{ (text === 1 || text === '1') ? '在用' : '停用' }}
                  </span>
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

  <!-- 配置对话框（新增/编辑共用） -->
  <a-modal
    v-model:open="areaModalVisible"
    :title="isEditMode ? '编辑配置' : '新增配置'"
    @ok="handleAreaSubmit"
    @cancel="closeAreaModal"
  >
    <a-form layout="vertical" :model="areaForm" :rules="rules" ref="formRef">
      <a-form-item label="负荷设备类型" name="modelCategoryName">
        <TreeSelect
          ref="treeSelectRef"
          :tree-data="modelCategoryTreeData"
          placeholder="请选择设备类型"
          @select="selectModelCategory"
          v-model="areaForm.modelCategoryName"
          theme="dark"
          :node-types="['loadModelCategory']"
          width="300px"
          class="w-full"
        />
      </a-form-item>
     
      <a-form-item label="编码" name="code">
        <a-input v-model:value="areaForm.code" placeholder="请输入配置编码" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="areaForm.name" placeholder="请输入配置名称" />
      </a-form-item>
       <a-form-item label="使用状态" name="status">
        <a-select v-model:value="areaForm.status" class="w-[100px]">
          <a-select-option :value="1">在用</a-select-option>
          <a-select-option :value="0">停用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="description">
        <a-textarea v-model:value="areaForm.description" placeholder="请输入备注" rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, computed,onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRequest } from "~/composables/useRequest"
import TreeSelect from "~/components/TreeSelect.vue"
import { message, Modal } from 'ant-design-vue'

definePageMeta({
  layout: 'layout'
})
const treeSelectRef = ref(null)
const formRef = ref(null)
const searchValue = ref('')
const selectedKeys = ref([])
const expandedKeys = ref([])
const modelAreaTreeData = ref([])
// 当前选中的树节点数据
const selectedNodeData = ref(null)
// 过滤后的树数据
const filteredTreeData = ref([])
// 模拟表格数据 完全匹配设计稿内容
const tableData = ref([])
// 表格选中行 
const selectedRowKeys = ref([])

// 树节点选择事件处理
const handleTreeSelect = (selectedKeys, info) => {
  console.log('选中的节点:', info)
  // 获取选中的节点数据
  if (info.selected && info.node && info.node) {
    selectedNodeData.value = info.node
    console.log('选中节点数据:', selectedNodeData.value)
    // 重新加载表格数据，传入选中节点的 code 
    loadTableData(info.node.code)
  } else {
    // 取消选中时，查询所有数据
    selectedNodeData.value = null
    loadTableData(null)
  }
}

// 加载表格数据
const loadTableData = async (code = null) => {
  console.log('加载表格数据，code:', code)
  const { get } = useRequest()
  
  const areaData = await get('/powerload/load-device/page', {
    pageNo: paginationConfig.value.current,
    pageSize: paginationConfig.value.pageSize,
    modelAreaCode: code || null,
    code: modelSearchParams.value.code || null,
    name: modelSearchParams.value.name || null,
    description: modelSearchParams.value.description || null
  })
  tableData.value = areaData.data.list || []
  // Log the first record's status to debug
  if (tableData.value.length > 0) {
    console.log('First record status:', tableData.value[0].status, typeof tableData.value[0].status)
  }
  // 更新总条数
  if (areaData.data.total) {
    paginationConfig.value.total = areaData.data.total
  }
}

// 分页变化事件处理
const handlePaginationChange = (pagination) => {
  console.log('分页变化:', pagination)
  // 更新分页配置
  paginationConfig.value.current = pagination.current
  paginationConfig.value.pageSize = pagination.pageSize
  // 重新加载表格数据
  loadTableData(selectedNodeData.value?.code || null)
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
    filteredTreeData.value = modelAreaTreeData.value
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
  
  filteredTreeData.value = filterNodes(modelAreaTreeData.value)
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
const modelSearchParams = ref({
  code: '',
  name: '',
  description: ''
})

// 搜索栏显示状态
const searchBarVisible = ref(false)
// 右侧搜索事件
const onModelQuery = () => {
  console.log('执行右侧搜索，搜索条件:', modelSearchParams.value)
  // 重新加载表格数据，传入搜索条件
  loadTableData(selectedNodeData.value?.code || null)
}

// 清空搜索条件
const clearModelSearch = () => {
  // 清空所有搜索条件
  modelSearchParams.value = {
    code: '',
    name: '',
    description: ''
  }
  // 重新加载表格数据
  loadTableData(selectedNodeData.value?.code || null)
}

// 切换搜索栏显示/隐藏
const toggleSearchBar = () => {
  searchBarVisible.value = !searchBarVisible.value
}

const initData = async () => {
  console.log('初始化数据')
  const { post } = useRequest()
  try {
    const data = await post('/powerload/common/list-loadModelAreaTree', {})
    modelAreaTreeData.value = data.data || []
    console.log('配置树数据:', modelAreaTreeData.value)
  
  // 更新过滤后的树数据
  filteredTreeData.value = modelAreaTreeData.value
  // 加载表格数据
  loadTableData()
  } catch (error) {
    console.error('加载树数据失败:', error)
    // 加载失败时使用默认数据
    modelAreaTreeData.value = []
    // 更新过滤后的树数据
    filteredTreeData.value = modelAreaTreeData.value
  }
}


const onSelectChange = (keys) => { selectedRowKeys.value = keys }

// 表格列配置 完全匹配设计稿 关键：给每列设置固定宽度 防止自动计算溢出
const columns = [
  { title: '序号', key: 'index', width: 80, align: 'center' },
  { title: '设备编码', dataIndex: 'code', key: 'code', width: 150, align: 'center' },
  { title: '设备名称', dataIndex: 'name', key: 'name', width: 150, align: 'center' },
  { title: '规格型号', dataIndex: 'modelCategoryCode', key: 'modelCategoryCode', width: 150, align: 'center' },
  { title: '使用状态', dataIndex: 'status', key: 'status', width: 150, align: 'center' },
  // { title: '设备重要性', dataIndex: 'importanceLevel', key: 'importanceLevel', width: 150, align: 'center' },
  { title: '负荷类型', dataIndex: 'loadTypeName', key: 'loadTypeName', width: 150, align: 'center' },
  { title: '备注', dataIndex: 'description', key: 'description', width: 300, align: 'center' },
  { title: '操作', key: 'action', align: 'center', width: 120 }
]


// 分页配置 完全匹配设计稿
const paginationConfig = ref({
  total: 200,
  current: 1,
  pageSize: 20,
  pageNo: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共${total}条数据`,
  size: 'small'
})

// 对话框相关
const areaModalVisible = ref(false)
// 是否为编辑模式
const isEditMode = ref(false)

// 配置表单数据（新增/编辑共用）
const areaForm = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  modelCategoryName: '',
  modelCategoryCode: '',
  parkCode: '',
  parkPowerLoadCode: '',
  status: 1
})

// 表单校验规则
const rules = {
  code: [
    { required: true, message: '请输入编码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  modelCategoryName: [
    { required: true, message: '请选择设备类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择使用状态', trigger: 'change' }
  ]
}

// 设备类型树数据
const modelCategoryTreeData = ref([])

// 新增按钮点击事件
const handleAdd = () => {
  loadModelCategoryTreeData()
  // 校验是否选中左侧树节点
  if (selectedKeys.value.length === 0) {
    // 提示用户选择树节点
    message.warning('请先选择左侧树节点')
    return
  }
  
  // 设置为新增模式
  isEditMode.value = false
  
  // 重置表单
  areaForm.value = {
    id: '',
    name: '',
    code: '',
    description: '',
    modelCategoryName: '',
    modelCategoryCode: '',
    parkCode: selectedNodeData.value?.parkCode || '',
    parkPowerLoadCode: selectedNodeData.value?.parkPowerLoadCode || '',
    modelAreaCode: selectedNodeData.value?.code || '',
    status: 1
  }
  console.log('新增表单 status:', areaForm.value.status, typeof areaForm.value.status)
  areaModalVisible.value = true
}

// 关闭配置对话框
const closeAreaModal = () => {
  areaModalVisible.value = false
  isEditMode.value = false
  // 重置表单
  areaForm.value = {
    id: '',
    name: '',
    code: '',
    description: '',
    modelCategoryName: '',
    modelCategoryCode: '',
    parkCode: '',
    parkPowerLoadCode: '',
    modelAreaCode: '',
    status: 1
  }
}

// 刷新树数据
const refreshTreeData = async () => {
  const { post } = useRequest()
  try {
    const data = await post('/powerload/common/list-loadModelAreaTree', {})
    modelAreaTreeData.value = data.data || []
  
    // 更新过滤后的树数据
    filteredTreeData.value = modelAreaTreeData.value
  } catch (error) {
    console.error('刷新树数据失败:', error)
  }
}

// 加载设备类型树数据
const loadModelCategoryTreeData = async () => {
  const { post } = useRequest()
  try {
    const data = await post('/powerload/common/list-loadModelCategoryTree', {})
    modelCategoryTreeData.value = data.data || []
  } catch (error) {
    console.error('加载设备类型树数据失败:', error)
  }
}

// 选择设备类型
const selectModelCategory = (node) => {
  if (node) {
    areaForm.value.modelCategoryName = node.title
    areaForm.value.modelCategoryCode = node.code
  }
}

// 配置表单提交（新增/编辑）
const handleAreaSubmit = async () => {
  try {
    // 表单校验
    await formRef.value.validate()
    
    if (isEditMode.value) {
      // 编辑模式
      const { put } = useRequest()
      
      // 调用更新接口
      await put('/powerload/load-device/update', {
        id: areaForm.value.id,
        name: areaForm.value.name,
        code: areaForm.value.code,
        status: areaForm.value.status,
        description: areaForm.value.description,
        modelCategoryCode: areaForm.value.modelCategoryCode,
        modelCategoryName: areaForm.value.modelCategoryName
      })
    } else {
      // 新增模式
      const { post } = useRequest()
      // 获取选中的树节点 key 作为 parentId
      const parentId = selectedKeys.value[0]
      // 调用保存接口
      await post('/powerload/load-device/create', {
        name: areaForm.value.name,
        code: areaForm.value.code,
        description: areaForm.value.description,
        modelCategoryCode: areaForm.value.modelCategoryCode,
        modelCategoryName: areaForm.value.modelCategoryName,
        parkCode: areaForm.value.parkCode,
        parkPowerLoadCode: areaForm.value.parkPowerLoadCode,
        status: areaForm.value.status,
        modelAreaCode: areaForm.value.modelAreaCode,
      })
    }
    
    message.success(isEditMode.value ? '更新成功' : '保存成功')
    
    // 关闭对话框
    closeAreaModal()
    
    // 刷新树数据
    await refreshTreeData()
    
    // 根据左侧树选中的节点刷新表格数据
    if (selectedNodeData.value && selectedNodeData.value.code) {
      loadTableData(selectedNodeData.value.code)
    } else {
      loadTableData()
    }
  } catch (error) {
    if (error.errorFields) {
      // 表单校验失败
      console.error('表单校验失败:', error)
    } else {
      console.error(isEditMode.value ? '更新配置失败:' : '保存配置失败:', error)
    }
  }
}

// 编辑按钮点击事件
const handleEdit = (record) => {
  loadModelCategoryTreeData()
  console.log('编辑数据:', record)
  console.log('编辑数据 status:', record.status, typeof record.status)
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
  
  // 填充表单数据
  areaForm.value = {
    id: targetRecord.id || '',
    name: targetRecord.name || '',
    code: targetRecord.code || '',
    status: targetRecord.status,
    description: targetRecord.description || '',
    modelCategoryName: targetRecord.modelCategoryName || '',
    modelCategoryCode: targetRecord.modelCategoryCode || '',
    parkCode: targetRecord.parkCode || '',
    parkPowerLoadCode: targetRecord.parkPowerLoadCode || '',
    modelAreaCode: targetRecord.modelAreaCode || ''
  }
  console.log('填充表单后 status:', areaForm.value.status, typeof areaForm.value.status)
  areaModalVisible.value = true
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
          await deleteRequest('/powerload/load-device/delete', { id })
        }
        
        // 刷新树数据
        await refreshTreeData()
        
        // 根据左侧树选中的节点刷新表格数据
        if (selectedNodeData.value && selectedNodeData.value.code) {
          loadTableData(selectedNodeData.value.code)
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
const handleExport = async () => {
  Modal.confirm({
    title: '确认导出',
    content: `您确定要导出负荷配置数据吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      // 导出配置数据
      const url = '/powerload/load-device/export-excel'
      
      try {
        // 构建查询参数
        const params = {
          code: modelSearchParams.value.code || undefined,
          name: modelSearchParams.value.name || undefined,
          description: modelSearchParams.value.description || undefined
        }
        
        // 发送请求获取文件数据
        const { get: getRequest } = useRequest()
        const response = await getRequest(url, params, {
          responseType: 'blob' // 确保响应类型为 blob
        })
        
        // 创建下载链接
        const downloadUrl = window.URL.createObjectURL(response)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = '负荷模型(配置).xls'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // 释放 URL 对象
        window.URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        console.error('导出失败:', error)
        message.error('导出失败')
      }
    }
  })
}
// -------------------------- 右侧新增代码结束 --------------------------
</script>

<style scoped>
@import url('../../assets/css/antd.css');

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