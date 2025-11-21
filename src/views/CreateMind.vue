<template>
  <div class="content">
    <div class="createmind">
      <div class="createmind-title">导图生成区</div>

      <div v-if="status === 'init'" class="init-area">
        <div class="upload-area">
          <el-upload
            class="upload-demo"
            action="#"
            :on-change="handleFileUpload"
            :before-upload="beforeUpload"
            :auto-upload="false"
            accept=".txt,.docx,.pdf"
            :style="{ borderRadius: '20px' }"
          >
            <template #trigger>
              <el-button
                size="large"
                type="primary"
                :style="{ borderRadius: '20px' }"
              >
                <el-icon><Upload /></el-icon>
                <span>上传文件</span>
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

        <div class="mindmap-container">
          <img
            src="@/assets/images/example-mindmap.jpg"
            alt="example-mindmap"
            class="example-mindmap"
          />
        </div>
      </div>

      <div v-else-if="status === 'uploading'" class="processing-area">
        <p class="processing-text">文件上传中...</p>
        <img
          src="@/assets/images/hourglass.png"
          class="hourglass-icon"
          alt="hourglass"
        />
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="progress-text">{{ progress }}%</p>
      </div>

      <div v-else-if="status === 'parsing'" class="processing-area">
        <p class="processing-text">文件解析中...</p>
        <img
          src="@/assets/images/analyzing.png"
          class="analyzing-icon"
          alt="analyzing"
        />
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="progress-text">{{ progress }}%</p>
      </div>

      <div v-else-if="status === 'success'" class="result-area">
        <p class="result-title">解析完成</p>
        <div class="result-icon success-icon">✓</div>
        <p class="result-desc">您的导图已生成</p>
        <el-button
          type="primary"
          size="large"
          @click="viewMindmap"
          :style="{ borderRadius: '20px' }"
          >查看导图</el-button
        >
      </div>

      <div v-else-if="status === 'error'" class="result-area">
        <p class="result-title">文件解析失败</p>
        <div class="result-icon error-icon">✕</div>
        <p class="result-desc">请确认文件清晰或格式支持</p>
        <el-button
          type="primary"
          size="large"
          @click="reUpload"
          :style="{ borderRadius: '20px' }"
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
import { generateMindMap, createMindMap } from '@/api/user/index'
import type { CreateMindMapParams } from '@/utils/type'
import JSON5 from 'json5'
import { useUserStore } from '@/stores'
import { Upload } from '@element-plus/icons-vue'

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
    const Resp = await generateMindMap(file)
    const generateResp = Resp as any
    console.log('生成导图接口调用完成，收到响应：', generateResp)
    console.groupEnd()

    if (
      !generateResp ||
      generateResp.Code !== 200 ||
      !generateResp.Data.success ||
      !generateResp.Data.map_json
    ) {
      const errorMsg = generateResp?.Message || '生成导图(草稿)失败!'
      console.error('"生成导图" 接口业务逻辑失败:', errorMsg)
      throw new Error(errorMsg)
    }

    // 将草稿的map_json解析为对象：
    const mapJsonString = generateResp.Data.map_json
    console.log('原始map_json字符串:', mapJsonString)
    console.log('字符串长度:', mapJsonString.length)
    console.log('末尾50个字符:', mapJsonString.slice(-50))
    let draftMapData
    try {
      draftMapData = JSON5.parse(mapJsonString)
    } catch (parseError) {
      console.error('生成导图 JSON 解析失败:', parseError)
      throw new Error('生成导图 JSON 解析失败，请检查文件内容！')
    }
    // 构造创建导图的请求参数：
    const createParams: CreateMindMapParams = {
      title: draftMapData.title || '未命名导图',
      desc: draftMapData.desc || '无描述',
      layout: draftMapData.layout || 'tree',
      root: draftMapData.root
    }

    // 调用创建导图接口：
    console.group('===调用`创建导图`接口===')
    console.log('请求参数：', createParams)
    console.log('开始调用创建导图接口...')
    status.value = 'saving'
    const cr = await createMindMap(createParams)
    const createResp = cr as any
    console.log('"创建导图" 接口调用完成，收到响应：', createResp)
    console.groupEnd()
    if (!createResp || createResp.Code !== 200 || !createResp.Data?.mapId) {
      const errorMsg = createResp?.Message || '创建正式导图失败！'
      console.error('"创建导图" 接口业务逻辑失败:', errorMsg)
      throw new Error(errorMsg)
    }

    const userStore = useUserStore()
    // 用正式数据更新全局状态：
    const formalMapData = {
      ...draftMapData,
      mapId: createResp.Data.mapId,
      userId: userStore.userInfo?.user_id || ''
    }
    LayoutStore.data = formalMapData

    // 网络请求完成后，清楚进度条计时器，并将进度条直接拉满：
    clearInterval(progressInterval)
    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 1000))
    status.value = 'success'
    console.log('导图创建流程全部成功！最终数据:', formalMapData)
    ElMessage.success('导图创建成功！')
  } catch (error) {
    clearInterval(progressInterval)
    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 1000))
    if ((error as Error).message.includes('JSON')) {
      ElMessage.error('文件解析失败，文件内容不符合 JSON 格式！')
    } else {
      ElMessage.error((error as Error).message || '文件处理失败，请重试！')
    }
    console.error('文件处理失败:', error)
    status.value = 'error'
  }
}

// 查看导图（跳转编辑页）
const viewMindmap = () => {
  const mapId = LayoutStore.data?.mapId
  if (mapId && mapId !== 'xxx') {
    router.push({ name: 'generate-pro', query: { mapId } }) // 携带 mapId
  } else {
    ElMessage.warning('导图数据未找到或未生成正式ID，无法跳转')
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
    margin-right: 20px;
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
      flex-direction: column;
      margin: 0 auto;
      gap: 10px;
      width: 100%;

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        gap: 20px;
        width: 100%;
        padding: 40px 0;
      }

      .upload-demo {
        display: flex;
        justify-content: center;
      }
      .upload-desc {
        font-size: 14px;
        color: #999;
        margin-left: 10%;
        margin-bottom: 10px;
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

      // 加载动画
      .hourglass-icon {
        width: 100px;
        height: 100px;
        animation: hourglass-rotate 2s ease-in-out infinite;
      }

      // 沙漏动画关键帧
      @keyframes hourglass-rotate {
        0% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(180deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      // 解析动画
      .analyzing-icon {
        width: 100px;
        height: 100px;
        animation: analyzing-rotate 3s ease-in-out infinite;
      }

      @keyframes analyzing-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      // 进度条
      .progress-container {
        width: 80%;
        height: 8px;
        background-color: #f0f2f5;
        border-radius: 4px;
        overflow: hidden;

        .progress-bar {
          height: 100%;
          background-color: #608bd2;
          transition: width 0.3s ease;
        }
      }

      .progress-text {
        font-size: 14px;
        color: #608bd2;
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

      .result-icon {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 60px;
        font-weight: bold;
        border: 8px solid #608bd2;
      }

      .success-icon {
        color: #608bd2;
      }

      .error-icon {
        color: #608bd2;
      }

      .result-desc {
        font-size: 16px;
        color: #666;
      }

      /* 使用Element Plus按钮组件的内置样式 */
    }

    .mindmap-container {
      flex: 1;
      padding: 15px;
      border-radius: 20px;
      background-color: #ebeff8;
      width: 80%;
      height: 66%;
      display: flex;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      max-height: 80%;
      top: 30%;
      left: 10%;
      position: absolute;

      .uploading-text {
        font-size: 18px;
        color: #666;
        font-weight: 500;
      }

      .example-mindmap {
        display: flex;
        width: 80%;
        height: 100%;
        margin: 0 auto;
        border-radius: 20px;
      }
    }
  }
}
.AiTalk {
  width: 25%;
}
</style>
