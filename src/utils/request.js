import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API // api 的 base_url
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const surl = '/admin/email/init_change'
    const surl2 = '/admin/email/send_forget_email'
    const surl3 = '/admin/email/forget_change'
    if (config.url === surl && config.method === 'post') {
      return config
    }
    if (config.url === surl2 && config.method === 'post') {
      return config
    }
    if (config.url === surl3 && config.method === 'post') {
      return config
    }
    // if (config.params) {
    //   const obj = {}
    //   Object.keys(config.params).forEach(function(key) {
    //     obj[key] = encodeURIComponent(config.params[key])
    //   })
    //   config.params = obj
    // }
    if (config.method === 'get') {
      // config.headers['Cache-Control'] = 'no-cache'
      // config.headers['Pragma'] = 'no-cache'
    }
    if (config.method === 'post') {
      config.data = JSON.stringify(config.data)
      config.headers['Content-Type'] = 'application/json'
    }
    if (store.getters.token) {
      const access_token = 'Bearer ' + getToken()
      config.headers['Authorization'] = `${access_token}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    //     /**
    //      * code为非20000是抛错 可结合自己业务进行修改
    //      */
    const res = response.data
    // if (res.code !== 0) {
    //   Message({
    //     message: res.msg,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    if (res.code === 40901 && res.msg === 'User is disabled') {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    } else {
      return response
    }
  }
)

export default service
