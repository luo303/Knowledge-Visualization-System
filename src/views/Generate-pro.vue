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
        <div
          class="singlemindmap-container"
          v-for="map in maps"
          :key="map.mapId"
        >
          <div class="map-info">
            <h3 class="map-name">{{ map.root.data.text }}</h3>
            <div class="map-meta">
              <span class="map-time">{{ map.createTime }}</span>
            </div>
          </div>
          <div class="map-picture">
            <PreviewPage :Map="map" class="preview-img" />
          </div>
          <el-button
            type="primary"
            @click="handleCardClick(map)"
            style="
              width: 95%;
              height: 10%;
              margin: 10px 0px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <span>查看导图</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PreviewPage from '@/components/PreviewPage.vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { MindMapOptions } from '@/utils/type'
import { useRouter, useRoute } from 'vue-router'
import { getBatchById } from '@/api/user/index'
import JSON5 from 'json5'

const router = useRouter()
const route = useRoute()
const maps = ref<MindMapOptions[]>([])
const loading = ref<boolean>(true)
const errorMsg = ref<string>('')
const batchId = ref<string>('')

onMounted(async () => {
  try {
    const queryBatchId = route.query.batchId as string
    if (!queryBatchId) {
      throw new Error('未获取到导图批次 ID ,请重新上传文件！')
    }
    batchId.value = queryBatchId
    console.log('generate-pro 页面获取到的 batchId:', batchId.value)
    // 调用获取id批次的接口
    loading.value = true
    const batchResponse = await getBatchById(batchId.value)
    console.log('getBatchById 接口完整响应:', batchResponse) // 关键：确认接口返回结构
    const batchData = batchResponse as any
    if (!batchData || !batchData.results || batchData.results.length === 0) {
      throw new Error('接口返回数据格式错误,results 数组缺失或为空')
    }
    console.log('接口返回的 results 数组:', batchData.results)
    // 解析每个结果的 map_json,转换成MindMapOption形式
    const realMaps = batchData.results.map((item: any, index: number) => {
      const mapJson = JSON5.parse(item.map_json)

      return {
        mapId: item.map_id || `map-${batchId.value}-${index}`, // 优先用接口返回的 mapId，无则生成临时ID
        root: mapJson.root || { data: { text: '未命名导图' }, children: [] }, // 导图节点结构
        title: mapJson.title || '未命名导图',
        userId: item.user_id || '',
        desc: mapJson.desc || '无描述',
        layout: mapJson.layout || 'mindMap',
        createTime: item.create_time || new Date().toLocaleString() // 接口返回的创建时间
      } as MindMapOptions
    })

    console.log('解析后的 realMaps 数组:', realMaps)
    if (realMaps.length === 0) {
      throw new Error('解析后未生成任何导图数据')
    }
    maps.value = realMaps
    console.log('maps 数组已更新:', maps.value)

    // 更新 maps 数据
    maps.value = realMaps
  } catch (error) {
    errorMsg.value = (error as Error).message || '获取导图数据失败，请重试'
    console.error('获取导图数据失败:', error)
  } finally {
    loading.value = false
  }
})

// 卡片点击事件
const handleCardClick = (map: any) => {
  const currentMapId = map.mapId
  if (currentMapId && currentMapId !== 'xxx') {
    router.push({ name: 'handedit', query: { mapId: currentMapId } })
  } else {
    ElMessage.warning('导图 ID 无效，无法跳转！')
  }
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
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    gap: 10px;
    width: 100%;
    height: 90%;

    .singlemindmap-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 20px;
      border: 1px solid #ebebeb;
      cursor: pointer;
      box-shadow: 7px 14px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;

      &:hover {
        transform: translateY(-7px);
        box-shadow: 10px 17px 12px rgba(0, 0, 0, 0.15);
      }

      .map-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;

        .map-name {
          font-size: 16px;
          font-weight: bold;
          display: flex;
          white-space: nowrap;
        }

        .map-meta {
          display: flex;
          justify-content: space-between;
          color: #585757;
          white-space: nowrap;
        }
      }

      .map-picture {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90%;
        width: 95%;
        border-radius: 20px;
        background-color: #f8f8f9;
        flex-direction: column;
        position: relative;
        margin: 0 auto;

        .preview-img {
          width: 100%;
        }
      }
    }
  }
}
</style>
