//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
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
    //AI对话所有聊天数据(不包括聊天信息)
    const chatlist = ref<ChatList[]>([])
    //聊天信息
    const chat = ref<Chat[]>([])
    //当前会话id
    const currentChatId = ref('')
    //当前对话信息
    const currentChat = ref<Chat>({
      title: '',
      conversation_id: '',
      messages: []
    })
    watch(
      () => currentChatId.value,
      newId => {
        if (newId) {
          const temp = chat.value.find(item => item.conversation_id === newId)
          if (temp) {
            currentChat.value = temp
          } else {
            currentChat.value = {
              title: '',
              conversation_id: '',
              messages: []
            }
          }
        }
      }
    )
    return {
      isCollapse,
      data,
      chat,
      chatlist,
      currentChat,
      currentChatId
    }
  },
  {
    persist: {
      key: 'Layout'
    }
  }
)
