import request from '@/utils/request'
// import store from '@/store'

// 超级管理员初始化
export function emailInit(data) {
  return request({
    url: '/admin/email/send_init_email',
    method: 'post',
    data
  })
}
export function setInfo(data) {
  return request({
    url: '/admin/email/init_change',
    method: 'post',
    data
  })
}
// 忘记密码
export function emailForget(data) {
  return request({
    url: '/admin/email/send_forget_email',
    method: 'post',
    data
  })
}
export function forgetChange(data) {
  return request({
    url: '/admin/email/forget_change',
    method: 'post',
    data
  })
}

// 新客户初始化
export function initUser(data) {
  return request({
    url: '/admin/sysuser/init_user',
    method: 'post',
    data
  })
}

// 根据邮件code返回操作
export function code_router(params) {
  return request({
    url: '/admin/email/code_router',
    method: 'get',
    params
  })
}
