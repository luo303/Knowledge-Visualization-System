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
                  max-width: 723px;
                  min-width: 770px;
                  margin: 10px auto;
                  min-height: 60px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  box-sizing: border-box;
                "
                class="responsive-upload-btn"
              >
                <span style="font-size: 1.5rem; letter-spacing: 0.5rem"
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
import JSON5 from 'json5'

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
  if (!uploadFile || !uploadFile.raw) {
    ElMessage.error('上传文件无效，请重新选择')
    return
  }

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
    const text = 'default_text'
    const count = '3'
    const strategy = '1'
    const Resp = await generateMultipleMindMaps(file, text, count, strategy)
    const generateResp = Resp as any

    // 增强的错误处理和数据提取逻辑
    let batchId = null

    // 检查多种可能的响应结构
    if (generateResp && generateResp.Data) {
      // 检查标准结构
      if (generateResp.Data.success && generateResp.Data.batch_id) {
        batchId = generateResp.Data.batch_id
      }
      // 检查可能的替代结构
      else if (generateResp.Data.batch_id) {
        batchId = generateResp.Data.batch_id
      }
      // 检查其他可能的字段名
      else if (generateResp.Data.batchId) {
        batchId = generateResp.Data.batchId
      }
    }

    // 如果仍然没有获取到batchId，抛出错误
    if (!batchId) {
      const errorMsg =
        generateResp?.Message || '未能获取到batch_id，请检查接口响应!'
      throw new Error(errorMsg)
    }

    // 创建包含batchId的完整对象，确保正确的类型结构
    const updatedData = {
      ...LayoutStore.data,
      batchId: batchId
    }

    LayoutStore.data = updatedData

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

    let errorMsg = ''

    // 处理特定错误类型
    if (error instanceof Error) {
      const errorStr = error.message || ''

      // 处理401未授权错误
      if (errorStr.includes('401') || errorStr.includes('未授权')) {
        errorMsg = '认证已过期，请重新登录'
        // 清除用户信息并跳转到登录页
        setTimeout(() => {
          const userStore = useUserStore()
          userStore.clearUserInfo()
          router.push('/login')
        }, 2000)
      }
      // 处理UniPDF许可证错误
      else if (errorStr.includes('unipdf license code required')) {
        errorMsg = 'PDF处理需要特殊许可证，请使用TXT或DOCX格式文件'
      }
      // 其他错误
      else {
        errorMsg = errorStr
      }
    } else {
      errorMsg = '未知错误'
    }

    // 显示用户友好的错误消息
    ElMessage.error('文件处理失败: ' + errorMsg)
    status.value = 'error'
  }
}

// 查看导图（跳转编辑页）
const viewMindmap = async () => {
  // 直接从LayoutStore.data获取batchId，避免解构可能导致的问题
  const batchId = LayoutStore.data?.batchId
  const mapId = LayoutStore.data?.mapId

  if (!batchId) {
    ElMessage.warning('未找到导图批次ID, 无法生成正式导图')
    return
  }

  if (mapId && mapId !== 'xxx') {
    router.push({ name: 'generate-pro', query: { batchId, mapId } }) // 携带 mapId
    return // 添加return防止继续执行后续代码
  }
  try {
    // 步骤1：调用"根据id获取批次"接口，获取导图草稿数据
    ElMessage.info('正在获取导图数据...')
    const batchResp = await getBatchById(batchId)
    const batchData = batchResp as any
    // 验证草稿数据（确保有核心字段）
    const firstResult = batchData?.Data?.results?.[0]
    if (!firstResult || !firstResult.map_json) {
      throw new Error('导图草稿数据获取失败或数据不完整')
    }

    const draftMapData = JSON5.parse(firstResult.map_json)
    if (!draftMapData.root) {
      throw new Error('导图节点结构缺失')
    }

    // 步骤2：调用"创建导图"接口，生成正式 mapId
    const createParams: CreateMindMapParams = {
      title: draftMapData.title || '未命名导图',
      desc: draftMapData.desc || '无描述',
      layout: draftMapData.layout || 'tree',
      root: draftMapData.root // 草稿数据中的核心节点结构
    }
    const cre = await createMindMap(createParams)
    const createResp = cre as any

    // 验证创建结果
    if (!createResp || createResp.Code !== 200 || !createResp.Data.mapId) {
      throw new Error('正式导图创建失败')
    }
    const newMapId = createResp.Data.mapId

    // 步骤3：更新全局状态（存储正式 mapId 和完整导图数据）
    const userStore = useUserStore()
    // 确保batchId被正确保留，不是可选的
    const formalMapData = {
      ...draftMapData,
      batchId: batchId, // 必须保留批次ID
      mapId: newMapId, // 存储正式ID
      userId: userStore.userInfo?.user_id || ''
    }

    LayoutStore.data = formalMapData // 更新全局状态

    // 步骤4：跳转至编辑页（携带新生成的 mapId）
    ElMessage.success('导图生成成功，即将跳转编辑页')
    router.push({
      name: 'generate-pro',
      query: { mapId: newMapId, batchId: batchId || '' }
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    ElMessage.error('查看导图失败: ' + errorMsg)
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
  gap: 10px;
  .createmind {
    flex: 1;
    max-height: 90%;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: white;
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
      gap: 2px;
      width: 100%;
      .upload-desc {
        font-size: 14px;
        color: #999;
        position: relative;
        margin-top: -7px;
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
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 15px;
      margin: 2px auto 0;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      width: 100%;
      max-width: 100%;
      height: 100%;
      justify-items: center;
      box-sizing: border-box;
    }

    .feature-card {
      transition: all 0.3s ease;
      border-radius: var(--el-border-radius-base);
      max-height: 160px;
      min-width: 280px;
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      overflow: hidden;
      box-sizing: border-box;
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
        gap: 20px;
        max-width: 100%;
      }

      .feature-card {
        max-width: 100%;
        min-width: 260px;
      }
    }

    @media (max-width: 768px) {
      .features-container {
        padding: 10px;
        margin-top: 15px;
      }

      .features-grid {
        gap: 15px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        max-width: 100%;
      }

      .feature-card {
        min-height: 140px;
        max-width: 100%;
        min-width: 240px;
        max-height: 160px;
      }

      .card-header {
        font-size: 14px;
        gap: 6px;
      }

      .card-header .el-icon {
        font-size: 18px;
        width: 28px;
        height: 28px;
      }

      .card-desc {
        font-size: 12px;
        margin: -5px 0 0 0;
      }
    }

    @media (max-width: 480px) {
      .features-container {
        padding: 8px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        max-width: 100%;
      }

      .feature-card {
        min-width: 220px;
        max-width: 100%;
        min-height: 130px;
        max-height: 150px;
      }

      .card-header {
        font-size: 13px;
        gap: 5px;
      }

      .card-header .el-icon {
        font-size: 16px;
        width: 24px;
        height: 24px;
      }

      .card-desc {
        font-size: 11px;
        line-height: 1.4;
      }
    }
  }
}
.AiTalk {
  width: 25%;
}

/* 响应式布局 - 主容器调整 */
@media (max-width: 1024px) {
  .content {
    flex-direction: column;
  }

  .createmind {
    width: 100%;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .createmind {
    padding: 15px;
  }

  .createmind-title {
    font-size: 18px !important;
  }
}

@media (max-width: 480px) {
  .createmind {
    padding: 10px;
    margin: 1% auto;
    width: 97%;
  }
  .createmind-title {
    font-size: 16px !important;
  }
}
</style>
