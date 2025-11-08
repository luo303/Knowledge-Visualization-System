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
            <button class="edit-avatar-btn" @click="handleEditAvatar">
              修改头像
            </button>
          </div>

          <!-- 用户名 -->
          <div class="username-wrapper">
            <span class="label">用户名:</span>
            <span class="username">{{ userInfo.username }}</span>
            <button class="edit-btn" @click="handleEditUsername">
              <el-icon><Edit /></el-icon>修改用户名
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import type { UserInfo } from '../utils/type'
import { ref } from 'vue'
import defaultAvatar from '@/assets/images/personal.png' // 默认头像

// 模拟用户数据:
const userInfo = ref<UserInfo>({
  username: 'piaodaqiang',
  avatar: defaultAvatar,
  phone: '12345678901',
  email: 'piaodaqiang@163.com',
  passwordSet: true,
  phoneBound: true,
  emailBound: true
})

// 事件处理函数：
const handleEditAvatar = () => {
  console.log('修改头像')
}

const handleEditUsername = () => {
  console.log('修改用户名')
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
  border-bottom: 1px solid black;
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
</style>
