import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import pinia from '@/store';
import App from './App.vue';

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';
import '@/assets/less/index.less';
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import 'virtual:svg-icons-register'; // 导入雪碧图

const app = createApp(App);

app.use(pinia);
app.use(TDesign);

app.mount('#app');
