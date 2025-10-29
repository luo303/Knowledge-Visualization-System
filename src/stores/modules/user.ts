//用户基本信息仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')

    return {
      token
    }
  },
  {
    persist: {
      key: 'UserInfo'
    }
  }
)
