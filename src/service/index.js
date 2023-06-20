import { NotifyPlugin } from 'tdesign-vue-next';
import { throttle } from 'lodash';
import storage from '../utils/storage';
import Http from './http.js';
import router from '@/router';
import Loading from '../utils/loading';

const loginExpired = throttle((error) => {
  storage.localStorage.removeItem('MUSIC-TOKEN');
  router.push('/login');
  throw new Error(error.msg);
}, 2000);

const ajax = new Http(`${import.meta.env.VITE_API_BASEURL}`, {
  tokenName: 'MUSIC-TOKEN',
  parmasExclude: ['current'],
  onBefore(config) {
    // 设置登陆设备类型
    config.headers['x-client-channel'] = 'pc';
    config.headers['Cache-Control'] = 'no-cache';
    // config.headers['x-system-code'] = import.meta.env.VITE_SYSTEM_CODE;
    // 设置token

    const token = storage.localStorage.getItem('MUSIC-TOKEN');
    if (token) config.headers.Authorization = token.tokenValue;
  },
  onLoading(options) {
    return Loading(options, 200);
  },
  onError(error) {
    NotifyPlugin('error', { title: '错误', content: error.message, closeBtn: true });
  },
});
ajax.addResponseHandle(401, loginExpired);
ajax.addResponseHandle(500, (error) => {
  throw new Error(error.msg);
});

export default ajax;
