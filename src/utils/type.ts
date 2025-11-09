//思维导图的ts类型

//思维导图节点类型
interface MindMapNode {
  data: {
    text: string // 节点文本内容
    uid?: string
    expand?: string
    isActive?: string
  }
  children?: MindMapNode[] // 子节点列表，递归引用自身
  smmVersion?: string
}

//思维导图完整数据接口
export interface MindMapOptions {
  mapId: string // 导图唯一标识
  userId: string // 所属用户 ID
  title: string // 导图标题
  desc: string // 导图描述
  layout: string // 布局类型（可扩展其他布局值）
  root: MindMapNode // 根节点，包含整个导图的节点结构
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

// 个人主页类型接口
export interface UserInfo {
  username: string // 用户名
  avatar: string // 头像
  phone: string
  email: string
  passwordSet: boolean // 是否设置过密码
  phoneBound: boolean // 是否绑定过手机
  emailBound: boolean // 是否绑定过邮箱
}
