import { login, logout, getInfo } from '@/service/user'
import { getToken, setToken, removeToken } from '@/assets/js/auth'
import { resetRouter } from '@/router'
import { decrypt } from '@/assets/js/crypto'
import _ from 'lodash'

const state = {
  token: getToken(),
  avatar: '',
  name: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login  获取token值并设置为cookie
  login ({ commit }, userInfo) {
    const { name, pwd } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: _.trim(name), pwd: _.trim(pwd) }).then(res => {
        const { data } = res

        commit('SET_TOKEN', data.data)
        setToken(data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 获取用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(res => {
        // 对用户信息解密
        const data = decrypt(res.data)

        const { r_power, u_name } = data
        const roles = _.split(r_power, '-')

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject(new Error('getInfo: roles must be a non-null array!'))
        }

        commit('SET_ROLES', roles)
        commit('SET_AVATAR', '')
        commit('SET_NAME', u_name)

        // 将权限返回出去
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])

      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
