import request from '@/utils/request'

// 用户登录-参数类型
type LoginInfo = {
  acount: ''
  email: ''
  phone: ''
  password: ''
}

// 用户登录-返回类型
type LoginResult = {
  token: ''
  userInfo: {
    id: number
    name: ''
    email: ''
    phone: ''
    role: ''
  }
  success: boolean
  state: ''
  content: ''
}

// 用户请求登录
export const login = (loginInfo: LoginInfo) => {
  return request<LoginResult>({
    url: '/user/login', //后端API完整路径
    method: 'post',
    data: `phone=${loginInfo.acount}&password=${loginInfo.password}`
  })
}
