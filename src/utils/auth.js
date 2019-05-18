// import Cookies from 'js-cookie'
const exp = 864e+5
const TokenKey = 'access_token'

export function getToken() {
  var data = sessionStorage.getItem(TokenKey)
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function setToken(token) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem(TokenKey, JSON.stringify({ data: token, time: curTime }))
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function getState() {
  var data = sessionStorage.getItem('State')
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function setState(state) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem('State', JSON.stringify({ data: state, time: curTime }))
}

export function removeState() {
  return sessionStorage.removeItem('State')
}

export function getRoleID() {
  var data = sessionStorage.getItem('RoleID')
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function setRoleID(RoleID) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem('RoleID', JSON.stringify({data: RoleID, time: curTime}))
}

export function removeRoleID() {
  return sessionStorage.removeItem('RoleID')
}

export function getOpeID() {
  var data = sessionStorage.getItem('OpenID')
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function setOpeID(OpenID) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem('OpenID', JSON.stringify({ data: OpenID, time: curTime }))
}

export function removeOpeID() {
  return sessionStorage.removeItem('OpenID')
}

export function getSysID() {
  var data = sessionStorage.getItem('SysID')
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function setSysID(SysID) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem('SysID', JSON.stringify({data: SysID, time: curTime}))
}

export function removeSysID() {
  return sessionStorage.removeItem('SysID')
}

export function setCustId(CustId) {
  var curTime = new Date().getTime()
  return sessionStorage.setItem('CustId', JSON.stringify({ data: CustId, time: curTime }))
}

export function getCustId() {
  var data = sessionStorage.getItem('CustId')
  if (data === null) {
    return null
  }
  var dataObj = JSON.parse(data)
  if (new Date().getTime() - dataObj.time > exp) {
    return null
  } else {
    return dataObj.data
  }
}

export function removeCustId() {
  return sessionStorage.removeItem('CustId')
}

