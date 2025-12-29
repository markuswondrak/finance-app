import './finance.css'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { routes } from './router'
import LoadablePage from './components/common/LoadablePage'
import { toCurrency, displayMonth } from './components/common/Utils'
import { AuthService } from './services/auth'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  ({ app, router, isClient }) => {
    app.component('loadable-page', LoadablePage)

    // Global properties for filters (migration strategy)
    app.config.globalProperties.$filters = {
      currency: toCurrency,
      displayMonth: (yearMonth) => displayMonth(yearMonth),
      displayLongMonth: (yearMonth) => displayMonth(yearMonth, false)
    }

    app.use(vuetify)

    // Only apply auth guards on client side
    if (isClient) {
      router.beforeEach(async (to, from, next) => {
        const user = await AuthService.getUser()
        const isAuthenticated = !!user

        if (to.meta.requiresAuth && !isAuthenticated) {
          next('/')
        } else if (to.meta.guestOnly && isAuthenticated) {
          next('/overview')
        } else {
          next()
        }
      })
    }
  }
)
