// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UserInfo } from '@/utils/type'

export const useUserStore = defineStore(
  'user',
  () => {
    // 1. 存储用户信息
    const userInfo = ref<UserInfo>({} as UserInfo)

    // 2. 单独存储 token
    const token = ref('')

    // 动作：初始化用户信息（在应用启动时调用）
    const initUserInfo = () => {
      try {
        const storedUserInfo = localStorage.getItem('user-userInfo') // pinia-plugin-persist 默认的存储键是 "storeId-key"
        const storedToken = localStorage.getItem('user-token')

        if (storedUserInfo) {
          userInfo.value = JSON.parse(storedUserInfo)
        }
        if (storedToken) {
          token.value = storedToken
        }
      } catch (err) {
        ElMessage.error('解析用户信息失败，请重新登录。')
        console.error(err)
        // 清除错误的存储
        localStorage.removeItem('user-userInfo')
        localStorage.removeItem('user-token')
      }
    }

    // 动作：登录成功后设置用户信息
    const setUserInfo = (data: UserInfo) => {
      userInfo.value = { ...userInfo.value, ...data } // 合并数据
    }

    const saveToken = (data: string) => {
      token.value = data
    }

    // 动作：修改用户名
    const updateUsername = (newUsername: string) => {
      userInfo.value.username = newUsername
    }

    // 动作：修改头像
    const updateAvatar = (newAvatarUrl: string) => {
      // 现在直接修改响应式对象的属性，会触发所有依赖它的组件重新渲染
      userInfo.value.avatar_url = newAvatarUrl
    }

    // 动作：退出登录
    const clearUserInfo = () => {
      userInfo.value = {} as UserInfo // 重置为初始状态
      token.value = ''
    }

    return {
      userInfo,
      token,
      initUserInfo,
      setUserInfo,
      saveToken,
      updateUsername,
      updateAvatar,
      clearUserInfo
    }
  },
  {
    persist: true // 启用持久化
  }
)
