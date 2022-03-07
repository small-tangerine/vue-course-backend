import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { login, logout, getInfo } from '@/api/user'

const state = {
  token: getToken(),
  id: 0,
  name: '',
  avatar: '',
  isFirst: false,
  roles: undefined,
  userInfo: {}
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
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
  },
  SET_FIRST: (state, isFirst) => {
    state.isFirst = isFirst === 1
  },
  SET_USER_INFO: (state, info) => {
    state.userInfo = info
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      if (getToken()) {
        resolve()
        return
      }
      login({ username: username, password: password }).then(res => {
        const { data } = res || []
        const { id, avatar, token } = data
        commit('SET_TOKEN', token)
        commit('SET_FIRST', 0)
        commit('SET_AVATAR', avatar)
        commit('SET_ID', id)
        setToken(token, 1800)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response || []
        const { id, nickname, avatar, roles } = data
        commit('SET_USER_INFO', data)
        commit('SET_ROLES', roles || [])
        commit('SET_NAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_FIRST', 0)
        commit('SET_ID', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', undefined)
        commit('SET_ROLES', undefined)
        removeToken()
        resetRouter()

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', undefined)
      commit('SET_ROLES', undefined)
      removeToken()
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
