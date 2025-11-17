//用于放置接口
import request from '@/utils/request'
import type { loginData, forgetpwd, code } from './type'
import type {
  MindMapOptions,
  MindMapResponse,
  CreateMindMapParams
} from '@/utils/type'
import type { registerData } from './type'

// 登录接口
export const Login = (data: loginData) =>
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

// 更改头像
export const ChangeAvatar = (formdata: FormData) => {
  return request.post('/api/biz/v1/user/avatar', formdata)
}

//更新思维导图
export const UpdateMap = (data: MindMapOptions) =>
  request.put(`/api/biz/v1/mindmap/${data.mapId}`, data)
//新建对话
export const NewChat = (data: MindMapOptions, title: string) =>
  request.post('/api/biz/v1/aichat/save_conversation', {
    title,
    map_id: data.mapId,
    map_data: JSON.stringify(data)
  })
//获取该导图所有会话
export const GetMapChatList = (map_id: string) =>
  request.get('/api/biz/v1/aichat/get_conversation_list', {
    params: {
      map_id
    }
  })
//获取某会话的聊天记录
export const GetChat = (conversation_id: string) =>
  request.get('/api/biz/v1/aichat/get_conversation', {
    params: {
      conversation_id
    }
  })
//基础ai对话
export const SendMessage = (
  conversation_id: string,
  content: string,
  map_data: MindMapOptions
) =>
  request.post('/api/biz/v1/aichat/send_message', {
    conversation_id,
    content,
    map_data: JSON.stringify(map_data)
  })
//删除会话
export const DelChat = (conversation_id: string) =>
  request.post('/api/biz/v1/aichat/del_conversation', {
    conversation_id
  })
//更改某会话的标题
export const UpdateTitle = (conversation_id: string, title: string) =>
  request.post('/api/biz/v1/aichat/update_conversation_title', {
    conversation_id,
    title
  })

// 生成思维导图
export const generateMindMap = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/api/biz/v1/aichat/generate_mind_map', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 创建正式思维导图
export const createMindMap = async (data: CreateMindMapParams) => {
  const response = await request.post('api/biz/v1/mindmap', data, {
    headers: { 'Current-Type': 'application/json' }
  })
  return response.data
}

// 获取思维导图列表
export const getMindMapList = (params?: {
  page?: number
  pageP_size?: number
  keyword?: string
  layout?: string
  sort?: string
}) => {
  return request.get<MindMapResponse>('/api/biz/v1/mindmap/list', { params })
}

// 个人中心
export const getHome = () => {
  return request.get('/api/biz/v1/user/home')
}
