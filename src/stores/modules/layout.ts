//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Chat } from '@/stores/modules/type'
export const useLayoutStore = defineStore(
  'layout',
  () => {
    //控制导航栏折叠
    const isCollapse = ref(false)
    //导图树的数据
    const data = ref()
    //AI对话所有聊天数据
    const chat = ref<Chat[]>([])
    return {
      isCollapse,
      data,
      chat
    }
  },
  {
    persist: {
      key: 'Layout'
    }
  }
)
