//接口请求和返回数据的类型定义
// 登录
// 登录请求参数类型（账号、密码、账号类型）
export interface LoginParams {
  account: string // 手机号或邮箱（与后端参数一致）
  password: string // 登录密码
  account_type: 'phone' | 'email' // 账号类型：如 'phone' 或 'email'（后端定义的枚举值）
}

// 登录接口的通用响应类型（所有接口通用，根据后端返回格式调整）
export interface ApiResponse<T = any> {
  Code: number // 状态码：200成功，其他为错误（如2004密码错误）
  Message: string // 提示信息：如"登录成功"、"密码错误"
  Data: T // 成功时返回的数据（登录成功时为token等信息）
  success?: boolean // 可选：是否成功的标识
}

// 登录成功时Data的类型（根据后端返回的用户信息定义）
export interface LoginSuccessData {
  token: string // 用户身份令牌（必选，用于后续接口授权）
  user_id: string | number // 用户ID
  user_name: string // 用户名
  account?: string // 登录账号（手机号/邮箱）
}

// 用户信息

//验证码
export interface code {
  account: string
  account_type: string
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
