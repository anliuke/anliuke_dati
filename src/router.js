import Vue from 'vue'
import Router from 'vue-router'

// 一级
import Index from './views/Index.vue'
import ModifyPassword from './views/modifyPassword.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'
import Home from './views/Home.vue'

// 二级
// import Games from './views/manage/games.vue'
import Company from './views/manage/company.vue'
import Users from './views/manage/users.vue'
import Subject from './views/manage/subject.vue'
import Subject_detial from './views/manage/subject_detial.vue'

//test
// import SX from './views/sx/HelloDGTable.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes: [
    // 如果是根路径的话，重定向到index路径
    {
      path: '/',
      redirect: '/index'
    },
    // 如果访问index则跳转到index路径
    {
        path: '/index',
        name: '',
        component: Index,
        children: [
            { path: '', component: Home },
            { path: '/home', component: Home, name: 'home' },
            { path: '/company', component: Company, name: '公司管理' },
            // { path: '/games', name: '游戏设置', component: Games },

            //运营管理(operate manage)
            { path: '/users', name: '用户管理', component: Users },
            //账号管理(account manage)
            { path: '/subject', name: '题库管理', component: Subject },
            { path: '/subject_detial', name: '问题详情', component: Subject_detial },
        ]
    },
    // 注册页面
    {
      path: '/modifyPassword',
      name: 'modifyPassword',
      component: ModifyPassword
    },
    // 登陆页面
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // 404
    {
        path: '*',
        name: '404',
        component: NotFound
    }
  ]
})

// 添加路由守卫
// router.beforeEach((to, from, next) => {
    // const isLogin = localStorage.eleToken ? true : false;
    // if (to.path == "/login" || to.path == "/register") {
    //     next();
    // } else {
    //     isLogin ? next() : next("/login");
    // }
    // if (localStorage.getItem('phone')) {
    //   this.$router.push('/company')
    //   next()
    // } else if (to.path == 'login') {
    //     next()
    // }
// })

export default router;
