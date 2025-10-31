//接口请求和返回数据的类型定义
//验证码
export interface code {
  account: string
  account_type: string
  purpose: string
}
//忘记密码
export interface forgetpwd {
  confirm_password: string
  new_password: string
  account: string
  account_type: string
  code: string
}
//注册
export interface registerData {
  user_name: string
  password: string
  account: string
  code: string
  account_type: string
}
