import VueRouter from '../src/index'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home'
    },
    {
      path: '/about',
      name: 'about'
    },
    {
      path: '/contact',
      name: 'contact'
    }
  ]
})