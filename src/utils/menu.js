
export function checkmenu(arr) {
  const arouter = [{ path: '/home', meta: { icon: 'example', title: 'Home Page' }}]
  arr.filter(route => {
    const obj = { meta: {}}
    if (route.level === 2) {
      obj.path = route.href
      obj.meta.icon = route.icon
      obj.meta.title = route.name
      arouter.push(obj)
    }
  })
  return arouter
}
