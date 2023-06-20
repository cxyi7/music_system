import Qs from 'qs';
import axios from 'axios';
import { isObject, isArray, isString, isFunction, mergeWith, merge } from 'lodash';
import storage from '../utils/storage';
// import { downLoadFile } from '../exportFile';
// import Polling from '../polling';

const responseMap = new Map(); // 返回结果缓存池
const pendingRequest = new Map(); // 请求池
const responseHandle = new Map(); // res处理池：根据返回数据code使用不同的处理方法
const loadingList = []; // loading池
export default class Ajax {
  /**
   * @param { String } baseURL        基础请求地址
   * @param { Object } options        全局配置，可以被局部覆盖
   */
  constructor(baseURL = '', options = {}) {
    // 全局的api url
    this.baseURL = baseURL;
    // ajax全局配置
    this.defaultOptions = {
      timeout: 20000, // 超时时间
      withCredentials: true, // 跨域
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }, // 默认json格式
      parmasExclude: ['page'], // 防重复请求排除字段, /xxx/pageList?page=1和/xxx/pageList?page=2会排除page参数所以相当于同一个请求
      onError: this.onError, // 默认错误处理，默认只是在控制台打印错误
      onBefore: this.onBefore, // 默认发送请求之前处理方法
      onAfter: this.onAfter, // 默认的发送请求之后处理方法
      onLoading: this.onLoading, // loading方法,返回loading的实例【必须包含start和close方法,否则loading将无法启用/关闭】
      // onDownloadFile: downLoadFile, // 默认的文件下载方法
      tokenName: 'token', // 拼接下载地址时拼接的名字
      getToken: this.getToken, // 获取token
    };
    if (!isObject(options)) {
      throw new Error('new Http 参数 options 期望是一个 Object!!!');
    }

    // 合并options
    mergeWith(this.defaultOptions, options, (objValue, srcValue) => {
      if (isArray(objValue)) return objValue.concat(srcValue);
      if (isString(objValue) || isFunction(objValue)) return srcValue;
      return merge(objValue, srcValue);
    });

    // 初始化axios实例
    this.init();
    // 添加默认的Response数据处理方法
    this.addResponseHandle(200, ({ data }) => data);
    this.addResponseHandle(403, () => {
      throw new Error('您没有权限访问~');
    });
    this.addResponseHandle(500, () => {
      throw new Error('服务器异常~');
    });
    this.addResponseHandle('default', ({ msg }) => {
      throw new Error(msg);
    });
  }

  // 初始化axios实例
  init() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.defaultOptions.timeout,
      withCredentials: this.defaultOptions.withCredentials,
      headers: this.defaultOptions.headers,
      paramsSerializer: (params) => Qs.stringify(params, { indices: false }), // get请求默认的格式化程序
      // qs.stringify({ids: [1, 2, 3]}, { indices: false })  返回：ids=1&ids=2&id=3
      // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘indices‘})  返回：ids[0]=1&aids1]=2&ids[2]=3
      // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘brackets‘})  返回：ds[]=1&ids[]=2&ids[]=3
      // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘repeat‘})  返回：ids=1&ids=2&id=3
    });
    // 全局axios请求拦截
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.defaultOptions.onBefore(config);
        this.addPendingRequest(config);
        return config;
      },
      (error) => {
        this.removePendingRequest(error.config); // 从pendingRequest对象中移除请求
        throw error;
      },
    );
    // 全局axios响应拦截
    this.axiosInstance.interceptors.response.use(
      (res) => {
        this.removePendingRequest(res.config); // 从pendingRequest对象中移除请求
        return res;
      },
      (error) => {
        this.removePendingRequest(error.config); // 从pendingRequest对象中移除请求
        throw error;
      },
    );
  }

  // 每个请求根据method、url、params、data生成Key
  // 用来取消重复请求,会过滤parmasExclude的字段
  generateReqKey(config) {
    const { method, url, params = {}, data } = config;
    // 如果请求中包含parmasExclude设置中的字段名称，则忽略该字段
    const parmasExclude = config.parmasExclude || this.defaultOptions.parmasExclude;
    const newData = typeof data === 'string' ? JSON.parse(data) : data;
    const newParams = parmasExclude.reduce(
      (a, key) => {
        delete a[key];
        return a;
      },
      { ...params },
    );
    // key由请求方式、url、参数组成一个key
    return [method, url, Qs.stringify(newParams), Qs.stringify(newData)].join('&');
  }

  // 将请求添加到请求池中
  addPendingRequest(config) {
    const requestKey = this.generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
      if (config.method === 'get') {
        // get请求, 若存在重复，则取消之前已发的请求
        const cancelToken = pendingRequest.get(requestKey);
        cancelToken(requestKey);
        pendingRequest.delete(requestKey);
        this.addPendingRequest(config);
      } else {
        // 允许重复提交
        if (!config.repeat) throw new Error('操作太频繁，请稍等片刻~');
        config.cancelToken =
          config.cancelToken ||
          new axios.CancelToken((cancel) => {
            if (!pendingRequest.has(requestKey)) {
              const cancelToken = pendingRequest.get(requestKey);
              if (Array.isArray(cancelToken)) {
                pendingRequest.set(requestKey, [...cancelToken, cancel]);
              } else {
                pendingRequest.set(requestKey, [cancelToken, cancel]);
              }
            }
          });
      }
    } else {
      config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
          if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, cancel);
          }
        });
    }
  }

  // 从请求池中删除请求
  removePendingRequest(config) {
    if (!config) return;
    const requestKey = this.generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
      pendingRequest.delete(requestKey);
    }
  }

  // 清空请求池,业务中可以通过在routerbefore中new Ajax().cleanPendingRequest()
  // 来加上路由切换取消所有请求的需求
  cleanPendingRequest() {
    if (!pendingRequest.size < 0) return;
    for (const [requestKey, cancel] of pendingRequest) {
      if (Array.isArray(cancel)) {
        cancel.forEach((cb) => cb(requestKey));
      } else {
        cancel(requestKey);
      }
      pendingRequest.delete(requestKey);
    }
  }

  // 增加response返回处理处理方法
  addResponseHandle(code, callback) {
    if (typeof callback !== 'function') {
      throw new Error('添加 response 处理方法错误： callback is not a function');
    }
    responseHandle.set(code, callback);
  }

  // 获取缓存数据
  getCache(config) {
    // 2、没取到返回null
    const requestKey = this.generateReqKey(config);
    const cacheData = JSON.parse(responseMap.get(requestKey) || null);
    if (!cacheData) return null;
    // 3、取到判断过期状态，如果过期清除缓存返回null，否则返回缓存数据
    if (cacheData.time < Date.now()) {
      responseMap.delete(requestKey);
      return null;
    }
    return cacheData.data;
  }

  // 设置缓存
  setCache(config, data, cacheTime) {
    if (cacheTime) {
      const requestKey = this.generateReqKey(config);
      responseMap.set(requestKey, JSON.stringify({ time: Date.now() + cacheTime, data }));
    }
  }

  // 开启loading
  startLoading(options) {
    if (!this.defaultOptions.onLoading) return;
    if (loadingList.length && !options) {
      loadingList[loadingList.length - 1].count++;
    } else {
      const instance = this.defaultOptions.onLoading(options);
      instance.start();
      loadingList.push({ count: 1, instance });
    }
  }

  // 关闭loading
  closeLoading() {
    if (!this.defaultOptions.onLoading || !loadingList.length) return;
    loadingList[0].count--;
    if (!loadingList[0].count) {
      loadingList[0].instance.close();
      loadingList.shift();
    }
  }

  // 获取token
  getToken() {
    return storage.localStorage.getItem('token');
  }

  // 默认的loading
  onLoading(option) {
    return {
      start: console.log(`开启loading，参数: ${option}`),
      close: console.log('关闭loading'),
    };
  }

  // 发起请求前设置headers
  onBefore(config) {
    console.log(config);
  }

  // 默认的请求响应处理方法(默认执行响应处理列表内的函数处理返回值，可以重写onAfter)
  onAfter(res) {
    const { code } = res;
    const callback = responseHandle.get(code) || responseHandle.get('default');
    return callback(res);
  }

  // 默认错误处理方法
  onError(error) {
    console.error(error.message);
  }

  // 处理HTTP异常
  httpErrorStatusHandle(error) {
    // 处理被取消的请求,取消请求不执行onError
    if (axios.isCancel(error)) {
      const [method, url] = error.message.split('&');
      console.error(`取消 ${method.toUpperCase()} 请求：${url}`);
      return;
    }
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！';
          break;
        case 400:
          message = '参数不正确！';
          break;
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！';
          break;
        case 403:
          message = '您没有权限操作！';
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = '请求超时！';
          break;
        case 409:
          message = '系统已存在相同数据！';
          break;
        case 500:
          message = '服务器内部错误！';
          break;
        case 501:
          message = '服务未实现！';
          break;
        case 502:
          message = '网关错误！';
          break;
        case 503:
          message = '服务不可用！';
          break;
        case 504:
          message = '服务暂时无法访问，请稍后再试！';
          break;
        case 505:
          message = 'HTTP版本不受支持！';
          break;
        default:
          message = '异常问题，请联系管理员！';
          break;
      }
    }
    if (error.message.includes('timeout')) message = '网络请求超时！';
    if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
    const e = message ? new Error(message) : error;
    this.defaultOptions.onError(e);
  }

  // 发起请求
  async request(config, options) {
    const cacheData = this.getCache(config);
    const onAfter = options.onAfter || this.defaultOptions.onAfter;
    // 有缓存直接取缓存，不需要loading，必须放在try/catch外面，否则会执行finally，导致关闭loading错误
    if (cacheData) return cacheData;
    try {
      // 无缓存的情况下调用接口，添加loading
      this.startLoading(options.loading);
      const res = await this.axiosInstance(config);
      // 此处用来测试接口延迟情况的loading
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 2000);
      // });
      // 是否直接返回整个返回值
      if (options.needHeaders) return res;
      // 对于第三方接口以及返回非标准格式 直接返回，不做处理
      if (options.thirdPartRequest) return res.data;
      // 特殊返回值格式直接返回，例如：文件下载返回的是 -> 文件流/URL地址
      if (!res.data || res.data instanceof ArrayBuffer || typeof res.data !== 'object') return res;
      // 返回onAfter执行的结果
      const result = onAfter(res.data);
      // 缓存数据
      this.setCache(res.config, result, options.cacheTime);
      return result;
    } catch (error) {
      this.httpErrorStatusHandle(error);
      return Promise.reject(error);
    } finally {
      this.closeLoading();
    }
  }

  // get请求，支持cache缓存、loading、重复请求提示
  get(url, params = {}, options = {}) {
    const { loading, onAfter, cacheTime, thirdPartRequest, needHeaders, ...arg } = options;
    const config = { method: 'get', url, params, ...arg };
    return this.request(config, { loading, onAfter, cacheTime, thirdPartRequest, needHeaders });
  }

  // post请求，支持cache缓存、loading、重复请求提示
  post(url, data = {}, options = {}) {
    const { loading, onAfter, cacheTime, thirdPartRequest, needHeaders, ...arg } = options;
    const config = { method: 'post', url, data, ...arg };
    return this.request(config, { loading, onAfter, cacheTime, thirdPartRequest, needHeaders });
  }

  // 文件上传，仅支持loading
  upload(url, data = {}, options = {}) {
    const { loading, onAfter, ...arg } = options;
    const config = {
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...arg.headers,
      },
      timeout: 10 * 60 * 1000, // 文件上传默认10分钟超时
      repeat: true, // 文件上传默认允许重复提交
      ...arg,
    };
    return this.request(config, { loading, onAfter });
  }

  // poll(url, params = {}, options = {}) {
  //   const { autoStart, async, number, interval, loading, onAfter, thirdPartRequest, needHeaders, ...arg } = options;
  //   const config = { method: 'get', url, params, ...arg };
  //   const pollerWorker = new Polling({
  //     taskFn: () => this.request(config, { loading, onAfter, thirdPartRequest, needHeaders }),
  //     autoStart,
  //     async,
  //     number,
  //     interval,
  //   });
  //   return pollerWorker;
  // }

  // 文件下载,支持loading、重复请求提示，请求成功文件自动下载（文件的文件名由后端定义返回在响应头中，前端不做处理）
  async downloadFile(url, data = {}, options = {}) {
    // 支持直接传入url和参数，拼接成url地址
    if (options.isSplice) {
      const params = { [this.tokenName]: this.getToken(), ...data };
      this.defaultOptions.onDownloadFile(`${this.baseURL}${url}?${Qs.stringify(params, { indices: false })}`, options);
      return;
    }
    const { loading, ...arg } = options;
    const config = {
      method: 'post',
      url,
      data,
      repeat: true, // 文件上传默认允许重复提交
      timeout: 10 * 60 * 1000, // 文件下载默认10分钟超时
      ...arg,
    };
    const res = await this.request(config, { loading });
    const type = res.headers['content-type'];
    const filename = res.headers['content-disposition'].match(/filename\**=(.+\.[a-zA-Z]+)$/)[1];
    this.defaultOptions.onDownloadFile(res.data, { type, filename });
  }
}
