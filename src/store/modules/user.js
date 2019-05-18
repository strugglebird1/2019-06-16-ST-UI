import { login, getInfo, getUserInfo, getCusInfo, pseudologout } from '@/api/login'
import { getToken, setToken, removeToken, setRoleID, removeRoleID, getOpeID, removeOpeID, getSysID } from '@/utils/auth'
import { checkmenu } from '@/utils/menu'
import {removeCustId} from "../../utils/auth";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    status: '',
    email: '',
    phone: '',
    code: '',
    userId: '',
    id: '',
    custId: '',
    company: '',
    companyinfo: {},
    menu: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICKNAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_CUSTID: (state, custId) => {
      state.custId = custId
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_COMPANYINFO: (state, companyinfo) => {
      state.companyinfo = companyinfo
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const email = userInfo.email.trim()
      return new Promise((resolve, reject) => {
        login(email, userInfo.password).then(response => {
          if (response.data.code === 0) {
            const data = response.data.data
            setToken(data.access_token, data.expires_in)
            commit('SET_TOKEN', data.access_token)
            resolve(response)
          } else {
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            setRoleID(data.roles[0])
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          commit('SET_STATUS', data.status)
          commit('SET_MENU', checkmenu(data.menus))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response.data.data.userInfo
          commit('SET_NICKNAME', data.nickName)
          commit('SET_EMAIL', data.email)
          commit('SET_PHONE', data.phone)
          commit('SET_ID', data.id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取customer信息
    GetCusInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // const data = { }
        // data.custId = state.id
        getCusInfo().then(response => {
          const data = response.data.data.cust
          commit('SET_CUSTID', data.id)
          commit('SET_COMPANY', data.name)
          commit('SET_COMPANYINFO', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeRoleID()
        resolve()
      })
    },
    // 伪登录退出
    OperatorLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        // removeToken()
        // removeOpeID()
        const sysPesudoLoginId = getSysID()
        const operatorUserId = getOpeID()
        const outobj = { sysPesudoLoginId, operatorUserId }
        pseudologout(outobj).then(response => {
          if (response.data.code === 0) {
            setToken(response.data.data.access_token, response.data.data.expires_in)
            commit('SET_ROLES', [])
            removeRoleID()
            removeOpeID()
            resolve()
          } else {
            this.$message.error(response.data.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
