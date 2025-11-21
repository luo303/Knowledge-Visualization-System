<template>
  <div>
    <div class="header">
      <div class="box1">
        <h1><span class="square"></span>知识可视化系统</h1>
      </div>
      <div class="box2">
        <nav>
          <div class="icon-container">
            <router-link active-class="active" to="/layout/handedit"
              ><div class="notification">
                <el-avatar
                  ><el-icon><Bell /></el-icon
                ></el-avatar>
                <span
                  class="notification-badge"
                  v-if="hasNewAiMessage"
                ></span></div
            ></router-link>

            <router-link active-class="active" to="/layout/personalcenter"
              ><div>
                <el-avatar :src="getAvatarUrl(userInfo.avatar)"
                  ><el-icon><User /></el-icon
                ></el-avatar></div
            ></router-link>
          </div>
        </nav>
        <nav>
          <el-button
            type="primary"
            size="large"
            @click="handleToLogin"
            :style="{ borderRadius: '20px' }"
            >退出登录</el-button
          >
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useLayoutStore } from '@/stores'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像
import { Bell, User } from '@element-plus/icons-vue'
const LayoutStore = useLayoutStore()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const router = useRouter()
const hasNewAiMessage = ref(false)
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

const handleToLogin = () => {
  ElMessageBox.confirm('是否要退出登录？', '确认退出', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await LayoutStore.saveMap() //先向后端保存数据
    userStore.clearUserInfo()
    LayoutStore.clearMap() //清除导图和对话数据
    router.push('/login')
  })
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 115px;
  color: rgb(115, 114, 114);
}

.title {
  font-size: 28px;
}

.square {
  display: inline-block;
  width: 30px; /* 正方形大小 */
  height: 30px;
  background: #608bd2;
  border-radius: 30%;
  margin-right: 8px; /* 与文字的间距 */
}

.box1 {
  display: flex;
  align-items: center;
}
h1 {
  margin-left: 10px;
  display: flex;
  align-items: center;
  font:
    normal 28px Cookie,
    Arial,
    Helvetica,
    sans-serif;
  padding: 0px 20px;
}

.box2 {
  display: flex;
  margin-right: 2%;
}

// 图标容器
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -4px;

  width: 12px;
  height: 12px;
  border-radius: 50%;

  background-color: #ff4d4f;

  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}

nav {
  display: flex;
  align-items: center;
  margin: 0px 50px;
  font:
    16px Arial,
    Helvetica,
    sans-serif;
}
nav a {
  padding: 0 15px;
  width: 32px;
  text-decoration: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: normal;
  opacity: 0.9;
}

nav a:hover {
  opacity: 1;
}

.active {
  color: #608bd2;
  pointer-events: none;
  opacity: 1;
}

.contents {
  display: flex;
  justify-content: center;
}
.content {
  display: flex;
  width: 1400px;
  height: 1400px;
  /*background-color: #f0f2f3;*/
}

.icon-container {
  :deep(.el-avatar) {
    background-color: transparent;
    border: solid 1px black;

    .el-icon {
      color: black;
      font-size: 25px;
    }
  }
}
</style>
