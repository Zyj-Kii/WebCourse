import Vue from 'vue'
import Router from 'vue-router'
import Home from 'pages/home/Home'
import BasicStudentCheck from 'pages/student/BasicStudentCheck'
import CourseList from 'pages/course/CourseList'
import BaseAccount from 'pages/account/BaseAccount'
import Login from 'pages/account/Login'
import ModifyPassword from 'pages/account/ModifyPassword'
import BasicTeacherCheck from 'pages/teacher/BasicTeacherCheck'
import DepartmentStudentSource from 'pages/department/StudentSource'
import DepartmentStudentGender from 'pages/department/StudentGender'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {requiresAuth: true},
      children: [
        {
          path: 'basic/student/check',
          name: 'basicStudentCheck',
          component: BasicStudentCheck
        },
        {
          path: 'basic/teacher/check',
          name: 'basicTeacherCheck',
          component: BasicTeacherCheck
        },
        {
          path: 'basic/course/list',
          name: 'basicCourseList',
          component: CourseList
        },
        {
          path: 'summary/department/student/source',
          name: 'summaryDepartmentStudentSource',
          component: DepartmentStudentSource
        },
        {
          path: '/summary/department/student/gender',
          name: 'summaryDepartmentStudentSource',
          component: DepartmentStudentGender
        }
      ]
    },
    {
      path: '/account',
      name: 'Account',
      component: BaseAccount,
      children: [
        {
          path: 'signin',
          name: 'Login',
          component: Login,
          alias: 'signup'
        },
        {
          path: 'modify',
          name: 'ModifyPassword',
          component: ModifyPassword,
          meta: {requiresAuth: true}
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!sessionStorage.admin) {
      Vue.prototype.$errorToast('请先登录')
      setTimeout(() => {
        next({
          path: '/account/signin'
        })
      }, 1500)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
