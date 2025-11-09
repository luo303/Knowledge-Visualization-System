import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/styles/index.scss'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Markdown from 'vue3-markdown-it'

import MindMap from 'simple-mind-map'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Search from 'simple-mind-map/src/plugins/Search.js'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Export from 'simple-mind-map/src/plugins/Export.js'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
// @ts-expect-error 忽略 simple-mind-map 无类型声明的报错
import Drag from 'simple-mind-map/src/plugins/Drag.js'

MindMap.usePlugin(Drag)
MindMap.usePlugin(Export)
MindMap.usePlugin(ExportPDF)
MindMap.usePlugin(ExportXMind)
MindMap.usePlugin(Search)
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(store)

app.use(Markdown)
app.mount('#app')
