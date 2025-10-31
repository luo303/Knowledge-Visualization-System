//用于放置接口
import request from '@/utils/request'

import type { registerData } from './type'

// 登录接口
export const Login = (data: any) => request.post('/api/biz/v1/user/login', data)

// 注册接口
export const Register = (data: registerData) =>
  request.post('/api/biz/v1/user/register', data)
