import { setToken, setOpeID, setSysID } from '@/utils/auth'
const operatorlogin = {
  state: {
    operator_user_id: null,
    sys_pesudo_login_id: null
  },
  mutations: {
    SET_OPERATOR: (state, data) => {
      state.operator_user_id = data.operator_user_id
      state.sys_pesudo_login_id = data.sys_pesudo_login_id
    }
  },
  actions: {
    Operator({ commit }, data) {
      return new Promise(resolve => {
        const opobj = data.data
        setToken(opobj.access_token, opobj.expires_in)
        setOpeID(opobj.operator_user_id)
        setSysID(opobj.sys_pesudo_login_id)
        commit('SET_OPERATOR', opobj)
        resolve()
      })
    }
  }
}

export default operatorlogin
