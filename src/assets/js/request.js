import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
import { getToken } from './auth'
import { decrypt } from './crypto'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor 请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 在发送请求前给这个请求做出一些修改
    // 解密token
    const decrypt_token = decrypt(getToken())

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = decrypt_token
    }
    // console.log(config)
    // this.$store.dispatch('user/login', this.loginForm)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response.data)

    // if the custom code is not 20000, it is judged as an error.
    // 前后端统一规定 1为成功  0为失败
    if (res.code !== 1) {
      ElMessage({
        showClose: true,
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 2219: 非法token; 2220: 其他用户正在登录; 2221: token过期;
      if (res.code === 2219 || res.code === 2220 || res.code === 2221) {
        // to re-login
        ElMessageBox.confirm('您现在是登出状态，可以选择关掉此页面或者重新登录！', 'Confirm logout', {
          distinguishCancelAndClose: true,
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      showClose: true,
      message: error.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
