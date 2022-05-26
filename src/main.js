import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element-plus ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'

createApp(App).use(ElementPlus, { locale: zhCn }).use(store).use(router).mount('#app')
