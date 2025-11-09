//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatList, Chat } from '@/stores/modules/type'
import type { MindMapOptions } from '@/utils/type'
export const useLayoutStore = defineStore(
  'layout',
  () => {
    //控制导航栏折叠
    const isCollapse = ref(false)
    //导图树的数据
    const data = ref<MindMapOptions>({
      mapId: '',
      userId: '',
      title: '',
      desc: '',
      layout: '',
      root: {
        data: {
          text: ''
        },
        children: [
          {
            data: {
              text: ''
            },
            children: []
          }
        ]
      },
      createdAt: '',
      updatedAt: ''
    })
    //AI对话所有聊天数据
    const chatlist = ref<ChatList[]>([])
    const chat = ref<Chat[]>([])
    return {
      isCollapse,
      data,
      chat,
      chatlist
    }
  },
  {
    persist: {
      key: 'Layout'
    }
  }
)
