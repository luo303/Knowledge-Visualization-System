<template>
  <div>
    <div class="header">
      <div class="box1">
        <h1><span class="square"></span>知识可视化系统</h1>
      </div>
      <div class="box2">
        <nav>
          <div class="icon-container">
            <router-link active-class="active" to="/layout/hanedit"
              ><div class="avatar">
                <img
                  src="@/assets/images/notification.png"
                  class="notification-img"
                  alt="通知"
                />
                <span
                  class="notification-badge"
                  v-if="hasNewAiMessage"
                ></span></div
            ></router-link>
            <router-link active-class="active" to="/layout/personalcenter">
              <div class="avatar">
                <img
                  :src="getAvatarUrl(userInfo.avatar)"
                  class="avatar-img"
                  alt="个人"
                />
              </div>
            </router-link>
          </div>
        </nav>
        <nav>
          <div class="logout" active-class="active" @click="handleToLogin">
            <el-button type="primary" class="logout-text">退出登录</el-button>
          </div>
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
.logout {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.logout-text {
  height: 45px;
  font-size: 20px;
  border-radius: 10px;
}

.logout-text:hover {
  box-shadow: 0 2px 1px rgb(175, 173, 173);
  transform: translateY(-2px);
}
.avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgb(134, 133, 133);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: #fff;
    box-shadow: 0 2px 1px rgb(115, 114, 114);
    transform: translateY(-2px);
  }

  .notification-img {
    width: 70%;
    height: 70%;
    object-fit: cover;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
