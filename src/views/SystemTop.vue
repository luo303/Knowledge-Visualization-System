<template>
  <div>
    <div class="header">
      <div class="box1">
        <h1><span class="square"></span>知识可视化系统</h1>
      </div>
      <div class="box2">
        <div class="icon-container">
          <el-button
            class="notification-btn"
            type="text"
            @click="handleToMessage"
            circle
            size="large"
          >
            <el-badge :is-dot="LayoutStore.newChatId !== ''" :offset="[-2, 6]">
              <el-avatar>
                <el-icon><Bell /></el-icon>
              </el-avatar>
            </el-badge>
          </el-button>

          <router-link to="/layout/personalcenter">
            <el-button type="text" size="large" circle>
              <el-avatar
                :src="
                  userInfo.avatar ? getAvatarUrl(userInfo.avatar) : undefined
                "
              >
                <el-icon><User /></el-icon>
              </el-avatar>
            </el-button>
          </router-link>
        </div>
        <el-button type="primary" size="large" @click="handleToLogin"
          >退出登录</el-button
        >
      </div>
    </div>
    <!-- 退出登录对话框 -->
    <el-dialog
      v-model="logoutDialogVisible"
      title="确认退出"
      width="30%"
      center
    >
      <span style="display: block; text-align: center">是否要退出登录？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelLogout">取消</el-button>
          <el-button type="primary" @click="confirmLogout">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useLayoutStore } from '@/stores'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像
import { Bell, User } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
const LayoutStore = useLayoutStore()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const router = useRouter()
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

// 退出登录对话框状态
const logoutDialogVisible = ref(false)

// 打开退出登录对话框
const handleToLogin = () => {
  logoutDialogVisible.value = true
}

// 确认退出登录
const confirmLogout = async () => {
  await LayoutStore.saveMap() //先向后端保存数据
  userStore.clearUserInfo()
  LayoutStore.clearMap() //清除导图和对话数据
  router.push('/login')
  logoutDialogVisible.value = false
}

// 取消退出登录
const cancelLogout = () => {
  logoutDialogVisible.value = false
}
//新消息跳转对话框
const handleToMessage = async () => {
  if (router.currentRoute.value.path !== '/layout/handedit') {
    router.push('/layout/handedit')
  }
  if (LayoutStore.newChatId) {
    LayoutStore.currentChatId = LayoutStore.newChatId
    await nextTick()
    LayoutStore.isChatting = false
    await nextTick()
    LayoutStore.isChatting = true
    LayoutStore.newChatId = ''
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 115px;
  color: var(--el-text-color-regular);
}

.square {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: var(--el-color-primary);
  border-radius: 10px;
  margin: 0 52px 0 25px;
}

.box1 {
  display: flex;
  align-items: center;
}

h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  letter-spacing: 2px;
  padding: 0px 20px;
}

.box2 {
  display: flex;
  align-items: center;
  gap: 70%;
  margin-right: 13.5%;
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 70%;
}

/* 针对带图标的头像设置样式 */
.icon-container :deep(.el-avatar:not([src])) {
  background-color: var(--el-color-primary);
}

.icon-container :deep(.el-avatar .el-icon) {
  color: white;
  font-size: 23px;
}

.icon-container :deep(.el-button--text) {
  transition: all var(--el-transition-duration-fast);
}

.notification-btn :deep(.el-badge__content.is-dot) {
  top: 1px;
  right: 4px;
}
</style>
