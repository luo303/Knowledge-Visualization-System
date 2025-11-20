//用于放置接口
import request from '@/utils/request'
import type { loginData, forgetpwd, code, changecontact } from './type'
import type { MindMapOptions, CreateMindMapParams } from '@/utils/type'
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
//发送验重置密码证码
export const Getcode = (data: code) =>
  request.post('/api/biz/v1/user/send_code', data)
//发送换绑或绑定验证码
export const GetForChangecode = (data: code) =>
  request.post('/api/biz/v1/user/send_code_for_change', data)
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
    headers: { 'Content-Type': 'application/json' }
  })
  return response
}

// 获取思维导图列表
export const getMindMapList = () => {
  return request.get('/api/biz/v1/mindmap/list')
}

// 查询 map
export const getMap = (mapId: string) => {
  return request.get(`/api/biz/v1/mindmap/${mapId}`)
}

// 删除 map
export const delMap = (mapIds: string[]) => {
  return request.post('/api/biz/v1/mindmap/batch_delete', {
    mapIds: mapIds
  })
}

// 个人中心
export const getHome = () => {
  return request.get('/api/biz/v1/user/home')
}
//绑定或换绑
export const ChangeContact = (data: changecontact) => {
  return request.post('/api/biz/v1/user/account', data)
}
export const ChangeName = (user_name: string) => {
  return request.post('/api/biz/v1/user/username', { user_name })
}
//AI对话框tab键补全
export const TabComplete = (
  conversation_id: string,
  user_input: string,
  map_data: MindMapOptions
) => {
  return request.post('/api/biz/v1/aichat/tab_complete', {
    params: {
      conversation_id,
      user_input,
      map_data: JSON.stringify(map_data)
    }
  })
}
