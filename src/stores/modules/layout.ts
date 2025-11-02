//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore(
  'layout',
  () => {
    //控制导航栏折叠
    const isCollapse = ref(false)
    //导图树的数据
    const data = ref()
    return {
      isCollapse,
      data
    }
  },
  {
    persist: {
      key: 'Map'
    }
  }
)
