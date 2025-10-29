import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const store = createPinia().use(persist)

export default store
//下面集中导出仓库，方便管理
export * from '@/stores/modules/user'
