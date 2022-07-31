import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 引入图片路径
import './assets/iconfont/iconfont.css'
// 引入axios
import axios from 'axios'

// 配置axios的请求前缀
axios.defaults.baseURL = '/campus'
// vue3.x创建vue实例方法
const app = createApp(App).use(router)
// 指定vue实例的元素
app.mount('#app')
// 配置全局的axios使用axios代替
app.config.globalProperties.$axios = axios
// 配置全局图片请求前缀
app.config.globalProperties.$baseUrl = 'http://127.0.0.1:8080/campus'
