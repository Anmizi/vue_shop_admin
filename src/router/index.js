import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome')

// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/Rights')
// import Rights from '../components/power/Rights'
// import Roles from '../components/power/Roles'
const Roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/Roles')

// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Params')

// import List from '../components/goods/List'
const List = () => import(/* webpackChunkName: "list-addgoods-order-report" */ '../components/goods/List')
// import AddGoods from '../components/goods/AddGoods'
const AddGoods = () => import(/* webpackChunkName: "list-addgoods-order-report" */ '../components/goods/AddGoods')
// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName: "list-addgoods-order-report" */ '../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName: "list-addgoods-order-report" */ '../components/report/Report')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
