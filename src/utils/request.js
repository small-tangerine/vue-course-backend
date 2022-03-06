import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setSeconds, setToken, getSeconds } from '@/utils/auth'

axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    // do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data || []
    const token = response.headers.authorization

    if (token) {
      setToken(token,1800)
    }
    if (response.status === 200 && !res.error && res.error !== 0) {
      return response
    }

    // if the custom code is not 0, it is judged as an error.
    if (res.error !== 0) {
      // 4001: Illegal token;
      if (res.error === 4001) {
        // to re-login
        const url = response.config.url
        if (url.indexOf('logout') === -1) {
          // 退出登录不需要弹框
          MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
