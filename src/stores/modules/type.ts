//定义仓库所需数据类型
// 定义消息类型接口
export interface Message {
  content: string
  role: string
  timestamp: string
}

// 定义对话类型接口
export interface Chat {
  title: string //本次对话标题
  conversation_id: string //本次对话唯一标识id
  messages: Message[]
}
