import request from '@/utils/request'

// 创建sysuser
export function setPerson(data) {
  return request({
    url: '/admin/sysuser/save',
    method: 'post',
    data
  })
}

// 创建customer
export function setCustomer(data) {
  return request({
    url: '/admin/customer/add',
    method: 'post',
    data
  })
}

// 添加attribute Schema column

export function setColumn(data) {
  return request({
    url: '/admin/schema/attribute/field/add',
    method: 'post',
    data
  })
}
