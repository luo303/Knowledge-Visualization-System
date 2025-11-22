<template>
  <div class="createmind-container">
    <!-- 1. 显示 loading 状态 -->
    <div v-if="loading" class="loading">正在加载导图...</div>

    <!-- 2. 显示错误信息 -->
    <div v-else-if="errorMsg" class="error">{{ errorMsg }}</div>

    <!-- 3. 有数据但为空数组 -->
    <div v-else-if="maps.length === 0" class="empty">未查询到任何导图数据</div>
    <div v-else>
      <div class="createmind-title">请点击底部按钮选择想要生成的导图</div>
      <div class="generatemap-container">
        <el-card
          v-for="map in maps"
          :key="map.mapId"
          class="mindmap-card"
          shadow="hover"
          :body-style="{ padding: '10px', height: '100%' }"
        >
          <!-- 卡片头部 -->
          <template #header>
            <div class="card-header">
              <span class="map-name">{{ map.root.data.text }}</span>
              <span class="map-time">{{ map.createTime }}</span>
            </div>
          </template>

          <!-- 卡片主体 -->
          <div class="map-picture">
            <ProPreview :Map="map" class="preview-img" />
          </div>

          <!-- 卡片底部 -->
          <template #footer>
            <el-button
              type="primary"
              @click="handleCardClick(map)"
              style="width: 100%"
            >
              <span>查看导图</span>
            </el-button>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ProPreview from '@/components/ProPreview.vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { MindMapOptions, MindMapNode } from '@/utils/type'
import { useRouter, useRoute } from 'vue-router'
import { getBatchById, markMindMapValue, getMap } from '@/api/user/index'
import JSON5 from 'json5'
import { useLayoutStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const maps = ref<MindMapOptions[]>([])
const loading = ref<boolean>(true)
const errorMsg = ref<string>('')
const batchId = ref<string>('')

// 创建默认的MindMapOptions，用于调试和兜底
const createDefaultMindMap = (index: number): MindMapOptions => {
  const defaultMap: MindMapOptions = {
    mapId: `default-map-${index}`,
    userId: '',
    title: `默认导图 ${index + 1}`,
    desc: '这是一个默认导图',
    layout: 'mindMap',
    resultId: '',
    root: {
      data: {
        text: '根节点示例'
      },
      children: [
        {
          data: { text: '子节点1' },
          children: [
            { data: { text: '孙节点1-1' } },
            { data: { text: '孙节点1-2' } }
          ]
        },
        {
          data: { text: '子节点2' },
          children: [{ data: { text: '孙节点2-1' } }]
        }
      ]
    },
    createTime: new Date().toLocaleString()
  }
  return defaultMap
}

// 验证和修复MindMapNode结构
const validateAndFixNode = (node: any): MindMapNode => {
  // 确保节点有data对象
  if (!node || typeof node !== 'object' || !node.data) {
    return {
      data: { text: '未知节点' },
      children: []
    }
  }

  // 确保data有text属性
  if (!node.data.text) {
    node.data.text = '未命名'
  }

  // 确保children是数组
  if (!Array.isArray(node.children)) {
    node.children = []
  }

  // 递归验证子节点
  if (node.children && node.children.length > 0) {
    node.children = node.children.map((child: any) => validateAndFixNode(child))
  }

  return node as MindMapNode
}

onMounted(async () => {
  try {
    const queryBatchId = route.query.batchId as string

    // 开发调试模式：如果没有batchId，使用默认数据
    if (!queryBatchId) {
      console.warn('未获取到batchId, 使用默认示例数据进行调试')
      // 创建2个默认导图用于调试
      maps.value = [createDefaultMindMap(0), createDefaultMindMap(1)]
      console.log('使用默认示例数据:', maps.value)
    } else {
      batchId.value = queryBatchId
      console.log('generate-pro 页面获取到的 batchId:', batchId.value)

      // 调用获取id批次的接口
      loading.value = true
      const batchResponse = await getBatchById(batchId.value)
      console.log('getBatchById 接口完整响应:', batchResponse)

      const batchData = batchResponse as any
      // 防御性检查
      if (
        !batchData ||
        !batchData.Data ||
        !batchData.Data.results ||
        !Array.isArray(batchData.Data.results) ||
        batchData.Data.results.length === 0
      ) {
        console.warn('接口返回数据不完整或为空，使用默认数据')
        maps.value = [createDefaultMindMap(0)]
      } else {
        console.log(
          '接口返回的 results 数组长度:',
          batchData.Data.results.length
        )

        // 解析每个结果的 map_json,转换成MindMapOption形式
        const realMaps = batchData.Data.results.map(
          (item: any, index: number) => {
            try {
              // 防御性解析map_json
              let mapJson
              try {
                mapJson = item.map_json ? JSON5.parse(item.map_json) : {}
              } catch (parseError) {
                console.error('解析map_json失败, 使用默认值:', parseError)
                mapJson = {}
              }

              // 详细日志记录，特别是result_id相关信息
              console.log(
                `第 ${index} 个导图的原始数据 - result_id: ${item.result_id}, resultId: ${item.resultId}, 其他字段:`,
                Object.keys(item)
              )

              // 获取resultId，尝试多种可能的字段名
              const resultId = item.result_id || item.resultId || ''
              if (!resultId) {
                console.warn(`第 ${index} 个导图缺少resultId字段！`)
              }

              // 验证并修复root节点结构
              const validatedRoot = validateAndFixNode(mapJson.root || {})

              return {
                mapId: item.map_id || `map-${batchId.value}-${index}`,
                resultId: resultId,
                root: validatedRoot,
                title: mapJson.title || '未命名导图',
                userId: item.user_id || '',
                desc: mapJson.desc || '无描述',
                layout: mapJson.layout || 'mindMap',
                createTime: item.create_time || new Date().toLocaleString()
              } as MindMapOptions
            } catch (itemError) {
              console.error(`处理第${index}个导图数据失败:`, itemError)
              return createDefaultMindMap(index)
            }
          }
        )

        console.log('解析后的 realMaps 数组长度:', realMaps.length)
        maps.value = realMaps
        console.log('maps 数组已更新:', maps.value)
      }
    }
  } catch (error) {
    errorMsg.value = (error as Error).message || '获取导图数据失败，请重试'
    console.error('获取导图数据失败:', error)
    // 出错时使用默认数据，确保页面不空白
    maps.value = [createDefaultMindMap(0)]
  } finally {
    loading.value = false
  }
})

// 卡片点击事件
const handleCardClick = async (map: MindMapOptions) => {
  console.log('===== handleCardClick 函数开始执行 =====')

  // 输入参数验证
  if (!map) {
    console.error('错误：传入的map参数为空')
    ElMessage.error('导图数据无效')
    return
  }

  const { resultId, mapId } = map
  console.log('点击卡片，map信息：', {
    resultId,
    mapId,
    hasResultId: !!resultId,
    hasMapId: !!mapId && mapId !== 'xxx',
    hasTitle: !!map.title,
    hasRoot: !!map.root
  })

  // 检查 mapId 是否有效（用于跳转）
  if (!mapId || mapId === 'xxx') {
    ElMessage.warning('导图 ID 无效，无法跳转！')
    return
  }

  // 立即将点击的map数据赋值给LayoutStore.data
  try {
    const LayoutStore = useLayoutStore()
    // 创建完整的数据副本并确保必要字段存在
    const mapData = {
      ...map,
      // 确保必要的字段存在
      mapId: map.mapId || '',
      userId: map.userId || '',
      title: map.title || '未命名导图',
      desc: map.desc || '',
      layout: map.layout || 'right',
      root: map.root || { data: { text: '' }, children: [] }
    }

    LayoutStore.data = mapData
    console.log('===== 已将点击的map数据直接保存到LayoutStore =====')
    console.log('保存的数据摘要:', {
      mapId: mapData.mapId,
      title: mapData.title,
      hasRootNode: !!mapData.root
    })

    // 验证赋值是否成功
    const assignedData = LayoutStore.data
    if (assignedData && assignedData.mapId === mapData.mapId) {
      console.log('数据赋值验证成功')
    } else {
      console.warn('数据赋值验证警告：LayoutStore中的mapId与原始mapId不匹配')
    }
  } catch (error) {
    console.error('===== LayoutStore数据赋值失败 =====')
    console.error('错误对象:', error)
    if (error instanceof Error) {
      console.error('错误消息:', error.message)
    }
  }

  // 如果有resultId，则尝试标记
  if (resultId) {
    try {
      // 调用标记接口，传入 resultId 和 label (1表示正面评价)
      console.log('准备调用markMindMapValue接口，参数:', { resultId, label: 1 })
      await markMindMapValue(resultId, 1)
      ElMessage.success('标记成功！')

      // 标记成功后，查询导图信息（作为补充数据获取）
      try {
        console.log('===== 标记成功后获取最新导图数据 =====')
        console.log('准备调用getMap接口,参数:', { mapId })
        const mapResponse = await getMap(mapId)
        console.log('导图查询成功，返回数据:', mapResponse)

        // 将获取到的导图数据保存到LayoutStore中（作为更新）
        const responseData = mapResponse as any
        if (responseData && responseData.Data) {
          const LayoutStore = useLayoutStore()
          // 合并已保存的本地数据和从接口获取的数据
          const mergedData = { ...LayoutStore.data, ...responseData.Data }
          LayoutStore.data = mergedData
          console.log('已将接口获取的最新导图数据合并到LayoutStore')
        }
      } catch (error) {
        console.error('===== 导图查询失败 =====')
        console.error('错误对象:', error)
        if (error instanceof Error) {
          console.error('错误消息:', error.message)
        }
        ElMessage.warning('导图查询失败，但仍可进入编辑页面')
        console.log('继续使用之前保存的本地数据进行跳转')
      }

      // 标记成功后，跳转到编辑页
      router.push({ name: 'handedit', query: { mapId: mapId } })
    } catch (error) {
      console.error('标记失败：', error)
      // 标记失败时提供选项，让用户可以选择是否继续编辑
      ElMessage.error('标记失败，直接进入编辑页面')

      // 查询导图信息并保存到LayoutStore（作为补充数据获取）
      try {
        console.log('===== 标记失败后获取导图数据 =====')
        console.log('准备调用getMap接口,参数:', { mapId })
        const mapResponse = await getMap(mapId)
        console.log('导图查询成功，返回数据:', mapResponse)

        // 将获取到的导图数据保存到LayoutStore中（作为更新）
        const responseData = mapResponse as any
        if (responseData && responseData.Data) {
          const LayoutStore = useLayoutStore()
          // 合并已保存的本地数据和从接口获取的数据
          const mergedData = { ...LayoutStore.data, ...responseData.Data }
          LayoutStore.data = mergedData
          console.log('已将接口获取的导图数据合并到LayoutStore')
        }
      } catch (error) {
        console.error('===== 导图查询失败 =====')
        console.error('错误对象:', error)
        if (error instanceof Error) {
          console.error('错误消息:', error.message)
        }
        console.log('继续使用之前保存的本地数据进行跳转')
      }

      router.push({ name: 'handedit', query: { mapId: mapId } })
    }
  } else {
    // 没有resultId时，提供提示但仍然允许进入编辑页面
    console.log('没有resultId，跳过标记步骤')
    ElMessage.warning('缺少 result ID, 跳过标记步骤')

    // 查询导图信息并保存到LayoutStore（作为补充数据获取）
    try {
      console.log('准备调用getMap接口,参数:', { mapId })
      const mapResponse = await getMap(mapId)
      console.log('导图查询成功，返回数据:', mapResponse)

      // 将获取到的导图数据保存到LayoutStore中（作为更新）
      const responseData = mapResponse as any
      if (responseData && responseData.Data) {
        const LayoutStore = useLayoutStore()
        // 合并原始数据和从接口获取的数据
        const mergedData = { ...LayoutStore.data, ...responseData.Data }
        LayoutStore.data = mergedData
        console.log('已将接口获取的导图数据合并到LayoutStore')
      }
    } catch (error) {
      console.error('===== 导图查询失败 =====')
      console.error('错误对象:', error)
      if (error instanceof Error) {
        console.error('错误消息:', error.message)
      }
      console.log('继续使用之前保存的本地数据进行跳转')
    }

    console.log('即将跳转到编辑页面:', { mapId })
    router.push({ name: 'handedit', query: { mapId: mapId } })
  }

  console.log('===== handleCardClick 函数执行结束 =====')
}
</script>
<style lang="scss" scoped>
.createmind-container {
  margin-left: 10px;
  width: 95%;
  height: 90%;
  display: flex;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  flex-direction: column;

  .createmind-title {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .generatemap-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    height: 90%;
    overflow-y: auto;
    justify-content: flex-start;
  }

  .mindmap-card {
    width: calc(33.333% - 20px);
    border-radius: 20px;
    min-width: 300px;
    height: 430px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;

      .map-name {
        font-weight: bold;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .map-time {
        color: #909399;
        font-size: 12px;
        margin-left: 10px;
      }
    }

    .map-picture {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      background-color: #f8f8f9;
      border-radius: 8px;
      margin: 10px 0;
      height: 250px;

      .preview-img {
        width: 100%;
        transform: scale(1.2);
      }
    }
  }

  .loading,
  .error,
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #909399;
  }

  .error {
    color: #f56c6c;
  }
}

// 响应式布局
@media (max-width: 1200px) {
  .createmind-container {
    .mindmap-card {
      width: calc(50% - 20px);
    }
  }
}

@media (max-width: 768px) {
  .createmind-container {
    .mindmap-card {
      width: 100%;
    }
  }
}
</style>
