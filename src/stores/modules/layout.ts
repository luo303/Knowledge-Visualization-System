//用户信息之外的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  //控制导航栏折叠
  const isCollapse = ref(false)

  return {
    isCollapse
  }
})
