//接口请求和返回数据的类型定义
// 用户信息

// 登录
export interface loginData {
  account: string
  password: string
  account_type: string
}

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

// 生成导图
export interface GenerateMindMapResponse {
  Code: number
  Message: string
  Data: {
    success: boolean
    map_json: string
  }
}

// 生成导图的响应数据类型
export interface GenerateMindMapData {
  success: boolean
  map_json: string // 导图的 json 数据
}
