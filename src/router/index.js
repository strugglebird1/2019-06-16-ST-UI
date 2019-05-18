import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/common/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/common/login/index'),
  hidden: true
},
{
  path: '/emailroute',
  component: () => import('@/views/common/email'),
  hidden: true
},
{
  path: '/forgot', // 忘记密码
  name: 'forgot',
  component: () => import('@/views/common/forgot'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/admin', // 超级管理员初始化
  name: 'admin',
  component: () => import('@/views/sysuser/admin/index'),
  hidden: true,
  meta: {
    roles: [1]
  }
},
{
  path: '/setinfo', // 其他角色第一次登录设置信息
  component: () => import('@/views/common/setinfo/index'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/home',
  name: 'Home Page',
  children: [{
    path: 'home',
    hidden: false,
    component: () => import('@/views/common/home/index'),
    meta: {
      title: 'Home',
      icon: 'example'
    }
  }]
},
{
  path: '/Profile',
  component: Layout,
  hidden: true,
  children: [{
    path: '/changepwd', // 修改密码
    name: 'Changepwd',
    hidden: true,
    component: () => import('@/views/common/changepwd/index'),
    meta: {
      title: 'Change Password'
    }
  }, {
    path: '/sysprofile', // 管理员个人信息
    name: 'Profile',
    hidden: true,
    component: () => import('@/views/sysuser/sysprofile/index'),
    meta: {
      title: 'Profile',
      roles: [1, 2, 3]
    }
  }, {
    path: '/cusprofile', // customer个人信息
    name: 'Customer Profile',
    hidden: true,
    component: () => import('@/views/customer/cusprofile/index'),
    meta: {
      title: 'Profile',
      roles: [4]
    }
  }]
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/Sysuser',
  component: Layout,
  redirect: '/sysuser/list',
  alwaysShow: false,
  meta: {
    title: 'Account Management',
    icon: 'table',
    roles: [1, 2],
    activeMenu: '/sysuser/list'
  },
  children: [{
    path: '/sysuser/list', // 管理员列表
    name: 'sysuserList',
    hidden: true,
    component: () => import('@/views/sysuser/list/index'),
    meta: {
      title: 'Account Management',
      icon: 'table',
      roles: [1, 2]
    },
    children: [{
      path: '/creat/sysuser', // 创建管理员
      name: 'creatSysuser',
      hidden: true,
      component: () => import('@/views/sysuser/list/creat/index'),
      meta: {
        title: 'Create Account',
        icon: 'user',
        roles: [1, 2]
      }
    }]
  }]
},
{
  path: '/Operator',
  component: Layout,
  redirect: '/customer/list',
  alwaysShow: false,
  meta: {
    title: 'Customer Management',
    icon: 'table',
    roles: [2, 3],
    activeMenu: '/customer/list'
  },
  children: [{
    path: '/customer/list', // customer列表
    name: 'customerList',
    hidden: true,
    component: () => import('@/views/customer/list/index'),
    meta: {
      title: 'Customer Management',
      icon: 'table',
      roles: [2, 3]
    },
    children: [{
      path: '/creat/customer', // 创建customer
      name: 'creatCustomer',
      hidden: true,
      component: () => import('@/views/customer/list/creat/index'),
      meta: {
        title: 'Create Customer',
        icon: 'user',
        roles: [2, 3]
      }
    },
    {
      path: '/cusinfor', // customer详细信息
      name: 'cusinfor',
      hidden: true,
      component: () => import('@/views/customer/cusinfor/index'),
      meta: {
        title: 'Customer Information',
        roles: [2, 3]
      }
    },
    {
      path: '/auth/al', // 授权列表(运营)
      name: 'authAl',
      component: () => import('@/views/auth/AuthList'),
      meta: {
        title: 'Authorization List',
        icon: 'table',
        roles: [2, 3]
      },
      children: [{
        path: '/auth/addauth', // 新增授权
        name: 'authAddauth',
        component: () => import('@/views/auth/AddAuth'),
        meta: {
          title: 'New',
          icon: 'table',
          roles: [2, 3]
        }
      }, {
        path: '/auth/editauth', // 授权编辑
        name: 'authEditauth',
        component: () => import('@/views/auth/EditAuth'),
        meta: {
          title: 'Edit',
          icon: 'table',
          roles: [2, 3]
        }
      }, {
        path: '/auth/sie',
        component: () => import('@/views/auth/SaveInfoEdit'),
        meta: {
          title: 'SaveInfoEdit', // 新增授权保存
          icon: 'table',
          roles: [2, 3]
        }
      }, {
        path: '/auth/si',
        component: () => import('@/views/auth/SaveInfo'),
        meta: {
          title: 'SaveInfo', // 授权编辑保存
          icon: 'table',
          roles: [2, 3]
        }
      }]
    }
    ]
  }]
},
{
  path: '/Customer',
  component: Layout,
  name: 'Customer',
  alwaysShow: false,
  redirect: 'noredirect',
  meta: {
    title: 'Data Management',
    icon: 'example',
    roles: [4]
  },
  children: [{
    path: '/Alldata',
    name: 'Alldata',
    alwaysShow: false,
    redirect: 'noredirect',
    component: () => import('@/views/company/index'),
    meta: {
      title: 'All Data',
      icon: 'table',
      breadcrumb: false,
      roles: [4]
    },
    children: [{
      path: '/users/attribute', // attribute schema信息
      name: 'usersAttribute',
      component: () => import('@/views/company/userattribute/index'),
      meta: {
        title: 'User Registration Data',
        icon: 'peoples',
        roles: [4]
      }
    }, {
      path: '/eventdata', // event schema列表
      name: 'eventData',
      component: () => import('@/views/company/eventdata/index'),
      meta: {
        title: 'User Event Data',
        icon: 'peoples',
        roles: [4]
      },
      children: [{
        path: '/schemadetail', // event schema详细信息
        name: 'schemaDetail',
        hidden: true,
        component: () => import('@/views/company/eventdata/schemadetail'),
        meta: {
          title: 'Schema Details',
          icon: 'peoples',
          roles: [4]
        }
      }, {
        path: '/addschema', // event schema添加
        name: 'addSchema',
        hidden: true,
        component: () => import('@/views/company/eventdata/addschema'),
        meta: {
          title: 'Create Schema',
          icon: 'peoples',
          roles: [4]
        }
      }]
    }
    ]
  }, {
    path: '/user/ad', // customer 授权列表
    name: 'userAd',
    alwaysShow: false,
    component: () => import('@/views/user/AuthData'),
    meta: {
      title: 'Data Authorized by Me',
      icon: 'table',
      roles: [4]
    }
  }, {
    path: '/user/add', // customer 被授权列表
    name: 'userAdd',
    alwaysShow: false,
    component: () => import('@/views/user/AuthedData'),
    meta: {
      title: 'Data Authorized to Me',
      icon: 'table',
      roles: [4]
    },
    children: [{
      path: '/user/adddetail', // customer 被授权详情
      name: 'Details',
      hidden: true,
      component: () => import('@/views/user/AuthedDetail'),
      meta: {
        title: 'Details',
        icon: 'table',
        roles: [4]
      }
    }]
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

