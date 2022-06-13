import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import '@/assets/scss/index.scss'
// 引入icon
import '@/assets/icons'
// 引入element-plus ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 全局注册SVGICON组件
import SvgIcon from '@/components/SvgIcon'

createApp(App)
  .component('svg-icon', SvgIcon)
  .use(ElementPlus, { locale: zhCn })
  .use(store)
  .use(router)
  .mount('#app')
