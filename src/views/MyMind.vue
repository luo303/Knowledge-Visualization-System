<template>
  <header class="header-constrols">
    <div class="search-container" style="border-radius: 20px">
      <!-- 搜索框区域 - 使用Element Plus的el-autocomplete组件 -->
      <div class="search-box">
        <el-autocomplete
          v-model="searchQuery"
          :fetch-suggestions="querySearch"
          placeholder="搜索导图名称或来源文件..."
          @select="handleSelect"
          @keyup.enter="handleSearch"
          @clear="handleClear"
          clearable
          class="search-autocomplete"
          :style="{ borderRadius: '20px' }"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-autocomplete>
      </div>
      <!-- 无结果提示 -->
      <div class="no-result" v-if="shouldShowNoResult">
        未找到相关导图，请检查关键词或筛选条件
      </div>
    </div>

    <div>
      <div class="filter-container">
        <el-select
          v-model="currentSort"
          @change="handleSelect1"
          class="filter-select"
          placeholder="排序方式"
          :style="{ borderRadius: '20px' }"
        >
          <el-option label="最近生成" value="latest" />
          <el-option label="最早生成" value="earliest" />
        </el-select>
        <el-select
          v-model="currentType"
          @change="handleSelect2"
          placeholder="请选择导图类型"
          class="filter-select"
          :style="{ borderRadius: '20px' }"
        >
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.text"
            :value="option.value"
          />
        </el-select>
      </div>
    </div>
  </header>

  <!-- 导图预览模块 -->
  <main class="page-main" ref="mainContent">
    <div class="mindmap-preview-container">
      <!-- 导图卡片模块 - 使用Element Plus Card组件 -->
      <el-card
        v-for="map in paginatedMindMaps"
        :key="map.mapId"
        class="mindmap-card"
        @click="handleCardClick(map, $event)"
        shadow="hover"
      >
        <!-- 勾选框 - 使用Element Plus Checkbox组件 -->
        <el-checkbox
          v-model="map.selected"
          class="batch-checkbox"
          size="large"
        ></el-checkbox>

        <!-- 导图缩略图 -->
        <div class="map-thumbnail"><ProPreview :Map="map" /></div>

        <!-- 导图信息 -->
        <div class="map-info">
          <h3 class="map-name">{{ map.title }}</h3>
          <div class="map-meta">
            <span class="map-type">{{ getTypeName(map.layout) }}</span>
            <span class="map-time">{{ formatTime(map.createdAt) }}</span>
          </div>
        </div>
      </el-card>
      <!-- 空状态 (无导图时显示) -->
      <div class="empty-state" v-if="mindmaps.length === 0">
        <img
          src="@/assets/images/empty-state.png"
          alt="暂无导图"
          class="empty-img"
        />
        <p class="empty-text">暂无生成的导图，快去创建吧~</p>
        <el-button type="primary" size="large" @click="handleCreateNew"
          >+ 创建导图</el-button
        >
      </div>
    </div>
  </main>

  <!-- 底部容器 - Element Plus风格布局 -->
  <div class="page-footer">
    <!-- 左侧批量操作标签 -->
    <div class="footer-left">
      <div class="batch-label">
        <el-icon class="icon-margin"><Folder /></el-icon>
        <span>请点击勾选框进行批量操作</span>
      </div>
    </div>

    <!-- 中间分页区域 -->
    <div class="footer-center">
      <el-pagination
        v-if="totalCount > 0"
        background
        layout="prev, pager, next"
        :total="totalCount"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <div class="footer-right"></div>
  </div>

  <!-- 批量操作区 -->
  <div class="batch-action-bar" v-show="selectedCount > 0">
    <span class="selected-count">已选择{{ selectedCount }}个导图</span>
    <div class="batch-buttons">
      <el-button
        type="primary"
        size="large"
        @click="ToExport"
        class="export-btn"
        >批量导出</el-button
      >
      <el-dialog v-model="dialogFormVisible" title="导出" width="500">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item
            prop="name"
            label="导出文件名"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item
            prop="type"
            label="导出文件类型"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.type" placeholder="选择格式">
              <el-option label="png格式" value="png" />
              <el-option label="pdf格式" value="pdf" />
              <el-option label="xmind格式" value="xmind" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="Export">确认</el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogDeleteVisible" title="批量删除" width="500">
        <div>
          <el-alert
            :title="
              hasEditingMap
                ? '警告：您选中了正在编辑的导图，删除将清空编辑数据！'
                : '确认删除所选导图？'
            "
            type="warning"
            :closable="false"
          />
        </div>
        <template #footer>
          <div>
            <el-button @click="cancelDelete">取消</el-button>
            <el-button type="primary" @click="confirmDelete"
              >确认删除</el-button
            >
          </div>
        </template>
      </el-dialog>
      <el-button type="primary" size="large" @click="ToDelete"
        >批量删除</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProPreview from '@/components/ProPreview.vue'
import type { MindMapOptions } from '@/utils/type'
import { ElMessageBox, ElMessage } from 'element-plus'
import { exports } from '@/utils/export.ts'
import { getMindMapList } from '@/api/user/index'
import { useLayoutStore } from '@/stores/modules/layout'
import { getMap, delMap } from '@/api/user/index'

// 批量删除相关响应式数据
const dialogDeleteVisible = ref(false)
const hasEditingMap = ref<any>(false)
import { Search, Folder } from '@element-plus/icons-vue'

// 搜索相关状态
const searchQuery = ref('')
const mindmaps = ref<MindMapOptions[]>([])
const LayoutStore = useLayoutStore()
const router = useRouter()
const dialogFormVisible = ref(false)
const form = ref({
  name: '',
  type: ''
})
const formRef = ref()
const formLabelWidth = ref('140px')
const rules = ref({
  name: [{ required: true, message: '导出名不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择导出类型', trigger: 'blur' }]
})

// 搜索关键词的响应式变量
const searchKeyword = ref('')
// 移除了不再需要的搜索相关变量，因为el-autocomplete组件内置了这些功能

// Element Plus el-autocomplete的查询方法 - 使用更精确的类型定义
interface AutocompleteOption {
  value: string
}

const querySearch = (
  query: string,
  callback: (data: AutocompleteOption[]) => void
): void => {
  if (query.trim()) {
    // 模糊匹配逻辑 - 包含关键词即显示
    const results: AutocompleteOption[] = mindmaps.value
      .map(map => map.title)
      .filter(title => {
        if (!title) return false
        return title.toLowerCase().includes(query.toLowerCase())
      })
      .filter((title, index, self) => self.indexOf(title) === index)
      .map(title => ({ value: title }))
    callback(results)
  } else {
    callback([])
  }
}

// 处理选择建议项 - 使用更精确的类型定义
const handleSelect = (item: AutocompleteOption): void => {
  searchQuery.value = item.value
  searchKeyword.value = item.value
  handleSearch()
}

// 处理搜索 - 添加类型定义
const handleSearch = (): void => {
  const query = searchQuery.value.trim()
  searchKeyword.value = query
  resetPagination() // 搜索逻辑变化时重置分页
}

// 清除搜索内容 - 添加类型定义
const handleClear = (): void => {
  searchQuery.value = ''
  searchKeyword.value = ''
  resetPagination()
}

// "最近生成" 模块：
const emit = defineEmits<{
  (e: 'sortChange', sortValue: string): void
  (e: 'typeChange', type: string): void
}>()

// 响应式状态：当前选中的排序值（默认最近生成）
const currentSort = ref('latest')

// 选择排序选项
const handleSelect1 = (value: string) => {
  currentSort.value = value
  emit('sortChange', value)
  resetPagination()
}

// "导图类型" 模块：
const typeOptions = [
  { value: 'all', text: '全部' },
  { value: 'logicalStructure', text: '逻辑结构图' },
  { value: 'mindMap', text: '思维导图' },
  { value: 'organizationStructure', text: '组织结构图' },
  { value: 'catalogOrganization', text: '目录组织图' },
  { value: 'timeline', text: '时间轴' },
  { value: 'fishbone', text: '鱼骨图' },
  { value: 'verticalTimeline', text: 'v0.6.6+竖向时间轴' }
]

// 响应体状态：
const currentType = ref('all') // 当前选中的类型，默认全部

const handleSelect2 = (value: string) => {
  emit('typeChange', value)
  resetPagination()
}

// 导图数据：

const totalCount = ref(0) // 存储从后端获取的原始导图数，用于分页

// 筛选并排序后的导图列表：
const filteredMindMaps = computed(() => {
  // 时间排序：
  let sortedResult = [...mindmaps.value].sort((a, b) => {
    // 切换时间戳比较：
    const timeA = new Date(a.updatedAt || '').getTime()
    const timeB = new Date(b.updatedAt || '').getTime()
    if (currentSort.value === 'latest') {
      return timeB - timeA
    } else {
      return timeA - timeB
    }
  })

  // 根据类型筛选：
  if (currentType.value !== 'all') {
    sortedResult = sortedResult.filter(map => map.layout === currentType.value)
  }

  // 根据搜素关键词筛选：
  if (searchKeyword.value.trim()) {
    const keywords = searchKeyword.value
      .trim()
      .split(' ')
      .filter(k => k)
    sortedResult = sortedResult.filter(map => {
      return keywords.every(keyword =>
        map.title.toLowerCase().includes(keyword.toLowerCase())
      )
    })
  }

  return sortedResult
})

// 搜素无结果处理：
const shouldShowNoResult = computed(() => {
  return (
    filteredMindMaps.value.length === 0 &&
    (currentType.value !== 'all' || Boolean(searchKeyword.value.trim()))
  )
})

// 页面加载时获取导图数据：
onMounted(() => {
  // 接口请求：
  fetchMyMindMaps()
})

// 获取数据：
const fetchMyMindMaps = async () => {
  try {
    // 调用接口：
    const res = await getMindMapList()
    const response = res as any
    if (response.Code === 200 && response.Data) {
      const mapWithSelected = response.Data.list.map((map: MindMapOptions) => ({
        ...map,
        selected: false,
        createTime: map.createAt || ''
      })) as MindMapOptions[]

      mindmaps.value = mapWithSelected
      totalCount.value = response.Data.total
    } else {
      const errorMsg = response.Message || '未知错误'
      ElMessage.error(`获取思维导图失败：${errorMsg}`)
    }
  } catch (error) {
    console.error('获取导图数据失败', error)
    ElMessage.error('网络错误，获取导图列表失败，请稍后再试...')
  }
}

// 时间格式化：
const formatTime = (time: string | undefined) => {
  if (!time) {
    return '未知时间'
  }
  const n = time.replace('T', ' ').split('+')[0]
  const normalizedTime = n as any
  const [date, hour] = normalizedTime.split(' ')
  const monthDay = date.slice(5)
  const hourMinute = hour.slice(0, 5)
  return `${hourMinute}/${monthDay}`
}

// 卡片点击事件：
const handleCardClick = async (map: any, e: MouseEvent) => {
  const target = e.target as HTMLElement
  // 确保点击el-checkbox时不会触发卡片点击事件
  if (!target.closest('.el-checkbox') && !target.closest('.map-actions')) {
    try {
      // 显示确认弹窗，询问用户是否要跳转到手动编辑区
      await ElMessageBox.confirm('确定要跳转到手动编辑区吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // 用户确认后，获取导图数据并跳转
      const res = await getMap(map.mapId)
      const response = res as any
      const currentMapId = map.mapId
      if (currentMapId && currentMapId !== 'xxx') {
        LayoutStore.data = response.Data
        LayoutStore.currentChatId = ''
        LayoutStore.currentChat = {
          title: '',
          conversation_id: '',
          messages: []
        }
        router.push({ name: 'handedit', query: { mapId: currentMapId } })
      } else {
        ElMessage.warning('导图数据未找到或未生成正式ID，无法跳转')
      }
    } catch (error) {
      // 判断是否是用户取消操作
      if (error === 'cancel') {
        // 用户取消了跳转，不做任何操作
        return
      }
      console.error('加载导图卡片数据失败：', error)
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      ElMessage.error(`加载导图卡片数据失败：${errorMsg}`)
    }
  }
}

// 勾选框处理事件：
// 新建导图：
const handleCreateNew = () => {
  // 跳转到导图生成区（CreateMind页面）
  router.push({ name: 'createmind' })
}

// 根据布局类型layout获取对应中文名称：
const getTypeName = (layout: string): string => {
  const option = typeOptions.find(item => item.value === layout)
  return option ? option.text : '未知类型'
}

// 分页：
// 分页相关状态:
const currentPage = ref(1)
const pageSize = ref(8)

// 计算当前可显示的数据：
const paginatedMindMaps = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredMindMaps.value.slice(startIndex, endIndex)
})

// Element Plus分页组件会自动处理页码显示逻辑，不再需要手动计算

// 切换页码 - Element Plus分页组件使用
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 重置分页：
const resetPagination = () => {
  currentPage.value = 1
}

// 选中导图数量：
const selectedCount = computed(() => {
  return mindmaps.value.filter(map => map.selected).length
})

//导出按钮
const ToExport = () => {
  form.value.name = LayoutStore.data.title
  dialogFormVisible.value = true
}
//取消按钮
const cancel = () => {
  formRef.value.resetFields()
  dialogFormVisible.value = false
}

// 打开删除对话框
const ToDelete = () => {
  // 获取当前正在编辑的导图ID
  const editingMapId = LayoutStore.data?.mapId
  // 获取用户选中的导图ID列表
  const selectedMapIds = mindmaps.value
    .filter(map => map.selected)
    .map(map => map.mapId)

  // 判断是否选中了正在编辑的导图
  hasEditingMap.value =
    editingMapId &&
    editingMapId !== 'xxx' &&
    selectedMapIds.includes(editingMapId)

  dialogDeleteVisible.value = true
}

// 取消删除
const cancelDelete = () => {
  dialogDeleteVisible.value = false
}

// 确认删除
const confirmDelete = async () => {
  // 检查是否有选中的导图
  if (selectedCount.value === 0) {
    ElMessage.warning('请选择要删除的思维导图')
    return
  }

  // 如果选中了正在编辑的导图，先清空Layout仓库
  if (hasEditingMap.value) {
    LayoutStore.clearMap()
  }

  // 执行批量删除操作
  await handleBatchDelete()
  dialogDeleteVisible.value = false
}
// 批量导出
const Export = async () => {
  try {
    // 校验表单数据
    await formRef.value.validate()

    // 获取选中的思维导图
    const selectedMaps = mindmaps.value.filter(map => map.selected)

    if (selectedMaps.length === 0) {
      ElMessage.warning('请选择要导出的思维导图')
      return
    }

    // 调用导出工具
    await exports(selectedMaps, form.value.type)

    ElMessage.success(`${selectedMaps.length}个导图导出成功！`)

    dialogFormVisible.value = false
    formRef.value.resetFields()
  } catch (error) {
    console.error('批量导出失败：', error)
    let errorMsg = '未知错误'
    if (error instanceof Error) {
      errorMsg = error.message
    } else if (typeof error === 'string') {
      errorMsg = error
    }
    ElMessage.error(`导出失败：${String(errorMsg)}`)
  }
}

// 批量删除确认逻辑已移除，使用新的对话框实现

// 批量删除逻辑：
const handleBatchDelete = async () => {
  const countToDelete = selectedCount.value
  const selectedMapIds = mindmaps.value
    .filter(map => map.selected)
    .map(map => map.mapId)
  try {
    const res = await delMap(selectedMapIds)
    const response = res as any

    if (response.Code === 200) {
      // 过滤掉已删除的导图
      mindmaps.value = mindmaps.value.filter(
        map => !selectedMapIds.includes(map.mapId)
      )
      ElMessage.success(`已删除${countToDelete}个导图`)
    } else {
      ElMessage.error(response.Message || '删除失败，请稍后再试...')
    }
  } catch (error) {
    console.error('删除导图失败', error)
    ElMessage.error('删除失败，请稍后再试...')
  }
}

// 监听选中导图的数量变化：
watch(
  [searchKeyword, currentSort, currentType],
  () => {
    resetPagination() // 重置页码
    fetchMyMindMaps() // 获取数据
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.header-constrols {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  width: 100%;
  box-sizing: border-box;
  z-index: 2;
}

.search-container {
  display: flex;
  flex-direction: column;
  left: 8%;
  margin-left: 1.1%;
  padding: 0px;
  box-sizing: border-box;
  width: 280px; /* 设置合适的宽度 */
}

.search-box {
  display: flex;
  position: relative;
}

/* Element Plus el-autocomplete 样式优化 */
.search-autocomplete {
  width: 100%;
}

/* 使用 Element Plus 提供的CSS变量以保持一致性 */
:deep(.el-autocomplete) {
  --el-input-height: 36px;
}

/* 优化后缀内容布局 */
:deep(.el-autocomplete__suffix-inner) {
  display: flex;
  align-items: center;
}

/* 优化清除按钮样式 */
:deep(.el-autocomplete__suffix-inner .el-button--circle) {
  padding: 0;
  width: 20px;
  height: 20px;
  min-width: 0;
  margin-left: 4px;
  transition: var(--el-transition-fast);
}

/* 优化图标大小 */
:deep(.el-autocomplete__suffix-inner .el-button__icon) {
  font-size: 14px;
}

/* 添加鼠标悬浮效果 */
:deep(.el-autocomplete__suffix-inner .el-button--circle:hover) {
  background-color: var(--el-fill-color-light);
}

/* 优化下拉菜单样式 */
:deep(.el-autocomplete-suggestion) {
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
}

.no-result {
  color: #f56c6c;
  font-size: 14px;
  padding: 8px 16px;
}
// "导图类型" 容器：
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8.5%;
  gap: 10px;
  height: 35px;
}

.filter-select {
  width: 150px;
}
// 清除筛选按钮：
.clear-btn {
  margin: 4px;
  padding: 8px 12px;
  font-size: 14px;
  color: #666;
  border-top: 1px dashed #c0bfbf;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: #f56c6c;
    background-color: #fff5f5;
  }
}

// "导图预览" 模块：
// 中部容器：
.page-main {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}
.mindmap-preview-container {
  padding: 2%;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 0 auto;
  max-width: 1400px;
}

// 导图卡片 - 使用Element Plus Card组件样式
.mindmap-card {
  width: 100%; /* 改为100%宽度，利用网格间距控制 */
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 200px; /* 增加最小高度 */
  max-height: 220px; /* 适当增加最大高度 */
  border-radius: 20px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.mindmap-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

// 批量选择区 - Element Plus Checkbox组件的样式
.batch-checkbox {
  position: absolute;
  top: 0px;
  right: 15px;
  z-index: 2;
  transform: scale(1.5);
}

// 导图缩略图
.map-thumbnail {
  position: relative;
  height: 50%;
  border-radius: 20px;
  overflow: hidden; /* 确保超出部分被隐藏 */
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  // 确保内部Mind容器可以放大内容
  :deep(.Mind) {
    transform: scale(1.5);
    transform-origin: center;
    width: 100%;
    height: 100%;
  }
}

// 导图信息
.map-info {
  padding: 15px 0px;
  height: 30%;
}

.map-name {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 7px 0;
}

.map-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

// 空状态：
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.empty-text {
  margin-bottom: 24px;
}

//底部容器：
.page-footer {
  position: fixed;
  bottom: 3%;
  left: 0;
  right: 0;
  z-index: 10;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 左侧区域 - 批量操作标签
.footer-left {
  flex-shrink: 0;
}

.batch-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  margin-left: 57%;
}

.icon-margin {
  margin-right: 8px;
  font-size: 18px;
}

// 中间区域 - 分页
.footer-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}

// 右侧占位区域
.footer-right {
  width: 150px;
}

// 批量操作区 - Element Plus风格
.batch-action-bar {
  position: fixed;
  bottom: 0;
  right: 3.4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  gap: 30px;
  z-index: 10;
  border-top: 1px solid var(--el-border-color-light);
  border-radius: 4px 4px 0 0;
}

.export-btn {
  margin: 0px 10px;
}

.selected-count {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
