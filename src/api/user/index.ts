//用于放置接口
import request from '@/utils/request'

import type { forgetpwd, code, registerData } from './type'

//注册
export const Register = (data: registerData) =>
  request.post(' /api/biz/v1/user/register', data)
//忘记密码
export const Forgetpwd = (data: forgetpwd) =>
  request.post('/api/biz/v1/user/reset_password', data)
//发送验证码
export const Getcode = (data: code) =>
  request.post('/api/biz/v1/user/send_code', data)
