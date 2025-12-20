import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../components/overview/Overview.vue'
import FixedCosts from '../components/FixedCosts.vue'
import SpecialCosts from '../components/SpecialCosts.vue'
import WealthOverviewPage from '../pages/WealthOverviewPage.vue'
import LandingPage from '../pages/LandingPage.vue'
import { AuthService } from '../services/auth'

const routes = [
  { 
    path: '/', 
    component: LandingPage,
    meta: { hideNavigation: true, guestOnly: true }
  },
  { 
    path: '/overview', 
    component: Overview,
    meta: { requiresAuth: true }
  },
  { 
    path: '/wealth-overview', 
    component: WealthOverviewPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/fixedcosts', 
    component: FixedCosts,
    meta: { requiresAuth: true }
  },
  { 
    path: '/specialcosts', 
    component: SpecialCosts,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const user = await AuthService.getUser();
  const isAuthenticated = !!user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else if (to.meta.guestOnly && isAuthenticated) {
    next('/overview');
  } else {
    next();
  }
});

export default router
