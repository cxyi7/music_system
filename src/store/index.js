import { createPinia } from 'pinia'; // 状态管理库
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 使用插件，使数据持久化
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
