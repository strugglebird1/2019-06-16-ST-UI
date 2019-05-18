import request from '@/utils/request'

// 获取attribute schema数据
export function getSchemaList(params) {
  return request({
    url: '/admin/schema/attribute/list',
    method: 'get',
    params
  })
}

// 获取自己授权的数据
export function getAuthToOtherList(params) {
  return request({
    url: '/admin/permission/list/grant_to_other',
    method: 'get',
    params
  })
}

// 获取授权给自己的数据
export function getAuthToMeList(params) {
  return request({
    url: '/admin/permission/list/grant_to_me',
    method: 'get',
    params
  })
}

// 授权给自己的数据详情
export function getAttrDataList(params) {
  return request({
    url: '/admin/attribute/peek',
    method: 'get',
    params
  })
}
export function getEventDataList(params) {
  return request({
    url: '/admin/event/peek',
    method: 'get',
    params
  })
}
