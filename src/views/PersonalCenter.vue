<template>
  <div class="personal-center">
    <div class="personal-info-container">
      <!-- 基本信息 -->
      <div class="section">
        <h3 class="section-title">基本信息</h3>
        <div class="basic-info">
          <!-- 头像 -->
          <div class="avatar-wrapper">
            <div class="avatar">
              <img
                :src="getAvatarUrl(userInfo.avatar)"
                alt="personal"
                class="avatar-img"
                @error="handleAvatarError"
              />
            </div>
            <button class="edit-avatar-btn" @click="openAvatarDialog">
              修改头像
            </button>
          </div>

          <!-- 修改头像弹窗 -->
          <ElDialog v-model="avatarDialogOpen" title="修改头像" width="30%">
            <div class="avatar-upload-container">
              <ElUpload
                :file-list="avatarFileList"
                :on-change="handleFileChange"
                :auto-upload="false"
                list-type="picture-card"
              >
                <div class="upload-btn">
                  <ElIcon size="24"><Upload /></ElIcon>
                  <div class="upload-text">上传头像</div>
                </div>
              </ElUpload>
            </div>
            <template #footer>
              <ElButton @click="avatarDialogOpen = false">取消</ElButton>
              <ElButton
                type="primary"
                @click="handleUpdateAvatar"
                :disabled="!avatarFileList.length"
                >确定</ElButton
              >
            </template>
          </ElDialog>

          <!-- 用户名 -->
          <div class="username-wrapper">
            <span class="label">用户名:</span>
            <span class="username">{{ userInfo.username }}</span>
            <button class="edit-btn" @click="openUsernameDialog">
              <el-icon><Edit /></el-icon>修改用户名
            </button>
          </div>

          <!-- 修改用户名弹窗 -->
          <ElDialog v-model="usernameDialogOpen" title="修改用户名" width="30%">
            <ElInput
              v-model="newUsername"
              placeholder="请输入用户名"
              max-length="20"
              show-word-limit
            />
            <template #footer>
              <ElButton @click="usernameDialogOpen = false">取消</ElButton>
              <ElButton type="primary" @click="handleUpdateUsername"
                >确定</ElButton
              >
            </template>
          </ElDialog>
        </div>
      </div>

      <!-- 账号安全 -->
      <div class="section">
        <h3 class="section-title">账号安全</h3>
        <div class="security-info">
          <div class="security-item">
            <span class="label">手机号码：</span>
            <span class="userphone">{{ userInfo.phone }}</span>
            <span class="status">{{
              userInfo.phoneBound ? '已绑定' : '未绑定'
            }}</span>
          </div>

          <div class="security-item">
            <span class="label">账号密码：</span>
            <span class="status">{{
              userInfo.passwordSet ? '已设置' : '未设置'
            }}</span>
            <button class="edit-btn">修改密码</button>
          </div>

          <div class="security-item">
            <span class="label">邮箱绑定：</span>
            <span class="useremail">{{ userInfo.email }}</span>
            <span class="status">{{
              userInfo.emailBound ? '已绑定' : '未绑定'
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Upload } from '@element-plus/icons-vue'
import { ElDialog, ElUpload, ElButton, ElMessage, ElIcon } from 'element-plus'
import type { UploadProps } from 'element-plus'
import type { UserInfo } from '../utils/type'
import { ref } from 'vue'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像
import { useUserStore } from '@/stores/modules/user'
// import { useRouter } from 'vue-router'

// 初始化用户仓库：
const userStore = useUserStore()
// const router = useRouter()

// 模拟用户数据:
const userInfo = ref<UserInfo>({
  username: '你的名字', // userStore.userName || '你的名字',
  avatar: defaultAvatar,
  phone: '12345678901',
  email: 'piaodaqiang@163.com',
  passwordSet: true,
  phoneBound: true,
  emailBound: true
})

// 修改头像：
const avatarDialogOpen = ref(false)
const avatarFileList = ref<UploadProps['fileList']>([])

// 打开头像弹窗：
const openAvatarDialog = () => {
  avatarFileList.value = []
  avatarDialogOpen.value = true
}

const handleFileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  avatarFileList.value = uploadFiles

  // 文件校验：
  const file = uploadFile.raw
  if (file) {
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请上传图片文件！')
      avatarFileList.value = []
      return
    }
    if (file.size / 1024 / 1024 > 2) {
      ElMessage.error('图片文件大小不能超过2MB！')
      avatarFileList.value = []
      return
    }
  }
}

// 处理更新头像的逻辑:
const handleUpdateAvatar = async () => {
  if (avatarFileList.value.length === 0) {
    ElMessage.warning('请先选择头像图片!')
    return
  }

  try {
    const selectedFile = avatarFileList.value[0]?.raw
    if (!selectedFile) {
      ElMessage.error('获取图片文件失败！')
      return
    }
    const tempImageUrl = URL.createObjectURL(selectedFile)

    // 模拟API请求延迟：
    console.log('正在模拟上传并更新头像...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    userInfo.value.avatar = tempImageUrl.valueOf()
    ElMessage.success('头像更新成功！')
    avatarDialogOpen.value = false
  } catch (error) {
    console.error('更新头像失败：', error)
    ElMessage.error('更新头像失败！')
  }
}

// 处理本地静态资源路径：
const getAvatarUrl = (avatar: string) => {
  // 是否是本地路径：
  if (avatar.startsWith('@/') || avatar.startsWith('./')) {
    return new URL(avatar, import.meta.url).href
  }
  // 网络路径：
  return avatar
}

// 加载头像失败处理：
const handleAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = new URL(defaultAvatar, import.meta.url).href
}

// 修改用户名：
const usernameDialogOpen = ref(false)
const newUsername = ref('')

// 打开用户名弹窗：
const openUsernameDialog = () => {
  newUsername.value = userInfo.value.username // 显示当前用户名
  usernameDialogOpen.value = true
}

// 提交用户名修改：// 等待后端
const handleUpdateUsername = () => {
  if (!newUsername.value.trim()) {
    ElMessage.warning('用户名不能为空！')
    return
  }

  // 刷新本地状态：
  userInfo.value.username = newUsername.value
  userStore.updateUsername(newUsername.value)
  ElMessage.success('用户名修改成功！')
  usernameDialogOpen.value = false
}
</script>

<style lang="scss" scoped>
.personal-info-container {
  width: 100%;
  max-height: 800px;
  padding: 20px;
}

// 通用区域样式:
.section {
  font-size: 18px;
  font-weight: 600;
  color: #4e4e4e;
  margin-bottom: 16px;
  padding-bottom: 16px;
}

// 基本信息:
.basic-info {
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 10px 0;

  .avatar-wrapper {
    margin-left: 6%;
    display: flex;
    flex-direction: column;
    align-items: center; // 修改头像 "按钮" y 轴居中
    gap: 10px; // 头像与按钮之间的间距

    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #ddd;

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .edit-avatar-btn {
      font-size: 14px;
      background-color: transparent;
      border: none;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }

  .avatar-upload-container {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border: 1px dashed #999;
    border-radius: 50%;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }

  .username-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;

    .label {
      color: #666;
    }

    .username {
      color: #333;
      font-weight: 500;
    }

    .edit-btn {
      font-size: 14px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      align-items: center;
      display: flex;
      gap: 5px;

      &:hover {
        color: #409eff;
      }
    }
  }
}

// 账号安全：
.security-info {
  padding: 20px 70px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .security-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .label {
      font-size: 18px;
      color: #666;
      width: 100px;
      text-align: right;
    }

    .status {
      font-size: 16px;
      padding: 2px 8px;
      color: #5a6edf;
      font-weight: 500;
    }

    .edit-btn {
      margin-left: 10px;
      padding: 2px 8px;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      background-color: transparent;
      cursor: pointer;
      color: #3687d8;
      display: flex;
      align-items: center;
      gap: 5px;

      &:hover {
        color: #409eff;
      }
    }

    .userphone,
    .useremail {
      font-size: 16px;
      color: #333;
      font-weight: 500;
      padding: 2px 8px;
    }
  }
}
</style>
