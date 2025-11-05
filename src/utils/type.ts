//思维导图的ts类型

//思维导图节点类型
interface MindMapNode {
  data: {
    text: string // 节点文本内容
    uid?: string
  }
  children?: MindMapNode[] // 子节点列表，递归引用自身
}

//思维导图完整数据接口
export interface MindMapOptions {
  mapId: string // 导图唯一标识
  userId: string // 所属用户 ID
  title: string // 导图标题
  desc: string // 导图描述
  layout: string // 布局类型（可扩展其他布局值）
  root: MindMapNode // 根节点，包含整个导图的节点结构
  [key: string]: any
}
