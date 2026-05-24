import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'
import 'element-plus/dist/index.css'

import '@/styles/index.scss'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
