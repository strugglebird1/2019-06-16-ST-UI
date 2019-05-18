import request from '@/utils/request'
import store from '@/store'

// 所有角色修改个人信息
export function updata(data) {
  data.id = store.getters.id
  data.email = store.getters.email
  return request({
    url: '/admin/sysuser',
    method: 'put',
    data
  })
}
