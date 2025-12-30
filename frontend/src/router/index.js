import Overview from '../components/overview/OverviewPage.vue'
import FixedCosts from '../components/fixedcosts/FixedCostsPage.vue'
import SpecialCosts from '../components/SpecialCostsPage.vue'
import WealthOverviewPage from '../components/wealth/WealthOverviewPage.vue'
import SaveToSpendPage from '../components/spend/SaveToSpendPage.vue'
import UserSettingsPage from '../components/settings/UserSettingsPage.vue'
import LandingPage from '../components/landing/LandingPage.vue'
import InviteLandingPage from '../components/settings/InviteLandingPage.vue'
import HelpPage from '../components/help/HelpPage.vue'

export const routes = [
  {
    path: '/',
    component: LandingPage,
    meta: { hideNavigation: true, guestOnly: true }
  },
  {
    path: '/invite/:token',
    component: InviteLandingPage,
    meta: { hideNavigation: true }
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
    path: '/save-to-spend',
    component: SaveToSpendPage,
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
  },
  {
    path: '/settings',
    component: UserSettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    component: HelpPage,
    meta: { requiresAuth: true }
  }
]
