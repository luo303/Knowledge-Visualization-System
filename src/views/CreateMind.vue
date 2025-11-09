<template>
  <div class="content">
    <div class="createmind">
      <div class="createmind-title">导图生成区</div>

      <div v-if="status === 'init'" class="init-area">
        <div class="upload-area">
          <label class="upload-btn">
            <input
              type="file"
              class="file-input"
              accept=".txt,.docx,.pdf"
              @change="handleFileUpload"
            />
            <div class="upload-icon">
              <img class="upload-icon" src="@/assets/images/file-upload.png" />
            </div>
            <div class="upload-text">上传文件</div>
          </label>
          <p class="upload-desc" v-if="uploadedFileName">
            已上传: {{ uploadedFileName }}
          </p>
          <p class="upload-desc" v-else>支持 TXT、DOCX、PDF 格式文件</p>
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
        <el-button class="result-btn" @click="viewMindmap">查看导图</el-button>
      </div>

      <div v-else-if="status === 'error'" class="result-area">
        <p class="result-title">文件解析失败</p>
        <div class="result-icon error-icon">✕</div>
        <p class="result-desc">请确认文件清晰或格式支持</p>
        <el-button class="result-btn" @click="reUpload">重新上传</el-button>
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

const uploadedFileName = ref('') // 存储上传的文件名
const LayoutStore = useLayoutStore()
const progress = ref(0) // 进度条进度
const status = ref<
  'init' | 'uploading' | 'parsing' | 'success' | 'error' | 'view'
>('init') // 文件状态
const router = useRouter()
const tempMindMapData = ref<any>(null) // 预留：存储未来真实接口的临时数据

// 模拟上传文件（无后端地址时用，后续替换为真实接口）
const mockUploadFile = (file: File) => {
  return new Promise<any>(resolve => {
    const uploadTimer = setInterval(() => {
      progress.value += 5
      if (progress.value >= 100) {
        clearInterval(uploadTimer)
        // 模拟返回临时思维导图数据（结构和真实接口一致）
        resolve({
          data: {
            title: file.name.replace(/\.[^.]+$/, ''), // 用文件名当导图标题
            desc: '由上传文件生成',
            layout: 'tree',
            root: {
              data: { text: '根节点' },
              children: [{ data: { text: '二级节点' }, children: [] }]
            }
          }
        })
      }
    }, 100)
  })
}

// 模拟创建导图（无后端地址时用，后续替换为真实接口）
const mockCreateMap = (tempData: any) => {
  return new Promise<any>(resolve => {
    // 模拟后端处理延迟（1秒）
    setTimeout(() => {
      resolve({
        data: {
          Code: 200,
          Message: '成功',
          Data: {
            mapId: `map_${Date.now()}`, // 生成唯一mapId
            userId: LayoutStore.data?.userId || '123456', // 从仓库取用户ID
            ...tempData
          }
        }
      })
    }, 1000)
  })
}

// 处理文件上传
const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    uploadedFileName.value = file.name
    status.value = 'uploading'
    progress.value = 0

    try {
      //  模拟上传 后续替换为真实接口：await uploadFileForMindMap(file, {...})
      const uploadRes = await mockUploadFile(file)
      tempMindMapData.value = uploadRes.data // 存储临时数据

      // 2. 上传完成 → 切换到 解析中
      status.value = 'parsing'
      progress.value = 0

      // 3. 模拟解析进度
      await new Promise<void>(resolve => {
        const parseTimer = setInterval(() => {
          progress.value += 5
          if (progress.value >= 100) {
            clearInterval(parseTimer)
            resolve()
          }
        }, 100)
      })

      // 4. 解析完成 后 调用创建导图接口 后续替换为真实接口：await createMap(...)
      const createRes = await mockCreateMap(tempMindMapData.value)

      // 5. 创建成功 后 存储数据 并切换状态
      if (createRes.data?.Code === 200 && createRes.data?.Data?.mapId) {
        LayoutStore.data = createRes.data.Data // 保存到Layout仓库
        status.value = 'success'
      } else {
        throw new Error('创建导图失败')
      }
    } catch (error) {
      console.error('文件处理失败：', error)
      ElMessage.error('文件处理失败，请重试')
      status.value = 'error'
    }
  }
}

// 查看导图（跳转编辑页）
const viewMindmap = () => {
  const mapId = LayoutStore.data?.mapId
  if (mapId) {
    router.push({ name: 'handedit', query: { mapId } }) // 携带 mapId
  } else {
    ElMessage.warning('导图数据未找到，无法跳转')
  }
}

// 重新上传（重置所有状态）
const reUpload = () => {
  status.value = 'init'
  progress.value = 0
  uploadedFileName.value = ''
  tempMindMapData.value = null
  const fileInput = document.querySelector('.file-input') as HTMLInputElement
  if (fileInput) fileInput.value = '' // 清空文件选择框
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
      margin: 0 10%;
      gap: 10px;
      width: 100%;

      .upload-btn {
        display: inline-flex;
        position: absolute;
        top: 10%;
        left: 10%;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 80%;
        height: 15%;
        background-color: #f0f2f5;
        border: 2px #c9cdd4;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: #e8eaed;
          border-color: #608bd2;
        }

        .upload-icon {
          height: 35px;
          width: 35px;
        }

        .upload-text {
          font-size: 32px;
          color: #666;
          font-weight: 600;
        }

        .file-input {
          display: none;
        }
      }
      .upload-desc {
        font-size: 14px;
        color: #999;
        margin-left: 1%;
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
      border-radius: 12px;
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
      border-radius: 12px;
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

      .result-btn {
        margin-top: 10px;
        padding: 20px 35px;
        font-size: 20px;
        background-color: #608bd2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #4a77c8;
        }
      }
    }

    .mindmap-container {
      flex: 1;
      padding: 15px;
      border-radius: 12px;
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
        border-radius: 10px;
      }
    }
  }
}
.AiTalk {
  width: 25%;
}
</style>
