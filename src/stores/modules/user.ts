//用户基本信息仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态：用户信息（初始值从仓库自动持久化中读取，无需手动操作localStorage）
    const userInfo = ref<any | null>(null)
    // 单独存储token（方便直接获取）
    const token = ref<string>('')

    // 动作：登录成功后存储用户信息（仓库自动持久化）
    const setUserInfo = (data: any) => {
      userInfo.value = data
      token.value = data.token || ''
    }

    // 动作：用于个人中心修改用户名：
    const updateUsername = (newUsername: string) => {
      if (userInfo.value) {
        userInfo.value.user_name = newUsername
      }
    }

    // 动作：退出登录时清除信息
    const clearUserInfo = () => {
      userInfo.value = null
      token.value = ''
    }

    return {
      userInfo,
      token,
      setUserInfo,
      updateUsername,
      clearUserInfo
    }
  },
  {
    // 仓库自动持久化配置（无需手动写localStorage，由插件处理）
    persist: true
  }
)
