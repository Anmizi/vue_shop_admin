import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import treeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

import VueQuillEditor from 'vue-quill-editor'

// require styles 导入VueQuillEditor样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入nprogress实现进度条效果
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor)

// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 启动进度条
  NProgress.start()
  // 为发送请求添加请求验证头部Authorization
  // 保证有获取数据的权限
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', treeTable)

// 定义一个时间格式化的全局过滤器
Vue.filter('dateFormat', function (originDate) {
  const dt = new Date(originDate * 1000)
  const y = dt.getFullYear() + ''
  const m = dt.getMonth() < 9 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1 + ''
  const d = dt.getDate() < 9 ? '0' + dt.getDate() : dt.getDate() + ''
  const hh = dt.getHours() < 9 ? '0' + dt.getHours() : dt.getHours() + ''
  const mm = dt.getMinutes() < 9 ? '0' + dt.getMinutes() : dt.getMinutes() + ''
  const ss = dt.getSeconds() < 9 ? '0' + dt.getSeconds() : dt.getSeconds() + ''
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
