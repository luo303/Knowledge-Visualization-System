import request from '@/utils/request'

// 用户登录-参数类型
type LoginInfo = {
  acount: ''
  account_type: 'email' | 'phone'
  password: ''
}

// 用户登录-返回类型
type LoginResult = {
  code: ''
  message: ''
  data: {
    token: ''
    user_id: ''
    user_name: ''
    email: ''
    success: boolean
  }
}

// 用户请求登录
export const login = (loginInfo: LoginInfo) => {
  return request<LoginResult>({
    url: '/api/biz/v1/user/login',
    method: 'post',
    headers: {
      'Content-Type': 'aoolication.json'
    },
    data: loginInfo
  })
}
