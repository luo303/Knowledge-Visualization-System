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
                :src="getAvatarUrl(userInfo.avatar_url)"
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
              <el-upload
                :file-list="avatarFileList"
                :on-change="handleFileChange"
                :auto-upload="false"
                list-type="picture-card"
                :show-file-list="showUploadComponent"
              >
                <div class="upload-btn" v-if="showUploadComponent">
                  <ElIcon size="24"><Upload /></ElIcon>
                  <div class="upload-text">上传头像</div>
                </div>
              </el-upload>
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
            <span class="username">{{ userInfo.user_name }}</span>
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
              userInfo.phone ? '已绑定' : '未绑定'
            }}</span>
          </div>

          <div class="security-item">
            <span class="label">账号密码：</span>
            <span class="status">{{
              userInfo.has_password ? '已设置' : '未设置'
            }}</span>
            <button class="edit-btn" @click="openPasswordDialog">
              修改密码
            </button>
          </div>

          <ElDialog v-model="passwordDialogOpen" title="修改密码" width="35%">
            <el-form
              style="width: 100%"
              size="large"
              :model="formdata"
              :rules="rules"
              ref="formRef"
              :hide-required-asterisk="true"
              label-width="auto"
              class="password-form"
            >
              <el-form-item prop="new_password">
                <el-input
                  v-model="formdata.new_password"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                  class="password-input"
                />
              </el-form-item>

              <el-form-item prop="confirm_password">
                <el-input
                  v-model="formdata.confirm_password"
                  type="pasword"
                  placeholder="请确认新密码"
                  show-password
                  class="password-input"
                />
              </el-form-item>

              <el-form-item prop="code" class="parent">
                <el-input
                  v-model="formdata.code"
                  type="password"
                  placeholder="请输入验证码"
                  :show-password="showCode"
                  class="password-input"
                />
                <el-button
                  v-if="show"
                  type="primary"
                  @click="getCode"
                  text
                  class="getCode-btn"
                  >获取验证码</el-button
                >
                <el-button
                  v-else
                  type="default"
                  @click="getCode"
                  text
                  class="getCode-btn"
                  >{{ countdown }}s</el-button
                >
              </el-form-item>
            </el-form>

            <template #footer>
              <el-button
                class="newpassword-cancel-btn"
                @click="closePasswordDialog"
                >取消</el-button
              >
              <el-button
                type="primary"
                class="newpassword-confirm-btn"
                @click="handleUpdatePassword"
                >确定</el-button
              >
            </template>
          </ElDialog>

          <div class="security-item">
            <span class="label">邮箱绑定：</span>
            <span class="useremail">{{ userInfo.email }}</span>
            <span class="status">{{
              userInfo.email ? '已绑定' : '未绑定'
            }}</span>
          </div>
        </div>
      </div>

      <footer class="section">
        <button class="switch-account-btn" @click="handleSwitchAccount">
          切换账号
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Upload } from '@element-plus/icons-vue'
import {
  ElDialog,
  ElUpload,
  ElButton,
  ElMessage,
  ElIcon,
  ElMessageBox
} from 'element-plus'
import type { UploadProps } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { Forgetpwd, Getcode } from '@/api/user'
import { ChangeAvatar, getHome } from '@/api/user'
import { storeToRefs } from 'pinia'
import type { HomeResponse } from '@/api/user/type'
import { useLayoutStore } from '@/stores'
const LayoutStore = useLayoutStore()

// 初始化用户仓库：
const userStore = useUserStore()
const router = useRouter()
const { userInfo } = storeToRefs(userStore)

onMounted(() => {
  fetchHomeData()
})

// 获取个人中心数据：
const fetchHomeData = async () => {
  try {
    const axiosResponse = await getHome()
    if (!axiosResponse) {
      ElMessage.error('接口未返回任何数据')
      return
    }
    const response: HomeResponse = axiosResponse.data

    if (!response) {
      console.error('接口返回数据为空')
      ElMessage.error('获取个人信息失败')
      return
    }

    console.log('getHome接口返回的完整响应:', response)

    if (response.Code === 200) {
      userStore.setUserInfo(response.Data)
    } else {
      ElMessage.error(response.Message || '获取个人信息失败！')
    }
  } catch (error) {
    console.error('获取个人信息错误：', error)
    ElMessage.error('获取个人中心失败,请重试...')
  }
}

const formRef = ref()
const formdata = ref({
  confirm_password: '',
  new_password: '',
  account: '',
  account_type: '',
  code: ''
})
const Code = computed(() => ({
  account: formdata.value.account,
  account_type: formdata.value.account_type,
  purpose: 'reset_password'
}))

// 修改头像：
const avatarDialogOpen = ref(false)
const avatarFileList = ref<UploadProps['fileList']>([])
const showUploadComponent = ref(false)

const handleFileChange: UploadProps['onChange'] = uploadFile => {
  avatarFileList.value = [uploadFile]

  const file = uploadFile.raw

  if (!file) return

  // 文件类型和对应的后缀名：
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

  const fileExtension = file.name
    .substring(file.name.lastIndexOf('.'))
    .toLowerCase()

  // 校验文件类型
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error(`请上传 ${allowedExtensions.join(', ')} 格式的图片！`)
    avatarFileList.value = []
    return
  }

  // 校验文件后缀名
  if (!allowedExtensions.includes(fileExtension)) {
    ElMessage.error(
      `文件后缀名不允许，请使用 ${allowedExtensions.join(', ')}！`
    )
    avatarFileList.value = []
    return
  }

  // 校验文件大小
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片文件大小不能超过 5MB！')
    avatarFileList.value = []
    return
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

    // FormData 对象
    const formData = new FormData()
    formData.append('avatar', selectedFile)

    console.log('正在上传并更新头像...')
    console.log('准备上传的文件:', selectedFile)
    console.log('FormData 内容:', formData)

    // 调用真实 API
    const response = await ChangeAvatar(formData)

    console.log(response)

    if (response.data.Code === 200 && response.data.Data.avatar_url) {
      userStore.updateAvatar(response.data.Data.avatar_url)
      ElMessage.success('头像更新成功！')
      avatarDialogOpen.value = false
    } else {
      ElMessage.error(response.data.Message || '更新头像失败！')
    }
  } catch (error) {
    console.error('更新头像失败：', error)
    ElMessage.error('更新头像失败！')
  }
}

// 打开头像弹窗：
const openAvatarDialog = () => {
  avatarFileList.value = []
  avatarDialogOpen.value = true
  showUploadComponent.value = true
}

// 处理本地静态资源路径：
const getAvatarUrl = (avatarUrl: string | undefined) => {
  if (!avatarUrl) return defaultAvatar
  // 是否是本地路径：
  if (avatarUrl.startsWith('@/') || avatarUrl.startsWith('./')) {
    return new URL(avatarUrl, import.meta.url).href
  }
  // 网络路径：
  return avatarUrl
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
  newUsername.value = userInfo.value.user_name // 显示当前用户名
  usernameDialogOpen.value = true
}

// 提交用户名修改：// 等待后端
const handleUpdateUsername = () => {
  if (!newUsername.value.trim()) {
    ElMessage.warning('用户名不能为空！')
    return
  }

  // 刷新本地状态：
  userInfo.value.user_name = newUsername.value
  userStore.updateUsername(newUsername.value)
  ElMessage.success('用户名修改成功！')
  usernameDialogOpen.value = false
}

// 修改密码：
// 弹窗：
const passwordDialogOpen = ref(false)
// 密码：
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
// 显示/隐藏密码开关：
const showOldPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const showCode = ref(false)

// 打开弹窗：
const openPasswordDialog = () => {
  passwordDialogOpen.value = true
  resetPasswordForm()
}

// 关闭弹窗：
const closePasswordDialog = () => {
  passwordDialogOpen.value = false
  resetPasswordForm()
}

// 重置密码表单：
const resetPasswordForm = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showOldPwd.value = false
  showNewPwd.value = false
  showConfirmPwd.value = false
}

//获取验证码
const countdown = ref(60)
const show = ref(true)
let timer: any = null
const getCode = async () => {
  await formRef.value.validateField(['account'])
  clearInterval(timer)
  countdown.value = 60
  show.value = !show.value
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer)
      show.value = !show.value
      countdown.value = 60 // 重置
    } else {
      countdown.value--
    }
  }, 1000)
  try {
    const res = await Getcode(Code.value)
    if ((res as any).Code === 200) {
      ElMessage.success('验证码发送成功')
    } else {
      ElMessage.error((res as any).Message || '获取验证码失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('发送请求失败')
  }
}

// 校验：
const pwdReg =
  /^(?![a-zA-Z]+$)(?![a-z0-9]+$)(?![A-Z0-9]+$)(?![a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$)(?![a-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$)(?![A-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$).{8,16}$/
const rules = ref({
  confirm_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (value !== formdata.value.new_password) {
          cb('两次密码不一致')
        } else {
          cb()
        }
      },
      trigger: 'blur'
    }
  ],
  new_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, cb: any) => {
        if (pwdReg.test(value)) {
          cb()
        } else {
          cb('长度需为8-16位,含大小写字母、数字、特殊字符中的至少3种')
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

// 提交修改密码：（waiting for 后 端）
//确认按钮
const handleUpdatePassword = async () => {
  await formRef.value.validate()

  try {
    const res = await Forgetpwd(formdata.value)
    if ((res as any).Code === 200) {
      ElMessage.success('重置成功')
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } else {
      ElMessage.error((res as any).Message || '重置失败')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('发送请求失败')
  }
}

// 切换账号：
const handleSwitchAccount = async () => {
  try {
    await ElMessageBox.confirm('您确认要切换账号吗？', '确认切换', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    userStore.clearUserInfo()
    LayoutStore.clearMap() //清除导图和对话数据
    ElMessage.success('已退出登录！')
    router.push('/login')
  } catch (error) {
    ElMessage.info('已取消切换账号')
    console.error('取消切换账号：', error)
  }
}
</script>

<style lang="scss">
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

// 修改密码弹窗：
.password-form {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .password-input {
    width: 100%;
  }

  .show-pwd-toggle-container {
    text-align: right;
    font-size: 12px;

    .show-pwd-toggle {
      color: #409eff;
      cursor: pointer;
    }
  }
}

// 切换账号按钮：
.switch-account-btn {
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
  bottom: 10%;
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background-color: #409eff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #5cb3ff;
  }
}

.parent {
  position: relative;
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  .getCode-btn {
    position: absolute;
    right: 0;
    cursor: pointer;
  }
}

.newpassword-confirm-btn {
  margin-left: 20px;
}
</style>
