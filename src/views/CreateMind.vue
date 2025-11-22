<template>
  <div class="content">
    <div class="createmind">
      <div class="createmind-title">导图生成区</div>

      <div v-if="status === 'init'" class="init-area">
        <div class="upload-area">
          <el-upload
            action="#"
            :on-change="handleFileUpload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            accept=".txt,.docx,.pdf"
          >
            <template #trigger>
              <el-button
                size="large"
                type="primary"
                style="
                  width: 100%;
                  min-width: 723px;
                  margin: 10px 20px;
                  min-height: 60px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                class="responsive-upload-btn"
              >
                <span style="font-size: 1.5rem; letter-spacing: 1rem"
                  >上传文件</span
                >
              </el-button>
            </template>
          </el-upload>
          <p class="upload-desc" v-if="uploadedFileName">
            已上传: {{ uploadedFileName }}
          </p>
          <p class="upload-desc" v-else>
            支持 TXT、DOCX、PDF 格式文件 ( 最大32MB )
          </p>
        </div>

        <div class="features-container">
          <div class="features-grid">
            <el-card class="feature-card" :body-style="{ padding: '20px' }">
              <template #header>
                <div class="card-header">
                  <el-icon><document /></el-icon>
                  <span>多格式解析</span>
                </div>
              </template>
              <p class="card-desc">
                支持TXT、DOCX、PDF等多种格式文件解析，自动提取关键信息。
              </p>
            </el-card>

            <el-card class="feature-card" :body-style="{ padding: '20px' }">
              <template #header>
                <div class="card-header">
                  <el-icon><Share /></el-icon>
                  <span>智能导图生成</span>
                </div>
              </template>
              <p class="card-desc">
                利用人工智能技术，快速将文本内容转换为结构清晰的思维导图。
              </p>
            </el-card>

            <el-card class="feature-card" :body-style="{ padding: '20px' }">
              <template #header>
                <div class="card-header">
                  <el-icon><edit /></el-icon>
                  <span>可视化编辑</span>
                </div>
              </template>
              <p class="card-desc">
                生成的导图可进行在线编辑、调整和优化，满足个性化需求。
              </p>
            </el-card>

            <el-card class="feature-card" :body-style="{ padding: '20px' }">
              <template #header>
                <div class="card-header">
                  <el-icon><download /></el-icon>
                  <span>一键导出</span>
                </div>
              </template>
              <p class="card-desc">
                支持多种格式导出，方便分享和保存您的思维导图成果。
              </p>
            </el-card>
          </div>
        </div>
      </div>

      <div v-else-if="status === 'uploading'" class="processing-area">
        <p class="processing-text">文件上传中...</p>
        <el-icon class="hourglass-icon"><Loading /></el-icon>
        <el-progress
          :percentage="progress"
          :stroke-width="8"
          style="width: 80%"
        />
      </div>

      <div v-else-if="status === 'parsing'" class="processing-area">
        <p class="processing-text">文件解析中...</p>
        <el-icon class="analyzing-icon"><Loading /></el-icon>
        <el-progress
          :percentage="progress"
          :stroke-width="8"
          style="width: 80%"
        />
      </div>

      <div v-else-if="status === 'success'" class="result-area">
        <p class="result-title">解析完成</p>
        <el-icon class="result-icon success-icon"><Check /></el-icon>
        <p class="result-desc">您的导图已生成</p>
        <el-button type="primary" size="large" @click="viewMindmap"
          >查看导图</el-button
        >
      </div>

      <div v-else-if="status === 'error'" class="result-area">
        <p class="result-title">文件解析失败</p>
        <el-icon class="result-icon error-icon"><Close /></el-icon>
        <p class="result-desc">请确认文件清晰或格式支持</p>
        <el-button type="primary" size="large" @click="reUpload"
          >重新上传</el-button
        >
      </div>

      <div v-if="status === 'view'" class="mindmap-container">
        <!-- 这里放实际的导图内容 -->
        <div class="mindmap-placeholder">
          <p>导图展示区域</p>
          <!-- 可添加思维导图组件 -->
        </div>
      </div>
    </div>

    <div class="AiTalk">
      <AiTalk></AiTalk>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AiTalk from './AiTalk.vue'
import { useLayoutStore } from '@/stores/modules/layout'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  generateMultipleMindMaps,
  createMindMap,
  getBatchById
} from '@/api/user/index'
import type { CreateMindMapParams } from '@/utils/type'
import { useUserStore } from '@/stores'
import {
  Close,
  Check,
  Loading,
  Share,
  Document,
  Edit,
  Download
} from '@element-plus/icons-vue'

const uploadedFileName = ref('') // 存储上传的文件名
const LayoutStore = useLayoutStore()
const progress = ref(0) // 进度条进度
const status = ref<
  'init' | 'uploading' | 'parsing' | 'success' | 'error' | 'saving' | 'view'
>('init') // 文件状态
const router = useRouter()
const tempMindMapData = ref<any>(null) // 预留：存储未来真实接口的临时数据

// 文件上传：
const beforeUpload = (file: File) => {
  // 检查文件大小是否超过限制:
  const maxSize = 32 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(
      `文件大小不能超过 32MB ， 当前文件大小为 ${(file.size / (1024 * 1024)).toFixed(2)}`
    )
    return false
  }
  return true
}

const handleFileUpload = async (uploadFile: any) => {
  const file = uploadFile.raw

  // 检查在beforeUpload中已经完成

  uploadedFileName.value = file.name
  status.value = 'uploading'
  progress.value = 0

  let progressInterval: number | undefined

  try {
    await new Promise<void>(resolve => {
      progressInterval = window.setInterval(() => {
        progress.value += 10
        if (progress.value >= 100) {
          clearInterval(progressInterval)
          resolve()
        }
      }, 100)
    })

    status.value = 'parsing'
    progress.value = 0

    // 管理 “处理中” 的进度条：
    progressInterval = setInterval(() => {
      if (progress.value < 95) {
        progress.value += 5
      }
    }, 200)

    console.group('=== 调用`生成导图`接口 ===')
    console.log('文件名:', file.name)
    console.log('文件大小:', file.size)
    console.log('开始调用生成导图接口...')
    const text = 'default_text'
    const count = '3'
    const strategy = '1'
    const Resp = await generateMultipleMindMaps(file, text, count, strategy)
    const generateResp = Resp as any
    if (generateResp.Code === 200 && generateResp.Data.success) {
      const batchId = generateResp.Data.batch_id
      LayoutStore.data = { ...LayoutStore.data, batchId } // 存储 batchId 到全局状态
    }
    console.log('生成导图接口调用完成，收到响应：', generateResp)
    console.groupEnd()

    console.log(
      '"生成多个导图" 接口返回的完整响应:',
      JSON.stringify(generateResp, null, 2)
    )

    if (!generateResp || !generateResp.success || !generateResp.batch_id) {
      const errorMsg = generateResp?.Message || '生成导图草稿失败!'
      console.error('"生成多个导图" 接口业务逻辑失败:', errorMsg)
      throw new Error(errorMsg)
    }

    // 网络请求完成后，清楚进度条计时器，并将进度条直接拉满：
    clearInterval(progressInterval)
    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 1000))
    status.value = 'success'
    ElMessage.success('导图创建成功！')
  } catch (error) {
    clearInterval(progressInterval)
    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.error('文件处理失败:', error)
    console.error('错误堆栈:', (error as Error).stack)
    console.error('文件处理失败:', error)
    status.value = 'error'
  }
}

// 查看导图（跳转编辑页）
const viewMindmap = async () => {
  const { mapId, batchId } = LayoutStore.data || {}
  if (mapId && mapId !== 'xxx') {
    router.push({ name: 'generate-pro', query: { mapId } }) // 携带 mapId
  }
  if (!batchId) {
    ElMessage.warning('未找到导图批次ID，无法生成正式导图')
    return
  }
  try {
    // 步骤1：调用“根据id获取批次”接口，获取导图草稿数据
    ElMessage.info('正在获取导图数据...')
    console.group('=== 调用`根据id获取批次`接口 ===')
    const batchResp = await getBatchById(batchId)
    const batchData = batchResp as any
    console.log('批次数据响应：', batchData)
    console.groupEnd()

    // 验证草稿数据（确保有核心字段）
    const draftMapData = batchData?.Data?.mindmaps?.[0]
    if (!draftMapData || !draftMapData.root) {
      throw new Error('导图草稿数据获取失败或数据不完整')
    }

    // 步骤2：调用“创建导图”接口，生成正式 mapId
    console.group('=== 调用`创建导图`接口 ===')
    const createParams: CreateMindMapParams = {
      title: draftMapData.title || '未命名导图',
      desc: draftMapData.desc || '无描述',
      layout: draftMapData.layout || 'tree',
      root: draftMapData.root // 草稿数据中的核心节点结构
    }
    const cre = await createMindMap(createParams)
    const createResp = cre as any
    console.log('创建导图响应：', createResp)
    console.groupEnd()

    // 验证创建结果
    if (!createResp || createResp.Code !== 200 || !createResp.Data?.mapId) {
      throw new Error('正式导图创建失败')
    }
    const newMapId = createResp.Data.mapId

    // 步骤3：更新全局状态（存储正式 mapId 和完整导图数据）
    const userStore = useUserStore()
    const formalMapData = {
      ...draftMapData,
      batchId, // 保留批次ID（可选）
      mapId: newMapId, // 存储正式ID
      userId: userStore.userInfo?.user_id || ''
    }
    LayoutStore.data = formalMapData // 更新全局状态

    // 步骤4：跳转至编辑页（携带新生成的 mapId）
    ElMessage.success('导图生成成功，即将跳转编辑页')
    router.push({ name: 'generate-pro', query: { mapId: newMapId } })
  } catch (error) {
    const errorMsg = (error as Error).message || '查看导图失败'
    ElMessage.error(errorMsg)
    console.error('查看导图流程失败：', error)
  }
}

// 重新上传（重置所有状态）
const reUpload = () => {
  status.value = 'init'
  progress.value = 0
  uploadedFileName.value = ''
  tempMindMapData.value = null
}

onMounted(() => {
  LayoutStore.isCollapse = false
})
onUnmounted(() => {
  LayoutStore.isCollapse = true
})
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  height: 100%;
  display: flex;
  .createmind {
    flex: 1;
    height: 90%;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: white;
    margin-right: 2%;
    margin-left: 2%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;

    .createmind-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .init-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .upload-area {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      .upload-desc {
        font-size: 14px;
        color: #999;
        position: absolute;
        top: 26%;
        z-index: 2;
      }
    }

    // 上传中/解析中通用样式
    .processing-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      background-color: #edeef0;
      border-radius: 20px;
      margin-top: 10px;

      .processing-text {
        font-size: 18px;
        color: #666;
        font-weight: 500;
      }

      // Element Plus 图标样式 - 添加旋转动画效果
      .hourglass-icon,
      .analyzing-icon {
        font-size: 60px;
        color: #409eff;
        animation: rotate 1.5s linear infinite;
      }

      // 旋转动画定义
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }

    // 解析完成/失败通用样式
    .result-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      background-color: #edeef0;
      border-radius: 20px;
      margin-top: 10px;

      .result-title {
        font-size: 22px;
        color: #333;
        font-weight: 600;
      }

      // Element Plus 图标样式 - 添加源泉效果（圆形背景）
      .result-icon {
        font-size: 60px;
        width: 110px;
        height: 110px;
        line-height: 110px;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 2px solid #f0f0f0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .success-icon {
        color: #409eff; /* Element Plus 成功色 */
      }

      .error-icon {
        color: #409eff; /* Element Plus 错误色 */
      }

      .result-desc {
        font-size: 16px;
        color: #666;
      }

      /* 使用Element Plus按钮组件的内置样式 */
    }

    .features-container {
      flex: display;
      justify-content: center;
      align-items: center;
      padding: 15px;
      margin-left: 3%;
      margin-top: 20px;
      width: 80%;
      box-sizing: border-box;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      width: 100%;
    }

    .feature-card {
      transition: all 0.3s ease;
      border-radius: var(--el-border-radius-base);
      max-height: 140px;
      min-width: 350px;
      display: flex;
      flex-direction: column;
    }

    .feature-card:hover {
      transform: translateY(-7px);
      border-color: var(--el-color-primary-light-7);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      font-size: 16px;
    }

    .card-header .el-icon {
      font-size: 20px;
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-desc {
      color: var(--el-text-color-regular);
      line-height: 1.6;
      margin: -8px 0 0 0;
      flex: 1;
      font-size: 14px;
    }

    /* 响应式设计 */
    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .features-container {
        padding: 15px;
        margin-top: 15px;
      }

      .feature-card {
        min-height: 160px;
      }

      .card-header {
        font-size: 15px;
      }

      .card-desc {
        font-size: 13px;
      }
    }
  }
}
.AiTalk {
  width: 25%;
}
</style>
