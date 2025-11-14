//用户基本信息仓库
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore(
  'user',
  () => {
    // 存储用户信息
    const userInfoJson = ref('')
    // 单独存储token（方便直接获取）
    const token = ref('')

    const userInfo = computed(() => {
      try {
        return JSON.parse(
          userInfoJson.value || window.localStorage.getItem('UserInfo') || '{}'
        )
      } catch (err) {
        ElMessage.error('用户的JSON字符串格式错误，转换对象时失败...')
        window.localStorage.setItem('UserInfo', '')
        throw err
      }
    })

    // 动作：登录成功后存储用户信息（仓库自动持久化）
    const setUserInfo = (data: any) => {
      if (data) {
        userInfoJson.value = JSON.stringify(data)
        window.localStorage.setItem('UserInfo', userInfoJson.value)
      }
    }

    const getToken = computed(() => {
      return token.value || window.localStorage.getItem('TokenInfo') || ''
    })

    const saveToken = (data: string) => {
      token.value = data
      window.localStorage.setItem('TokenInfo', data)
    }

    // 动作：用于个人中心修改用户名：
    const updateUsername = (newUsername: string) => {
      if (userInfo.value) {
        userInfo.value.user_name = newUsername
      }
    }

    // 动作：退出登录时清除信息
    const clearUserInfo = () => {
      userInfoJson.value = ''
      token.value = ''
      window.localStorage.setItem('UserInfo', '')
      window.localStorage.setItem('TokenInfo', '')
    }

    return {
      userInfo,
      getToken,
      setUserInfo,
      updateUsername,
      clearUserInfo,
      saveToken
    }
  },
  {
    // 仓库自动持久化配置（无需手动写localStorage，由插件处理）
    persist: true
  }
)
