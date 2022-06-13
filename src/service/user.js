import request from '@/assets/js/request'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getRoleMenus (params) {
  return request({
    url: '/user/getRoleMenus',
    method: 'get',
    params
  })
}
