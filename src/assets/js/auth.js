// 将token值设置为cookie
import Cookies from 'js-cookie'
import { COOKIE_TOKEN_KEY } from './constant'

export function getToken () {
  return Cookies.get(COOKIE_TOKEN_KEY)
}

export function setToken (token) {
  // 设置为4个小时就过期
  return Cookies.set(COOKIE_TOKEN_KEY, token, { expires: 1 / 6 })
}

export function removeToken () {
  return Cookies.remove(COOKIE_TOKEN_KEY)
}
