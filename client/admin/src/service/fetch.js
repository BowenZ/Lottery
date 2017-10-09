import axios from 'axios'
import store from '@/store'
import qs from 'qs' //序列化表单数据
import router from "@/router"
import { Message } from "element-ui"

const Axios = axios.create({
  baseURL: "/",
  timeout: 10000,
  responseType: "json",
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
})

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete"
    ) {
      // 序列化
      config.data = qs.stringify(config.data)
    }

    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token
    }
    return config
  },
  error => {
    Message({
      //  饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: error,
      type: "error.data.error.message"
    })
    return Promise.reject(error.data.error.message)
  }
)

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    console.log('====res====', res)
    if (res.data && !res.data.success) {
      Message({
        showClose: true,
        message: res.data.msg
          ? res.data.msg
          : '请求失败',
        type: "warning"
      })
      // return Promise.reject(res.data.msg)
    }
    return res
  },
  error => {
    console.log('====error====', error)
    Message({
      showClose: true,
      message: res.data.msg
        ? res.data.msg
        : '请求出错',
      type: "warning"
    })
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios })
  }
}

export function fetch(url, data, method='post'){
	let options = {
		method: method,
		url: url
	}
	if(method.toLowerCase().match(/post|put|patch/i)){
		options.data = data
	}else{
		options.params = data
	}
	return Axios(options)
}