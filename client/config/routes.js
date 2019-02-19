const App = () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue')
const Login = () => import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
export default [
  {
    path: '/',
    component: App
  },
  {
    path: '/login',
    component: Login
  }
]
