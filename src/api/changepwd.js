import request from '@/utils/request'

// 修改密码
export function changepwd(data) {
  return request({
    url: '/admin/sysuser/change_password',
    method: 'post',
    data
  })
}
