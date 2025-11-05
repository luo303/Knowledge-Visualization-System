//思维导图的ts类型
export interface MindMapNode {
  text?: string //避免chidren:[]
  uid?: string
  children?: MindMapNode[]
}

//后端返回思维导图的类型
export interface MindMapOptions {
  mapId: string
  userId: string
  title: string
  desc: string
  layout: string
  root: {
    data: MindMapNode
    children?: MindMapNode[]
  }
  [key: string]: any
}
export interface Mind<T = any> {
  el: HTMLElement
  opt: MindMapOptions
  T?: T
}
