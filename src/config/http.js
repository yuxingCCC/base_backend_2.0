/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
import router from '@/router/index'
import envConfig from '@/config/envConfig.js'

// axios 配置
axios.defaults.timeout = 60000; // 请求超时时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = envConfig.api; // axios请求默认追加前缀

// http request 拦截器
axios.interceptors.request.use(
  config => {
      let adminToken = sessionStorage.getItem(envConfig.tokenName);
      if (adminToken) {
      config.headers.Authorization = adminToken
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
          sessionStorage.removeItem(envConfig.tokenName);
          router.currentRoute.path !== '/login' &&
            router.replace({
              	path: '/login',
              	query: { redirect: router.currentRoute.path },
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error)
  },
);

export default axios
