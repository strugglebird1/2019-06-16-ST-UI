import request from '@/utils/request'

// 获取attribute列表
export function getSchemaList(params) {
  return request({
    url: '/admin/schema/attribute/list',
    method: 'get',
    params
  })
}

// 获取自己授权的数据
export function getAuthList(params) {
  return request({
    url: '/admin/permission/list/grant_to_other',
    method: 'get',
    params
  })
}

// 获取授权给别人的数据
export function getAuthToMeList(params) {
  return request({
    url: '/admin/permission/list/grant_to_me',
    method: 'get',
    params
  })
}

// 授权详情的data数据
export function getDataList(params) {
  return request({
    url: '/attribute/peek',
    method: 'get',
    params
  })
}

// 删除某个具体授权
export function deleteAuthItem(data) {
  return request({
    url: '/admin/permission/edit',
    method: 'post',
    data
  })
}
// export function deleteAuthItem(data) {
//   return request({
//     url: '/admin/permission/del',
//     method: 'post',
//     data
//   })
// }

export function addAuthItem(data) {
  return request({
    url: '/admin/permission/edit',
    method: 'post',
    data
  })
}
// export function addAuthItem(data) {
//   return request({
//     url: '/admin/permission/add',
//     method: 'post',
//     data
//   })
// }

export function getAddList(params) {
  return request({
    url: '/admin/permission/list/my',
    method: 'get',
    params
  })
}

export function getCustList(data) {
  return request({
    url: '/admin/customer/list',
    method: 'post',
    data
  })
}

export function addPermission(data) {
  return request({
    url: '/admin/permission/edit',
    method: 'post',
    data
  })
}
// export function addPermission(data) {
//   return request({
//     url: '/admin/permission/add',
//     method: 'post',
//     data
//   })
// }

export function getEditList(data) {
  return request({
    url: '/admin/permission/view',
    method: 'post',
    data
  })
}
