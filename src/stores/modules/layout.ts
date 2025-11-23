//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ChatList, Chat } from '@/stores/modules/type'
import type { MindMapOptions } from '@/utils/type'
import { UpdateMap } from '@/api/user'
import { ElMessage } from 'element-plus'
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
    //接收对话返回的思维导图
    const aidata = ref<MindMapOptions>({
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
    //新信息的会话Id(用于新消息跳转)
    const newChatId = ref('')
    //当前对话信息
    const currentChat = ref<Chat>({
      title: '',
      conversation_id: '',
      messages: []
    })
    //是否需要调用接口获取会话历史记录
    const needget = ref(false)
    //是否正在与AI对话
    const isChatting = ref(false)

    //后端保存导图数据
    const saveMap = async () => {
      if (data.value.mapId) {
        try {
          const res = await UpdateMap(data.value)
          if ((res as any).Code === 200) {
          } else {
            const message = (res as any).Message
            ElMessage.error(`${message}`)
          }
        } catch (error) {
          ElMessage.error('保存导图失败')
          console.log(error)
        }
      }
    }
    //退出登录清除数据
    const clearMap = () => {
      data.value = {
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
      }
      aidata.value = {
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
      }
      chatlist.value = []
      chat.value = []
      currentChatId.value = ''
      currentChat.value = { title: '', conversation_id: '', messages: [] }
      needget.value = false
    }
    watch(
      () => currentChatId.value,
      async newId => {
        if (newId) {
          const temp = chat.value.find(item => item.conversation_id === newId)
          if (temp) {
            currentChat.value = temp
          } else {
            //如果没有缓存就调用接口获取，然后缓存
            needget.value = true //控制调用接口获取
          }
        }
      }
    )
    return {
      isCollapse,
      data,
      aidata,
      chat,
      chatlist,
      currentChat,
      currentChatId,
      newChatId,
      needget,
      isChatting,
      clearMap,
      saveMap
    }
  },
  {
    persist: {
      key: 'Layout'
    }
  }
)
