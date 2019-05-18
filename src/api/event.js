import request from '@/utils/request'

export function getSchemaList() {
  return request({
    url: '/admin/schema/event/list',
    method: 'get'
  })
}

export function updateSchema(data) {
  return request({
    url: '/admin/schema/event/update',
    method: 'post',
    data
  })
}

export function disableColumn(data) {
  return request({
    url: '/admin/schema/event/field/disable',
    method: 'post',
    data
  })
}

export function enableColumn(data) {
  return request({
    url: '/admin/schema/event/field/enable',
    method: 'post',
    data
  })
}

export function setColumn(data) {
  return request({
    url: '/admin/schema/event/field/add',
    method: 'post',
    data
  })
}

export function addEventSchema(data) {
  return request({
    url: '/admin/schema/event/create',
    method: 'post',
    data
  })
}
