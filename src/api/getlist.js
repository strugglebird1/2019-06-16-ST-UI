import request from '@/utils/request'
// 获取sysuser列表
export function getlist(data) {
  return request({
    url: '/admin/sysuser/list',
    method: 'post',
    data
  })
}

// sysuser禁用
export function disableUser(data) {
  return request({
    url: '/admin/sysuser/disable',
    method: 'post',
    data
  })
}

// sysuser禁用
export function activeUser(data) {
  return request({
    url: '/admin/sysuser/active',
    method: 'post',
    data
  })
}

// 获取customer列表
export function getcuslist(data) {
  return request({
    url: '/admin/customer/list',
    method: 'post',
    data
  })
}

// customer禁用
export function disableCustomer(data) {
  return request({
    url: '/admin/customer/disable',
    method: 'post',
    data
  })
}

// customer禁用
export function activeCustomer(data) {
  return request({
    url: '/admin/customer/active',
    method: 'post',
    data
  })
}

// 获取attribute schema列表
export function getschemalist() {
  return request({
    url: '/admin/schema/attribute/list',
    method: 'get'
  })
}

// schema attribute column禁用
export function disableColumn(data) {
  return request({
    url: '/admin/schema/attribute/field/disable',
    method: 'post',
    data
  })
}

// schema attribute column恢复
export function enableColumn(data) {
  return request({
    url: '/admin/schema/attribute/field/enable',
    method: 'post',
    data
  })
}

// 注册数据 data 20条数据

export function schemaDatalist(params) {
  return request({
    url: '/admin/peek_attrs',
    method: 'get',
    transformResponse: [function(data) {
      const arr1 = data.split('[')
      const arr2 = arr1[1].split('}')
      arr2.forEach(item => {
        item = item + 'a'
      })
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i].length > 1) {
          const str = arr2[i].replace('cfbid":', 'cfbid":"')
          arr2[i] = str + '"'
        }
      }
      const res = arr1[0] + '[' + arr2.join('}')
      return JSON.parse(res)
    }],
    params
  })
}

export function eventDatalist(params) {
  return request({
    url: '/admin/peek_events',
    method: 'get',
    transformResponse: [function(data) {
      const arr1 = data.split('[')
      const arr2 = arr1[1].split('}')
      arr2.forEach(item => {
        item = item + 'a'
      })
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i].length > 1) {
          const str = arr2[i].replace('ts":', 'ts":"')
          arr2[i] = str + '"'
        }
      }
      const res = arr1[0] + '[' + arr2.join('}')
      return JSON.parse(res)
    }],
    params
  })
}
// 通过cFBID和custUserId查询数据
export function searchByid(data) {
  return request({
    url: '/admin/attrs',
    method: 'post',
    transformResponse: [function(data) {
      if (data.indexOf('OK') !== -1) {
        const arr = data.split(',')
        const arr1 = arr[2].split(':')
        arr1[2] = '"' + arr1[2] + '"'
        arr[2] = arr1.join(':')
        const obj = arr.join(',')
        return JSON.parse(obj)
      } else {
        return JSON.parse(data)
      }
    }],
    data
  })
}
