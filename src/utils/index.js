/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function isPassword(str) {
  const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,}$/
  return reg.test(str)
}
export function isCorrectsel(str) {
  if (str === '') {
    return ''
  } else {
    const a = str.replace(/%/ig, '')
    const b = a.replace(/_/ig, '')
    if (b === '') {
      return false
    } else {
      return b
    }
  }
}

