const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  phone: state => state.user.phone,
  roles: state => state.user.roles,
  id: state => state.user.id,
  custId: state => state.user.custId,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  company: state => state.user.company,
  companyinfo: state => state.user.companyinfo,
  menu: state => state.user.menu,
  operid: state => state.operatorlogin.operator_user_id,
  sysid: state => state.operatorlogin.sys_pesudo_login_id
}
export default getters
