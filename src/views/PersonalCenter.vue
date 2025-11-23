<template>
  <el-card class="personal-center">
    <el-row :gutter="24" class="personal-info-container">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="section-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="section-title">基本信息</span>
            </div>
          </template>
          <div class="basic-info">
            <!-- 头像 -->
            <div class="avatar-wrapper">
              <el-avatar
                :src="getAvatarUrl(userInfo.avatar)"
                size="large"
                @error="handleAvatarError"
              >
                {{ userInfo.user_name?.charAt(0) || '用' }}
              </el-avatar>
              <el-button
                type="primary"
                plain
                size="small"
                @click="openAvatarDialog"
                class="mt-2"
              >
                <el-icon><Upload /></el-icon>修改头像
              </el-button>
            </div>

            <!-- 修改头像弹窗 -->

            <!-- 用户名 -->
            <div class="username-wrapper">
              <el-descriptions border :xs="1" :sm="2">
                <el-descriptions-item label="用户名">{{
                  userInfo.user_name
                }}</el-descriptions-item>
              </el-descriptions>
              <el-button
                type="primary"
                link
                @click="openUsernameDialog"
                class="mt-2"
              >
                <el-icon><Edit /></el-icon>修改用户名
              </el-button>
            </div>

            <footer>
              <el-button
                type="primary"
                @click="handleSwitchAccount"
                size="large"
              >
                切换账号
              </el-button>
            </footer>
          </div>
        </el-card>

        <el-dialog v-model="avatarDialogOpen" title="修改头像" width="30%">
          <div class="avatar-upload-container">
            <el-upload
              :file-list="avatarFileList"
              :on-change="handleFileChange"
              :auto-upload="false"
              list-type="picture-card"
              :show-file-list="showUploadComponent"
            >
              <div v-if="showUploadComponent">
                <el-icon size="24"><Upload /></el-icon>
                <div>上传头像</div>
              </div>
            </el-upload>
          </div>
          <template #footer>
            <el-button @click="avatarDialogOpen = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleUpdateAvatar"
              :disabled="!avatarFileList.length"
            >
              确定
            </el-button>
          </template>
        </el-dialog>
      </el-col>

      <!-- 修改用户名弹窗 -->
      <el-dialog v-model="usernameDialogOpen" title="修改用户名" width="30%">
        <el-input
          v-model="newUsername"
          placeholder="请输入用户名"
          max-length="20"
          show-word-limit
          :style="{ borderRadius: 'var(--el-border-radius-base)' }"
        />
        <template #footer>
          <el-button @click="usernameDialogOpen = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateUsername"
            >确定</el-button
          >
        </template>
      </el-dialog>

      <!-- 账号安全 -->
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-card class="section-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="section-title">账号安全</span>
            </div>
          </template>
          <div class="security-container">
            <el-descriptions border :column="1" class="security-info">
              <el-descriptions-item label="手机号码">
                <div class="security-content">
                  <span class="content-text">{{
                    userInfo.phone || '未设置'
                  }}</span>
                  <el-button
                    type="primary"
                    link
                    @click="openchange('phone')"
                    :class="{ 'text-green-500': userInfo.phone }"
                  >
                    {{
                      userInfo.phone
                        ? '已绑定(点击可换绑)'
                        : '未绑定(点击进行绑定)'
                    }}
                  </el-button>
                </div>
              </el-descriptions-item>

              <el-descriptions-item label="账号密码">
                <div class="security-content">
                  <span class="content-text">{{
                    userInfo.has_password ? '已设置' : '未设置'
                  }}</span>
                  <el-button type="primary" link @click="openPasswordDialog">
                    修改密码
                  </el-button>
                </div>
              </el-descriptions-item>

              <el-descriptions-item label="邮箱绑定">
                <div class="security-content">
                  <span class="content-text">{{
                    userInfo.email || '未设置'
                  }}</span>
                  <el-button
                    type="primary"
                    link
                    @click="openchange('email')"
                    :class="{ 'text-green-500': userInfo.email }"
                  >
                    {{
                      userInfo.email
                        ? '已绑定(点击可换绑)'
                        : '未绑定(点击进行绑定)'
                    }}
                  </el-button>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <!-- 用户提示卡片 -->
        <el-card
          class="section-card mt-4"
          shadow="hover"
          style="min-height: 260px"
        >
          <template #header>
            <div class="card-header">
              <span class="section-title">温馨提示</span>
            </div>
          </template>
          <div class="tips-content">
            <p class="tips-text">
              亲爱的用户，感谢您使用我们的知识可视化系统！
            </p>
            <ul class="tips-list">
              <li>• 请定期更新您的密码，确保账号安全</li>
              <li>• 建议绑定手机号和邮箱，方便账号找回</li>
              <li>• 上传清晰的头像可以提升您的个人形象</li>
              <li>• 如有任何问题，请联系我们的客服团队</li>
            </ul>
            <p class="tips-wish">祝您使用愉快！</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="passwordDialogOpen"
      title="修改密码"
      width="35%"
      @close="closePasswordDialog"
    >
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
            type="password"
            placeholder="请确认新密码"
            show-password
            class="password-input"
          />
        </el-form-item>

        <el-form-item prop="code" class="parent">
          <el-input
            v-model="formdata.code"
            type="text"
            placeholder="请输入验证码"
            class="password-input"
          />
          <el-button
            v-if="show"
            type="primary"
            @click="getCode('resetpassword')"
            text
            class="getCode-btn"
            >获取验证码</el-button
          >
          <el-button
            v-else
            type="default"
            @click="getCode('resetPassword')"
            text
            disabled
            class="getCode-btn"
            >{{ countdown }}s</el-button
          >
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button class="newpassword-cancel-btn" @click="closePasswordDialog"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="newpassword-confirm-btn"
          @click="handleUpdatePassword"
          >确定</el-button
        >
      </template>
    </el-dialog>
    <el-dialog
      v-model="changedDialogOpen"
      title="联系方式"
      width="35%"
      @close="closechange"
    >
      <el-form
        style="width: 100%"
        size="large"
        :model="changeForm"
        :rules="changerules"
        ref="changeRef"
        :hide-required-asterisk="true"
        label-width="auto"
        class="password-form"
      >
        <el-form-item prop="account" v-if="type === 'phone'">
          <el-input
            v-model="changeForm.account"
            placeholder="请输入新的手机号"
            class="password-input"
          />
        </el-form-item>
        <el-form-item prop="account" v-else>
          <el-input
            v-model="changeForm.account"
            placeholder="请输入新的邮箱"
            class="password-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="changeForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            class="password-input"
          />
        </el-form-item>

        <el-form-item prop="code" class="parent">
          <el-input
            v-model="changeForm.code"
            type="text"
            placeholder="请输入验证码"
            class="password-input"
          />
          <el-button
            v-if="show"
            type="primary"
            @click="getCode('changeaccount')"
            text
            class="getCode-btn"
            >获取验证码</el-button
          >
          <el-button
            v-else
            type="default"
            @click="getCode('changeaccount')"
            text
            disabled
            class="getCode-btn"
            >{{ countdown }}s</el-button
          >
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button class="newpassword-cancel-btn" @click="closechange"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="newpassword-confirm-btn"
          @click="changecontact"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { Edit, Upload } from '@element-plus/icons-vue'
import {
  ElDialog,
  ElUpload,
  ElButton,
  ElMessage,
  ElIcon,
  ElMessageBox
} from 'element-plus'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import {
  Forgetpwd,
  Getcode,
  GetForChangecode,
  ChangeContact,
  ChangeName
} from '@/api/user'
import { ChangeAvatar, getHome } from '@/api/user'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores'
const LayoutStore = useLayoutStore()
type UploadProps = (typeof ElUpload)['props']

// 初始化用户仓库：
const userStore = useUserStore()
const router = useRouter()
const { userInfo } = storeToRefs(userStore)
onMounted(() => {
  fetchHomeData()
  LayoutStore.isCollapse = false
})

onUnmounted(() => {
  LayoutStore.isCollapse = true
})

// 获取个人中心数据：
const fetchHomeData = async () => {
  try {
    const res = await getHome()
    const response = res as any

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
// 修改用户名：
const usernameDialogOpen = ref(false)
const newUsername = ref('')
// 修改密码弹窗
const passwordDialogOpen = ref(false)
//换绑或绑定弹窗
const changedDialogOpen = ref(false)

const phoneReg = /^1[3-9]\d{9}$/
const emailReg =
  /^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
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
const changeRef = ref()
//换绑或绑定校验规则
//换绑类型（手机还是邮箱）
const type = ref('')
const changerules = ref({
  password: [
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
  account: [
    {
      validator: (rule: any, value: any, cb: any) => {
        if (type.value === 'phone') {
          if (userStore.userInfo?.phone && value === userStore.userInfo.phone) {
            cb('请输入新的电话号码')
          } else if (phoneReg.test(value)) {
            changeForm.value.account_type = 'phone'
            cb()
          } else {
            cb('请输入正确的电话号码')
          }
        } else {
          if (userStore.userInfo?.email && value === userStore.userInfo.email) {
            cb('请输入新的邮箱')
          } else if (emailReg.test(value)) {
            changeForm.value.account_type = 'email'
            cb()
          } else {
            cb('请输入正确的邮箱')
          }
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

//换绑或绑定表单
const changeForm = ref({
  account: '',
  account_type: '',
  code: '',
  password: ''
})
//换绑或绑定验证码
const ForChangeCode = computed(() => ({
  account: changeForm.value.account,
  account_type: changeForm.value.account_type,
  purpose: 'change_account'
}))

//修改密码
const formRef = ref()
//修改密码表单（默认用邮箱发送验证码，如果只有手机号就用手机号）
const formdata = ref({
  confirm_password: '',
  new_password: '',
  account: userStore.userInfo?.email
    ? userStore.userInfo.email
    : userStore.userInfo.phone!,
  account_type: userStore.userInfo?.email ? 'email' : 'phone'!,
  code: ''
})
//修改密码验证码
const Code = computed(() => ({
  account: userStore.userInfo?.email
    ? userStore.userInfo.email
    : userStore.userInfo.phone!,
  account_type: userStore.userInfo?.email ? 'email' : 'phone'!,
  purpose: 'reset_password'
}))

// 修改头像：
const avatarDialogOpen = ref(false)
const avatarFileList = ref<UploadProps['fileList']>([])
const showUploadComponent = ref(false)

const handleFileChange: UploadProps['onChange'] = (uploadFile: any) => {
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
    // 调用真实 API
    avatarDialogOpen.value = false
    ElMessage.success('更新中，请稍等')
    const response = await ChangeAvatar(formData)

    if ((response as any).Code === 200 && (response as any).Data.avatar_url) {
      userStore.updateAvatar((response as any).Data.avatar_url)
      ElMessage.success('头像更新成功！')
    } else {
      ElMessage.error((response as any).Message || '更新头像失败！')
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

// 打开用户名弹窗：
const openUsernameDialog = () => {
  newUsername.value = userInfo.value.user_name // 显示当前用户名
  usernameDialogOpen.value = true
}

// 提交用户名修改：
const handleUpdateUsername = async () => {
  if (!newUsername.value.trim()) {
    ElMessage.warning('用户名不能为空！')
    return
  }
  try {
    const res = await ChangeName(newUsername.value)
    if ((res as any).Code === 200) {
      userStore.userInfo.user_name = (res as any).Data.user_name
      ElMessage.success('更改用户名成功')
    } else {
      ElMessage.error('更改失败')
    }
  } catch (error) {
    console.log(error)
  } finally {
    usernameDialogOpen.value = false
  }
}

// 修改密码：

// 打开弹窗：
const openPasswordDialog = () => {
  passwordDialogOpen.value = true
}

// 关闭弹窗：
const closePasswordDialog = () => {
  passwordDialogOpen.value = false
  formRef.value.resetFields()
}

//获取验证码
const countdown = ref(60)
const show = ref(true)
let timer: any = null
const getCode = async (type: string) => {
  if (type === 'resetpassword') {
  } else {
    await changeRef.value.validateField(['account'])
  }
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
    const res =
      type === 'resetpassword'
        ? await Getcode(Code.value)
        : await GetForChangecode(ForChangeCode.value)
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
  } finally {
    passwordDialogOpen.value = false
  }
}

//点击文字打开换绑弹框
const openchange = (name: string) => {
  changedDialogOpen.value = true
  type.value = name
}
//取消换绑弹框
const closechange = () => {
  changedDialogOpen.value = false
  changeRef.value.resetFields()
}
//确认换绑
const changecontact = async () => {
  await changeRef.value.validate()
  try {
    const res = await ChangeContact(changeForm.value)
    if ((res as any).Code === 200) {
      if (changeForm.value.account_type === 'email') {
        userStore.userInfo.email = (res as any).Data.account
      } else if (changeForm.value.account_type === 'phone') {
        userStore.userInfo.phone = (res as any).Data.account
      } else {
        ElMessage.error('系统错误，没有这种联系方式')
      }
    } else {
      ElMessage.error(`${(res as any).Message}`)
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('系统错误')
  } finally {
    changedDialogOpen.value = false
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
.personal-center {
  position: relative;
  border-radius: 20px;

  .personal-info-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-card {
    border-radius: var(--el-border-radius-base);
    transition: all 0.3s ease;
  }

  .section-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .basic-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 49px 0;
  }

  .avatar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-bottom: 50px;
  }

  .avatar-upload-container {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .username-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
  }

  .security-info {
    width: 100%;
  }

  .security-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .content-text {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-green-500 {
    color: var(--el-color-success) !important;
  }

  .mt-2 {
    margin-top: 8px;
  }

  .mt-4 {
    margin-top: 16px;
  }

  .password-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .password-input {
      width: 100%;
      margin-bottom: 16px;
    }
  }

  .el-form-item__content {
    position: relative;
  }

  .getCode-btn {
    position: absolute;
    right: 0px;
    top: -2px;
    padding: 0 10px;
    border-radius: var(--el-border-radius-base);
  }

  .parent {
    position: relative;
    padding: 10px 0px;
    display: flex;
    justify-content: center;
  }

  /* 保留必要的Dialog样式，其余使用Element-plus默认样式 */
  .el-dialog__title {
    font-weight: 600;
  }

  /* 按钮组样式 */
  .newpassword-cancel-btn,
  .newpassword-confirm-btn {
    min-width: 80px;
  }

  .newpassword-confirm-btn {
    margin-left: 20px;
    border-radius: var(--el-border-radius-base);
  }

  /* 温馨提示卡片样式 */
  .tips-content {
    padding: 0;
  }

  .tips-text {
    font-size: 16px;
    color: var(--el-text-primary-color);
    margin-bottom: 15px;
    font-weight: 500;
  }

  .tips-list {
    padding-left: 0;
    margin-bottom: 15px;
    font-size: 15px;
  }

  .tips-list li {
    list-style: none;
    padding: 5px 0;
    color: var(--el-text-regular-color);
    line-height: 1;
  }

  .tips-wish {
    color: var(--el-color-primary);
    font-weight: 500;
    margin-top: 5px;
  }
}
</style>
