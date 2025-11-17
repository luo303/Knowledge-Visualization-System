<template>
  <header class="header-constrols">
    <div class="search-container">
      <!-- 搜索框区域 -->
      <div class="search-box">
        <div class="search-input-group">
          <img
            src="@/assets/images/search.png"
            class="search-icon"
            alt="搜索"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索导图名称或来源文件..."
            @input="handleInput"
            @keydown.enter="handleSearch"
            ref="searchInput"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>

        <!-- 智能联想下拉框 -->
        <div
          class="suggestions-box"
          v-if="showSuggestions && suggestions.length > 0"
        >
          <ul>
            <li
              v-for="(item, index) in suggestions"
              :key="index"
              @click="selectSuggestion(item)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <!-- 无结果提示 -->
      <div class="no-result" v-if="shouldShowNoResult">
        未找到相关导图，请检查关键词或筛选条件
      </div>
    </div>

    <div class="filters-group">
      <div class="sort-container">
        <div class="sort-selector" @click="toggleDropdown1">
          <!-- 显示当前选中的排序方式 -->
          <span class="sort-text">{{ currentSortText }}</span>
          <i class="sort-arrow" :class="{ rotate: isDropdownOpen1 }">▼</i>

          <!-- 下拉选项列表（条件渲染） -->
          <div class="dropdown-options" v-if="isDropdownOpen1">
            <div
              class="option-item"
              v-for="option in sortOptions"
              :key="option.value"
              @click="handleSelect1(option)"
              :class="{ active: option.value === currentSort }"
            >
              {{ option.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="filter-container">
        <div class="filter-selector" @click="toggleDropdown2">
          <!-- 显示当前选中的类型 -->
          <span class="filter-text">导图类型：{{ currentTypeText }}</span>
          <!-- 下拉箭头（复用旋转动画） -->
          <i class="filter-arrow" :class="{ rotate: isDropdownOpen2 }">▼</i>

          <!-- 下拉选项列表 -->
          <div class="dropdown-options" v-if="isDropdownOpen2">
            <div
              class="option-item"
              v-for="option in typeOptions"
              :key="option.value"
              @click="handleSelect2(option)"
              :class="{ active: option.value === currentType }"
            >
              {{ option.text }}
            </div>
            <!-- 清除筛选按钮 -->
            <div class="clear-btn" @click="clearFilter">清除筛选</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- 导图预览模块 -->
  <main class="page-main" ref="mainContent">
    <div class="mindmap-preview-container">
      <!-- 导图卡片模块 -->
      <div
        class="mindmap-card"
        v-for="(map, index) in paginatedMindMaps"
        :key="map.mapId"
        @click="handleCardClick(map, $event)"
      >
        <!-- 勾选框 -->
        <div class="batch-checkbox">
          <input
            type="checkbox"
            v-model="map.selected"
            :id="`map-${map.mapId}`"
            @click.stop="handleSelect3(map)"
          />
          <label :for="`map-${index}`"></label>
        </div>

        <!-- 导图缩略图 -->
        <div class="map-thumbnail"><PreviewPage :Map="map" /></div>

        <!-- 导图信息 -->
        <div class="map-info">
          <h3 class="map-name">{{ map.title }}</h3>
          <div class="map-meta">
            <span class="map-type">{{ getTypeName(map.layout) }}</span>
            <span class="map-time">{{ formatTime(map.createTime) }}</span>
          </div>
        </div>
      </div>
      <!-- 空状态 (无导图时显示) -->
      <div class="empty-state" v-if="mindmaps.length === 0">
        <img
          src="@/assets/images/empty-state.png"
          alt="暂无导图"
          class="empty-img"
        />
        <p class="empty-text">暂无生成的导图，快去创建吧~</p>
        <button class="create-btn" @click="handleCreateNew">+ 创建导图</button>
      </div>
    </div>
  </main>

  <footer class="page-footer">
    <div class="batch-label">
      <img src="@/assets/images/folder.png" alt="folder" class="folder-icon" />
      <span class="batch-text">批量操作</span>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination-container" v-if="totalPages > 1">
        <button
          class="page-btn prev-btn"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          &lt;
        </button>
        <div
          class="page-number"
          v-for="page in pageNumbers"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </div>
        <button
          class="page-btn next-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage == totalPages"
        >
          &gt;
        </button>
      </div>
    </div>

    <!-- 占位元素，用于平衡分页控件 -->
    <div class="spacer"></div>

    <!-- 批量操作区 -->
    <div class="batch-action-bar" v-show="selectedCount > 0">
      <div class="selected-count">已选择{{ selectedCount }}个导图</div>
      <div class="batch-buttons">
        <button class="batch-btn export-btn" @click="handleBatchExport">
          批量导出
        </button>
        <button class="batch-btn delete-btn" @click="handleBatchDeleteConfirm">
          批量删除
        </button>
      </div>
    </div>

    <!-- 操作状态反馈浮层 -->
    <div class="status-toast" :class="statusType" v-show="showStatusToast">
      {{ statusMessage }}
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PreviewPage from '@/components/PreviewPage.vue'
import type { MindMapOptions } from '@/utils/type'
import { ElMessageBox, ElMessage } from 'element-plus'
import { exports } from '@/utils/export.ts'
import { getMindMapList } from '@/api/user/index'

// 搜索相关状态
const searchQuery = ref('')
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)
const showNoResult = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const mindmaps = ref<MindMapOptions[]>([])

// 处理输入事件 - 智能联想
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value.trim()
  showNoResult.value = false

  if (value) {
    // 模糊匹配逻辑 - 包含关键词即显示
    suggestions.value = mindmaps.value
      .map(map => map.title)
      .filter(title => title.toLowerCase().includes(value.toLowerCase()))
      .filter((title, index, self) => self.indexOf(title) === index)
    showSuggestions.value = true
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
}

// 搜素哦关键词的响应式变量：
const searchKeyword = ref('')

// 处理搜索
const handleSearch = () => {
  const query = searchQuery.value.trim()
  searchKeyword.value = query
  showSuggestions.value = false
  resetPagination() // 搜索逻辑变化时重置分页
}

// 选择联想建议
const selectSuggestion = (item: string) => {
  searchQuery.value = item
  showSuggestions.value = false
  searchKeyword.value = item // 同步到关键词
  handleSearch()
}

// 点击外部关闭联想框
onMounted(() => {
  document.addEventListener('click', e => {
    if (searchInput.value && !searchInput.value.contains(e.target as Node)) {
      showSuggestions.value = false
    }
  })
})

// "最近生成" 模块：
// 定义排序选项数据
const sortOptions = [
  { value: 'latest', text: '最近生成' },
  { value: 'earliest', text: '最早生成' }
]

// 响应式状态：当前选中的排序值（默认最近生成）
const currentSort = ref('latest')
// 响应式状态：下拉框是否展开
const isDropdownOpen1 = ref(false)
// 响应式状态：当前排序的显示文本（用于模板渲染）
const currentSortText = ref('最近生成')

// 切换下拉框展开/收起
const toggleDropdown1 = () => {
  isDropdownOpen1.value = !isDropdownOpen1.value
}

// 选择排序选项
const handleSelect1 = (option: { value: string; text: string }) => {
  currentSort.value = option.value // 更新当前排序值
  currentSortText.value = option.text // 更新显示文本
  isDropdownOpen1.value = false // 选中后关闭下拉框
  // 触发排序事件（父组件可监听此事件刷新列表）
  emit('sortChange', currentSort.value)
  resetPagination() // 原有逻辑变化时重置分页
}

// 监听点击外部区域，关闭下拉框
const handleClickOutside1 = (e: MouseEvent) => {
  const dropdown = document.querySelector('.sort-selector')
  if (dropdown && !dropdown.contains(e.target as Node)) {
    isDropdownOpen1.value = false
  }
}

// 挂载时监听全局点击事件
document.addEventListener('click', handleClickOutside1)
// 组件卸载时移除监听（避免内存泄漏）
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside1)
})

// 定义自定义事件，用于向父组件传递排序变化
const emit = defineEmits<{
  (e: 'sortChange', sortValue: string): void
  (e: 'typeChange', type: string): void
}>()

// "导图类型" 模块：
const typeOptions = [
  { value: 'all', text: '全部' },
  { value: 'logicalStructure', text: '逻辑结构图' },
  { value: 'mindMap', text: '思维导图' },
  { value: 'organizationStructure', text: '组织结构图' },
  { value: 'catalogOrganization', text: '目录组织图' },
  { value: 'timeline', text: '时间轴' },
  { value: 'fishbone', text: '鱼骨图' },
  { value: '时间轴2', text: 'timeline2' },
  { value: 'verticalTimeline', text: 'v0.6.6+竖向时间轴' }
]

// 响应体状态：
const currentType = ref('all') // 当前选中的类型，默认全部
const currentTypeText = ref('全部')
const isDropdownOpen2 = ref(false) // 类型下拉框展开状态

// 切换下拉框：
const toggleDropdown2 = () => {
  isDropdownOpen2.value = !isDropdownOpen2.value
}

// 选择类型：
const handleSelect2 = (option: { value: string; text: string }) => {
  currentType.value = option.value // 更新当前类型
  currentTypeText.value = option.text // 更新显示文本
  isDropdownOpen2.value = false // 选中后关闭下拉框
  emit('typeChange', currentType.value) // 通知父组件筛选变化
  resetPagination() // 原有逻辑变化时重置分页
}

// 清除筛选：
const clearFilter = () => {
  currentType.value = 'all'
  currentType.value = '全部'
  isDropdownOpen2.value = false
  emit('typeChange', 'all')
}

// 点击外部关闭下拉框：
const handleClickOutside2 = (e: MouseEvent) => {
  const dropdown = document.querySelector('.filter-selector') // 通过类名查找 "filter-selector" 元素
  if (dropdown && !dropdown.contains(e.target as Node)) {
    // 1. 下拉元素确实存在 2. 点击的位置不在下拉框内部
    isDropdownOpen2.value = false // 若满足条件，就关闭下拉框
  }
}

// 挂载时监听全局点击事件；
document.addEventListener('click', handleClickOutside2)
// 组件卸载时移除事件监听：
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside2)
})

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
    console.log('开始请求导图数据')
    const requestParams = {
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: searchKeyword.value.trim() || undefined,
      layout: currentType.value === 'all' ? undefined : currentType.value,
      sort: currentSort.value === 'latest' ? 'updatedAt,desc' : 'updatedAt,asc'
    }
    // 调用接口：
    const res = await getMindMapList(requestParams)
    const response = res as any

    if (response.Code === 200 && response.Data) {
      console.log('接口返回数据：', response.Data)
      const mapWithSelected = response.Data.list.map((map: MindMapOptions) => ({
        ...map,
        selected: false
      })) as MindMapOptions[]

      mindmaps.value = mapWithSelected
      totalCount.value = response.Data.total
    } else {
      ElMessage.error(`获取思维导图失败：${response.Message || '未知错误'}`)
    }
  } catch (error) {
    console.error('获取导图数据失败', error)
    ElMessage.error('网络错误，获取导图列表失败，请稍后再试...')
  }
}

// 方法：
const router = useRouter()

// 时间格式化：
const formatTime = (time: string): string => {
  const [date = ' ', hour] = time.split(' ')
  return `${hour}/${date.slice(5)}`
}

// 卡片点击事件：
const handleCardClick = (map: MindMapOptions, e: MouseEvent): void => {
  const target = e.target as HTMLElement
  if (!target.closest('.batch-checkbox') && !target.closest('.map-actions')) {
    router.push(`/edit/${map.mapId}`)
  }
}

// 勾选框处理事件：
const handleSelect3 = (map: MindMapOptions): void => {
  map.selected = !map.selected
}

// 新建导图：
const handleCreateNew = (): void => {
  router.push({ name: 'handedit' })
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

// 计算总页数：
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / pageSize.value)
})

// 计算当前可显示的数据：
const paginatedMindMaps = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredMindMaps.value.slice(startIndex, endIndex)
})

// 计算需要显示的页码 (最多显示 5 个)
const pageNumbers = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  // 总页数小于等于5，显示所有页码
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }
  // 总页数大于5 ，显示当前页得前后两页
  if (current <= 3) {
    return [1, 2, 3, 4, 5]
  } else if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total]
  } else {
    return [current - 2, current - 1, current, current + 1, current + 2]
  }
})

// 切换页码：
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
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

// 状态返回变量：
const showStatusToast = ref(false) // 弹窗
const statusMessage = ref('')
const statusType = ref('')

// 批量导出时的文件格式选择：
const exportFormat = [
  { label: 'PNG 图片', value: 'png' },
  { label: 'PDF 文档', value: 'pdf' },
  { label: 'XMind 文件', value: 'xmind' }
]

// 批量导出逻辑：
const handleBatchExport = async () => {
  const selectedMaps = mindmaps.value.filter(
    map => map.selected
  ) as Array<MindMapOptions>

  if (selectedMaps.length === 0) {
    statusMessage.value = '请先选择要导出的思维导图'
    statusType.value = 'error'
    showStatusToast.value = true
    hideToast()
    return
  }

  try {
    const { value: selectedFormat } = await ElMessageBox.confirm(
      `
      <div style="margin-bottom: 16px;">请选择导出的格式</div>
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap;">
      ${exportFormat
        .map(
          format => `
        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
        <input type="radio" name="format" value="${format.value}"/>
        ${format.label}</label>`
        )
        .join('')}</div>`,
      '批量导出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        // 点击确认按钮时获取选中格式：
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const radio = document.querySelector(
              'input[name="format"]:checked'
            ) as HTMLInputElement
            if (radio) {
              exports(selectedMaps, radio.value)
              done()
            } else {
              ElMessage.warning('请选择导出格式！')
            }
          } else {
            done()
          }
        }
      }
    )

    // 执行导出：
    statusMessage.value = '正在导出 ...'
    statusType.value = 'loading'
    showStatusToast.value = true

    await exports(selectedMaps, selectedFormat)

    statusMessage.value = `${selectedMaps.length}个导图导出成功！`
    statusType.value = 'success'
  } catch (error) {
    if ((error as Error).message !== 'cancel') {
      console.error('批量导出失败：', error)
      statusMessage.value = `导出失败： ${(error as Error).message}`
      statusType.value = 'error'
    }
  } finally {
    hideToast()
  }
}
// 批量删除确认逻辑：
const handleBatchDeleteConfirm = () => {
  ElMessageBox.confirm('是否删除所选导图？删除后不可恢复。', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

    .then(() => {
      handleBatchDelete()
    })
    .catch(() => {})
}

// 批量删除逻辑：
const handleBatchDelete = () => {
  statusMessage.value = '正在删除...'
  statusType.value = 'loading'
  showStatusToast.value = true

  // 模拟删除请求：
  setTimeout(() => {
    mindmaps.value = mindmaps.value.filter(map => !map.selected)
    statusMessage.value = `已删除${selectedCount.value}个导图`
    statusType.value = 'success'
    hideToast()
  }, 1500)
}

// 隐藏状态显示：
const hideToast = () => {
  setTimeout(() => {
    showStatusToast.value = false
  }, 3000)
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
  margin-left: 20px;
  padding: 0px;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  position: relative;
}

.search-input-group {
  display: flex;
  align-items: center;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 12px;
  padding-right: 70px; // 输入框右边留出空间，用于放置搜索按钮
  background: #fff;
  position: relative;

  &:focus-within {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    outline: none;
  }
}

.search-icon {
  margin-right: 8px;
  height: 20px;
  width: 20px;
}

input {
  flex: 1;
  height: 35px;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0 8px;
}

.search-btn {
  background: #409eff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 6px 16px;
  display: flex;
  position: absolute;
  right: 0px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #66b1ff;
  }

  &:active {
    background: #3a8ee6;
  }
}

.suggestions-box {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;

  ul {
    list-style: none;
    padding: 8px 0;
    margin: 0;

    li {
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f5f7fa;
      }
    }
  }
}

.no-result {
  color: #f56c6c;
  font-size: 14px;
  padding: 8px 16px;
}

.filters-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

// "生成时间" 容器
.sort-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.sort-selector {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 30px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  min-width: 100px;
  min-height: 35px;

  &:hover {
    border-color: #409eff; /* hover时高亮边框 */
  }
}

.sort-text {
  font-size: 14px;
  color: #333;
}

.sort-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.2s; /* 箭头旋转动画 */
}

/* 箭头旋转效果（下拉展开时） */
.rotate {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%; /* 位于选择器正下方 */
  left: 0;
  right: 0;
  margin-top: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 确保在其他内容上方 */
}

.option-item {
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background: #f5f7fa; /*  hover时背景高亮 */
  }

  &.active {
    color: #409eff; /* 选中项文字高亮 */
    font-weight: 500;
  }
}

/* 响应式适配：小屏幕时调整位置 */
@media (max-width: 768px) {
  .sort-container {
    right: 5%; /* 小屏幕时向右微调，避免超出边缘 */
  }
  .filter-container {
    right: 5%;
  }
  .pagination-container {
    gap: 4px;
  }
  .page-btn,
  .page-number {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .mindmap-preview-container {
    width: 100%;
    height: 70%;
    left: 1%;
  }
  .mindmap-card {
    height: 70%;
  }
}

@media (max-width: 900px) {
  .page-main {
    max-height: calc(100vh - 180px); /* 小屏幕适当减小头部底部总高度 */
  }
}

@media (max-width: 600px) {
  .page-main {
    max-height: calc(100vh - 160px); /* 手机屏幕进一步减小 */
  }
}

// "导图类型" 容器：
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 35px;
}

.filter-selector {
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  min-width: 160px;
  min-height: 35px;

  &:hover {
    border-color: #409eff;
  }

  .filter-text {
    font-size: 14px;
    color: #333;
  }

  .filter-arrow {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s;
  }

  .rotate {
    transform: rotate(180deg);
  }
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
  grid-template-columns: repeat(4, 1fr);
  gap: 2%;
  margin: 0 auto;
  max-width: 1400px;
}

// 导图卡片：
.mindmap-card {
  width: 85%;
  margin: 0 auto;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100px;
  max-height: 320px;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

// 批量选择区：
.batch-checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 18px;
  height: 18px;
  border: solid 1px #409eff;
  border-radius: 2px;
  transition: opacity 0.2s;
}

.mindmap-card:hover .batch-checkbox,
.batch-checkbox input:checked ~ label {
  opacity: 1;
}

.batch-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.batch-checkbox input:checked ~ label::after {
  content: '✓';
  background-color: #409eff;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  display: block;
}

.map-thumbnail {
  height: 85%;
  position: relative;
  background-color: #f9f9f9;
  overflow: hidden;
  pointer-events: none;
}

.map-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

// 导图信息：
.map-info {
  padding: 10px;
  background-color: #f4f7fa;
  height: 25%;
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

.create-btn {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background-color: #66b1ff;
  }
}

//底部容器：
.page-footer {
  position: fixed;
  bottom: 3%;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 0px 15% 0px 4%;
}
// 分页容器：
// 分页外层容器：
.pagination-wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 2px;
  margin: 0 auto;
  max-width: 1400px;
  border-top: 1px solid #f0f0f0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

// 分页按钮：
.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #ddd;
    color: #999;
    &:hover {
      border-color: #ddd;
      color: #999;
    }
  }
}

// 页码数字：
.page-number {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  &:active {
    background-color: #409eff;
    color: white;
    font-weight: 500;
  }
}

// 批量操作区：
.batch-label {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  margin-left: 10%;

  .folder-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
}

.batch-action-bar {
  position: fixed;
  bottom: 0;
  right: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  gap: 30px;
  z-index: 10;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

.batch-btn {
  padding: 6px 16px;
  margin: 10px;
  border-radius: 4px;
  border: none;
  color: #fff;
  background-color: #409eff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #3a8ee6;
  }
}

// 状态反馈层：
.status-toast {
  position: fixed;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  z-index: 10;
  background-color: #409eff;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
