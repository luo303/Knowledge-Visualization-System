import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  const tempId = ref('')
  //是否AI正在思考中
  const isloading = ref(false)
  return {
    tempId,
    isloading
  }
})
