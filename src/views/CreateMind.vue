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

        <div class="mindmap-container"></div>
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

const uploadedFileName = ref('') // 存储上传的文件名
const LayoutStore = useLayoutStore()
const progress = ref(0) // 进度条进度
const uploadProgress = ref(0)
const status = ref<
  'init' | 'uploading' | 'parsing' | 'success' | 'error' | 'view'
>('init') // 文件状态

// 处理文件上传
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadedFileName.value = target.files[0].name // 记录文件名
    status.value = 'uploading' // 初始状态 -->上传中状态
    uploadProgress.value = 0 // 重置上传进度

    // 上传
    const uploadTimer = setInterval(() => {
      progress.value += 5
      if (progress.value >= 100) {
        clearInterval(uploadTimer)
        status.value = 'parsing' // 上传完成→解析中
        progress.value = 0 // 重置进度条用于解析阶段
        startParsing() // 开始解析
      }
    }, 100)
  }
}

//解析
const startParsing = () => {
  const parseTimer = setInterval(() => {
    progress.value += 5
    if (progress.value >= 100) {
      clearInterval(parseTimer)
      // 随机模拟成功/失败（实际项目中根据接口结果判断）
      const isSuccess = Math.random() > 0.3 // 70%成功率
      status.value = isSuccess ? 'success' : 'error'
    }
  }, 100)
}

// 解析成功
const viewMindmap = () => {
  status.value = 'view' // 解析完成→查看导图
}

// 解析失败
const reUpload = () => {
  status.value = 'init' // 失败→初始状态
  progress.value = 0
  uploadedFileName.value = ''
}

onMounted(() => {
  //进入生成导图页面将导航栏展开
  LayoutStore.isCollapse = false
})
onUnmounted(() => {
  //离开生成导图页面将导航栏折叠
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
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 80%;
        height: 80px;
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
      margin: 0 auto;
      overflow: auto;

      .uploading-text {
        font-size: 18px;
        color: #666;
        font-weight: 500;
      }
    }
  }
}
.AiTalk {
  width: 25%;
}
</style>
