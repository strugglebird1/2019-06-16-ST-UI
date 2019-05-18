import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function setInfo(value) {
  // if (getToken()) {
  //   removeToken()
  // }
  const urlobj = GetUrlObj(value)
  store.code = urlobj.code
}

export function forgetchange(value) {
  if (getToken()) {
    removeToken()
  }
  const urlobj = GetUrlObj(value)
  store.userId = urlobj.userId
  store.code = urlobj.code
  store.custId = urlobj.custId
}

// export function reset(value) {
//   const urlobj = GetUrlObj(value)
//   store.userId = urlobj.userId
//   store.code = urlobj.code
//   store.custId = urlobj.custId
// }

function GetUrlObj(url) {
  var str = url.split('?')[1]
  if (str) {
    var arr = str.split('&')
    const urlobj = {}
    if (arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const arr2 = arr[i].split('=')
        urlobj[arr2[0]] = arr2[1]
      }
    }
    return urlobj
  }
}
