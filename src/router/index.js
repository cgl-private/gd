import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import HomeDetail from '../views/HomeDetail.vue'
import Video from '../views/Video.vue'
import VideoDetail from '../views/VideoDetail.vue'
import Dynamic from '../views/Dynamic.vue'
import DynamicAdd from '../views/DynamicAdd.vue'
import Personal from '../views/Personal.vue'
import UserNew from '../views/UserNew.vue'
import UserVideo from '../views/UserVideo.vue'
import UserDynamic from '../views/UserDynamic.vue'

const routes = [
  {
    path: '/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home
      },
      {
        path: '/video',
        name: 'Video',
        component: Video
      },
      {
        path: '/dynamic',
        name: 'Dynamic',
        component: Dynamic
      },
      {
        path: '/personal',
        name: 'Personal',
        component: Personal
      }
    ]
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home/detail',
    name: 'HomeDetail',
    component: HomeDetail
  },
  {
    path: '/video/detail',
    name: 'VideoDetail',
    component: VideoDetail
  },
  {
    path: '/dynamic/add',
    name: 'DynamicAdd',
    component: DynamicAdd
  },
  {
    path: '/user/new',
    name: 'UserNew',
    component: UserNew
  },
  {
    path: '/user/video',
    name: 'UserVideo',
    component: UserVideo
  },
  {
    path: '/user/dynamic',
    name: 'UserDynamic',
    component: UserDynamic
  }
]

// 创建路由实例
const router = createRouter({
  // 设置路由模式为哈希路由模式
  history: createWebHashHistory(),
  // 加载路由集合
  routes
})

router.beforeEach((to, from, next) => {
  const isLogin = window.sessionStorage.getItem('isLogin')
  if (to.path === '/') {
    next()
  } else {
    console.log(isLogin)
    if (isLogin) {
      next()
    } else {
      alert('没有登录，请先登录')
      next('/')
    }
  }
})

// 导出路由实例
export default router
