//用于放置接口
import request from '@/utils/request'
import type {
  LoginParams,
  forgetpwd,
  code,
  ApiResponse,
  LoginSuccessData
} from './type'
import type { MindMapOptions } from '@/utils/type'
import type { registerData } from './type'

// 登录接口
export const Login = (
  data: LoginParams
): Promise<ApiResponse<LoginSuccessData>> =>
  request.post('/api/biz/v1/user/login', data)

//注册
export const Register = (data: registerData) =>
  request.post('/api/biz/v1/user/register', data)
//忘记密码
export const Forgetpwd = (data: forgetpwd) =>
  request.post('/api/biz/v1/user/reset_password', data)
//发送验证码
export const Getcode = (data: code) =>
  request.post('/api/biz/v1/user/send_code', data)
//更新思维导图
export const UpdateMap = (data: MindMapOptions) =>
  request.put(`/api/biz/v1/mindmap/${data.mapId}`, data)
