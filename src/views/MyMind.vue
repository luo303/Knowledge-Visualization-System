<template>
  <div class="search-container">
    <!-- 搜索框区域 -->
    <div class="search-box">
      <div class="search-input-group">
        <img src="@/assets/images/search.png" class="search-icon" alt="搜索" />
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

      <!-- 无结果提示 -->
      <div class="no-result" v-if="showNoResult">
        未找到相关导图，请检查关键词或筛选条件
      </div>
    </div>
  </div>

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
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 搜索相关状态
const searchQuery = ref('')
const suggestions = ref<string[]>([])
const showSuggestions = ref(false)
const showNoResult = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

// 模拟所有导图数据（实际项目中从接口获取）
const allMindMaps = ref([
  '产品需求分析导图',
  '年度工作计划',
  '论文研究框架',
  '市场调研结果',
  '用户画像分析',
  '项目进度管理',
  '会议纪要汇总',
  '财务预算规划'
])

// 处理输入事件 - 智能联想
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value.trim()
  showNoResult.value = false

  if (value) {
    // 模糊匹配逻辑 - 包含关键词即显示
    suggestions.value = allMindMaps.value.filter(item =>
      item.toLowerCase().includes(value.toLowerCase())
    )
    showSuggestions.value = true
  } else {
    suggestions.value = []
    showSuggestions.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) return

  // 执行搜索逻辑
  const results = allMindMaps.value.filter(item =>
    // 支持多关键词搜索（空格分隔）
    query
      .split(' ')
      .every(keyword => item.toLowerCase().includes(keyword.toLowerCase()))
  )

  showSuggestions.value = false
  showNoResult.value = results.length === 0

  console.log('搜索结果:', results)
}

// 选择联想建议
const selectSuggestion = (item: string) => {
  searchQuery.value = item
  showSuggestions.value = false
  // 选中后自动搜索
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
  { value: 'tree', text: '树形图' },
  { value: 'radial', text: '放射图' },
  { value: 'logic', text: '逻辑图' }
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
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  left: 8%;
  margin-left: 20px;
  position: absolute;
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
  background: #fff;

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
  border-radius: 4px;
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
  margin-top: 8px;
  padding: 8px 16px;
}

// "生成时间" 容器
.sort-container {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  right: 20%;
  margin-right: 20px;
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
}

// "导图类型" 容器：
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 5%;
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
</style>
