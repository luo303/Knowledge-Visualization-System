//用于放置接口
import request from '@/utils/request'

import type { registerData, code } from './type'

//注册
export const Register = (data: registerData) =>
  request.post(' /api/biz/v1/user/register', data)
//发送验证码
export const Getcode = (data: code) =>
  request.post('/api/biz/v1/user/send_code', data)
