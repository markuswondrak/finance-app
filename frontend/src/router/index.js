import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../components/overview/Overview.vue'
import FixedCosts from '../components/FixedCosts.vue'
import SpecialCosts from '../components/SpecialCosts.vue'

const routes = [
  { path: '/', component: Overview },
  { path: '/fixedcosts', component: FixedCosts },
  { path: '/specialcosts', component: SpecialCosts }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
