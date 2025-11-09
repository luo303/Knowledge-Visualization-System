//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Chat } from '@/stores/modules/type'
import type { MindMapOptions } from '@/utils/type'
export const useLayoutStore = defineStore(
  'layout',
  () => {
    //控制导航栏折叠
    const isCollapse = ref(false)
    //导图树的数据
    const data = ref<MindMapOptions>({
      mapId: '123456',
      userId: '465161',
      title: '导图标题',
      desc: '导图描述',
      layout: 'tree',
      root: {
        data: {
          text: '根节点'
        },
        children: [
          {
            data: {
              text: '二级节点'
            },
            children: []
          }
        ]
      },
      createdAt: '2025-11-09T11:01:23+08:00',
      updatedAt: '2025-11-09T11:01:33+08:00'
    })
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
