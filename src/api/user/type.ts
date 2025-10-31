//接口请求和返回数据的类型定义
// src/api/user/types.ts

export interface registerData {
  account: string // 手机号或邮箱
  password: string
  email?: string // 邮箱（可选）
  confirmPassword?: string // 确认密码（可选）
}

export interface loginData {
  account: string
  password: string
}
