
export function dateformat(num) {
  const date = new Date(num)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  //const h = (date.getHours() + 1 < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
  //const m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  //const s = (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  return Y + M + D
}
