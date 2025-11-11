import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import router from '@/router'
//创建axios实例
const baseURL = 'http://10.62.178.176:8080' //等后续接口
const request = axios.create({
  baseURL,
  timeout: 5000
})
//请求拦截器
request.interceptors.request.use((config: any) => {
  const userstore = useUserStore()
  if (userstore.token) {
    config.headers.Authorization = userstore.token
  }
  return config
})
//响应拦截器
request.interceptors.response.use(
  (response: any) => {
    return response.data
  },
  (error: any) => {
    //处理网络错误或跨域报错
    if (!error.response) {
      const networkError = new Error('网络错误，请检查网络连接或跨域配置')
      ;(networkError as any).isNetworkError = true
      return Promise.reject(networkError)
    } else {
      let msg = ''
      const status = error.response.status
      switch (status) {
        case -2:
          msg = 'token过期'
          break
        default:
          msg = '无网络'
      }
      ElMessage({
        type: 'error',
        message: msg
      })
      router.push('/login')
      return Promise.reject(error)
    }
  }
)
export default request
export { baseURL }
