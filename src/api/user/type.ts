//接口请求和返回数据的类型定义
//忘记密码
export interface code {
  account: string
  account_type: string
  purpose: string
}
//注册
export interface registerData {
  user_name: string
  password: string
  account: string
  code: string
  account_type: string
}
