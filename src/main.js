import { createApp } from 'vue';
import App from './App.vue';

import '@/assets/less/index.less';
import 'virtual:windi.css';
import 'virtual:windi-devtools';
import 'virtual:svg-icons-register'; // 导入雪碧图

createApp(App).mount('#app');
