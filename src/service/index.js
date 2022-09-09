import { LoadingPlugin } from 'tdesign-vue-next';
import { throttle } from 'lodash';
import storage from '../utils/storage';
import Http from './http';
import router from '@/router';
import Loading from '../utils/loading';

const loginExpired = throttle((error) => {
  storage.localStorage.removeItem('MUSIC-TOKEN');
  router.push('/login');
  throw new Error(error.msg);
}, 2000);

const ajax = new Http(`${import.meta.env.VITE_API_BASEURL}`, {
  tokenName: 'MUSIC-TOKEN',
  paramExclude: ['current'],
  onBefore(config) {
    config.headers['x-client-channel'] = 'pc'; // 自定义头部信息 --> 登录设备为pc端
    // 设置token
    const token = storage.localStorage.getItem('MUSIC-TOKEN'); // 拿到token值
    if (token) config.headers[token.tokenName] = token.tokenValue;
  },
  onLoading(options) {
    return Loading(options, 3000);
  },
  onError(error) {
    LoadingPlugin('error', { title: '错误', content: error.message, closeBtn: true });
  },
});

ajax.addResponseHandle(401, loginExpired);

export default ajax;
