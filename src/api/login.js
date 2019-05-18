import request from '@/utils/request'

export function login(email, password) {
  return request({
    url: '/admin/token',
    method: 'post',
    data: {
      email,
      password
    }
  })
}
// 获取role、status、menus
export function getInfo() {
  return request({
    url: '/admin/role/permissions',
    method: 'get'
  })
}

// 获取sysuser信息
export function getUserInfo() {
  // const time = new Date().getTime()
  return request({
    url: '/admin/sysuser/user_info',
    method: 'post'
  })
}

// operate 获取customer信息
export function getUserCusInfo(data) {
  return request({
    url: '/admin/customer/user_customer_info',
    method: 'post',
    data
  })
}

// 获取customer信息
export function getCusInfo() {
  return request({
    url: '/admin/customer/detail',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 伪登录
export function pseudologin(data) {
  return request({
    url: '/admin/customer/pseudologin',
    method: 'post',
    data
  })
}
// 伪登录退出
export function pseudologout(data) {
  return request({
    url: '/admin/customer/pseudologout',
    method: 'post',
    data
  })
}
