import { createRouter, createWebHistory } from 'vue-router'
import QuestionList from '../views/QuestionList.vue'
import QuestionDetail from '../views/QuestionDetail.vue'
import Favorites from '../views/Favorites.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'QuestionList',
    component: QuestionList
  },
  {
    path: '/question/:id',
    name: 'QuestionDetail',
    component: QuestionDetail,
    props: true
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router