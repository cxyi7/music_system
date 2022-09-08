import Qs from 'qs';
import axios from 'axios';
import { isObject, isArray, isString, isFunction, mergeWith, merge } from 'lodash';
import storage from '../utils/storage.js';

const responseMap = new Map(); // 返回结果缓存池
const pendingRequest = new Map(); // 请求池
const responseHandle = new Map(); // res处理池： 根据返回数据code使用不同的处理方法
const loadingList = []; // loading池

export default class Ajax {
  /**
   * @param {string} baseUrl   基础请求地址
   * @param {object} options   全局配置，可以被局部配置覆盖
   */
  constructor(baseUrl = '', options = {}) {
    // 全局api url
    this.baseUrl = baseUrl;

    // ajax基础配置
    this.defaultOptions = {
      timeout: 2000, // 超时时间
      withCredentials: true, // 允许跨域
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }, // 默认json格式
      parmasExclude: ['page'], // 防重复请求排除字段, /xxx/pageList?page=1和/xxx/pageList?page=2会排除page参数所以相当于同一个请求
      onError: this.onError, // 默认错误处理，默认只是在控制台打印错误
      onBefore: this.onBefore, // 默认发送请求之前处理方法
      onAfter: this.onAfter, // 默认发送请求之后处理方法
      onLoading: this.onLoading, // loading方法,返回loading的实例【必须包含start和close方法,否则loading将无法启用/关闭】
      // onDownloadFile: downLoadFile, // 默认的文件下载方法
      getToekn: this.getToekn, // 获取token
    };

    if (!isObject(options)) {
      throw new Error('new Request参数 options 期望是一个Object!!!');
    }

    // 合并options
    /**
     * @params objVal 对象的属性值
     * @params srcVal 对象的属性值
     */
    mergeWith(this.defaultOptions, options, (objVal, srcVal) => {
      if (isArray(objVal)) return objVal.concat(srcVal); // 如果是属性值是数组，则合并
      if (isString(objVal) || isFunction(objVal)); // 如果是字符串或方法，则覆盖
      return merge(objVal, srcVal); // 返回新的处理过的对象
    });

    // 初始化axios实例
    this.init();
    // 添加默认的response数据处理方法
    this.addResponseHandle(200, ({ data }) => data);
    this.addResponseHandle(403, () => {
      throw new Error('您没有权限访问，请重新登录或联系管理员！');
    });
    this.addResponseHandle(500, () => {
      throw new Error('服务器异常，请稍后再试！');
    });
    this.addResponseHandle('default', ({ msg }) => {
      throw new Error(msg);
    });
  }

  // 初始化axios实例
  init() {
    // axios实例对象 --> 是一个函数，可以接收参数
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.defaultOptions.timeout,
      withCredentials: this.defaultOptions.withCredentials,
      headers: this.defaultOptions.headers,
      paramsSerializer: (params) => Qs.stringify(params, { indices: false }), // 请求默认的格式化程序
    });
    // 全局axios请求拦截
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(config);
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

  // 每个请求根据method,url,params,data生成key
  // 用来取消重复请求，会过滤paramssExclude字段
  generateReqKey(config) {
    const { method, url, params = {}, data } = config;
    // 如果请求中包含paramsExclude设置中的字段名称，则忽略该字段
    const parmasExclude = config.parmasExclude || this.defaultOptions.parmasExclude;
    const newData = typeof data === 'string' ? JSON.parse(data) : data;
    const newParams = parmasExclude.reduce(
      (pre, cur) => {
        delete pre[cur];
        return pre;
      },
      { ...params },
    );
    // key由请求方式,url,参数组成一个key
    return [method, url, Qs.stringify(newParams), Qs.stringify(newData)].join('&');
  }

  // 将请求添加到请求池中
  addPendingRequest(config) {
    const requestKey = this.generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
      if (config.method === 'get') {
        // get请求，若存在重复，则取消之前已经发送的请求
        const concelToken = pendingRequest.get(requestKey);
        concelToken(requestKey); // 取消请求
        pendingRequest.delete(requestKey); // 在请求池中删除该条请求
        this.addPendingRequest(config); // 重新添加进请求池等待下一次请求
      } else {
        // 为post则允许重复提交
        console.log(config);
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

  // 清空请求池，业务中可以通过在routerbefore中new Ajax().cleanPendingRequest()来加上路由切换取消所有请求的需求
  cleanPendingRequest() {
    if (!pendingRequest.size < 0) return;
    for (const [requestKey, cancel] of pendingRequest) {
      if (isArray(cancel)) {
        cancel.forEach((cb) => cb(requestKey));
      } else {
        cancel(requestKey);
      }
      pendingRequest.delete(requestKey);
    }
  }

  // 增加response返回处理方法
  addResponseHandle(code, callback) {
    if (!isFunction(callback)) {
      throw new Error('添加response处理方法错误： callback must is a function! ');
    }
    responseHandle.set(code, callback);
  }

  // 设置缓存  ---> 只有当设置了缓存时间才设置缓存，否则不会进行缓存数据
  setCache(config, data, cacheTime) {
    if (cacheTime) {
      const requestKey = this.generateReqKey(config);
      responseMap.set(requestKey, { time: Date.now() + cacheTime, data });
    }
  }

  // 获取缓存数据
  getCache(config) {
    const requestKey = this.generateReqKey(config);
    const data = responseMap.get(requestKey) || null;
    if (!data) return null;
    if (data.time < Date.now()) {
      // 如果过期则清楚缓存，返回null。 否则返回缓存数据
      responseMap.delete(requestKey);
      return null;
    }
    return data.data;
  }

  // 默认的loading
  onLoading(option) {
    return {
      start: console.log(`开启loading，参数：${option}`),
      close: console.log(`关闭loading`),
    };
  }

  // 开启loading
  startLoading(options) {
    console.log(options);
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
  getToekn() {
    return storage.localStorage.getItem('token');
  }

  // 发送请求前设置参数
  onBefore(config) {
    console.log(config);
  }

  // 默认的请求响应处理方法(默认执行响应处理列表内的函数处理返回值，可重写该方法)
  onAfter(res) {
    const { code } = res;
    const callback = responseHandle.get(code) || responseHandle.get('default');
    return callback(res);
  }

  // 默认错误处理方法
  onError(error) {
    console.log(error.message);
  }

  // 处理http异常
  httpErrorStatusHandle(error) {
    // 处理被取消的请求，取消请求不执行时onError
    if (axios.isCancel(error)) {
      const [method, url] = error.message.split('&');
      console.log(`取消${method.toUpperCase()} 请求:${url}`);
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
          message = '您未登录，或登录已超时，请先登录！';
          break;
        case 403:
          message = '您没有权限操作！';
          break;
        case 404:
          message = `请求地址出错：${error.response.config.url}`;
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
    // 有缓存则直接用缓存，无需loading，要放在try/catch外面，否则会执行finally，导致关闭loading
    if (cacheData) return cacheData;
    try {
      // 无缓存的情况下调用接口，添加loading
      this.startLoading(options.loading);
      const res = await this.axiosInstance(config); // 当前实例的配置对象
      console.log(res);
      // 是否直接返回整个返回值
      if (options.needHeaders) return res;
      // 对于第三方接口及返回非标准格式，则直接返回，不做处理
      if (options.thirdPartRequest) return res.data;
      // 特殊返回值格式直接返回， 例如：文件下载返回的是 -> 文件流/url地址
      if (!res.data || res.data instanceof ArrayBuffer || !isObject(res.data)) return res;
      // 返回onAfter执行的结果
      const result = onAfter(res.data);
      // 其他数据走cache onAfter
      this.setCache(res.config, result, options.cacheTime);
      return result;
    } catch (error) {
      this.httpErrorStatusHandle(error);
      return Promise.reject(error);
    } finally {
      this.closeLoading();
    }
  }

  // get请求， 支持cache缓存， loading， 重复请求提示
  get(url, params = {}, options = {}) {
    const { loading, onAfter, cacheTime, thirdPartRequest, needHeaders, ...args } = options;
    const config = { method: 'get', url, params, ...args };
    return this.request(config, {
      loading,
      onAfter,
      cacheTime,
      thirdPartRequest,
      needHeaders,
    });
  }

  // post请求，支持cache缓存， loading， 重复请求提示
  post(url, data = {}, options = {}) {
    const { loading, onAfter, cacheTime, thirdPartRequest, needHeaders, ...arg } = options;
    const config = { method: 'post', url, data, ...arg };
    return this.request(config, {
      loading,
      onAfter,
      cacheTime,
      thirdPartRequest,
      needHeaders,
    });
  }
}
