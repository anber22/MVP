import axios from 'axios'
// create an request instance
const request = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
})
request.defaults.headers.post['Content-Type'] =
  'application/json'
request.defaults.headers['Cache-Control'] = 'no-cache'
// request.defaults.headers['Referer Policy'] = 'strict-origin-when-cross-origin'

// request.defaults.withCredentials = true


// 请求拦截器
request.interceptors.request.use(
  config => {
    
   console.log('请求拦截', config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器

request.interceptors.response.use(
  response => {
    console.log('响应', response)
    // TODO：接口响应了需要去删除掉对应的controller
    // CancelRequest.deleteControllerOne(response.config.url, true)
  
    return response.data
  },
  error => {
    // 需要处理一下错误是不是由于取消接口请求造成的
    if (error.code === 'ERR_CANCELED') {
      console.log('请求已被取消')
    } else {
      return Promise.reject(error)
    }
  }
)

export default request
