//思维导图的ts类型
export interface MindMapNode {
  text: string
  uid?: string
  children?: MindMapNode[]
}

export interface MindMapOptions {
  data: {
    data: MindMapNode
    children?: MindMapNode[]
  }
  layout?: string
}
export interface Mind<T = any> {
  el: HTMLElement
  opt: MindMapOptions
  T?: T
}
