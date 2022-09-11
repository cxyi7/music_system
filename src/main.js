import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import pinia from '@/store';
import router from './router';
import App from './App.vue';

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/less/index.less';
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import 'virtual:svg-icons-register'; // 导入雪碧图

const app = createApp(App);

// pinia 必须在 router 之前
app.use(pinia);
app.use(router);
app.use(TDesign);

app.mount('#app');
