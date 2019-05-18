import request from '@/utils/request'
// 重置秘钥
export function reset(data) {
  return request({
    url: '/admin/customer/reset_secret_email',
    method: 'post',
    data
  })
}
// export function comreset(data) {
//   return request({
//     url: '/admin/customer/reset_secret',
//     method: 'post',
//     data
//   })
// }
