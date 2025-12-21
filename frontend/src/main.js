import './finance.css'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import LoadablePage from './components/common/LoadablePage'
import { toCurrency, displayMonth } from './components/common/Utils' 

const app = createApp(App)

app.component('loadable-page', LoadablePage)

// Global properties for filters (migration strategy)
app.config.globalProperties.$filters = {
  currency: toCurrency,
  displayMonth: (yearMonth) => displayMonth(yearMonth),
  displayLongMonth: (yearMonth) => displayMonth(yearMonth, false)
}

app.use(vuetify)
app.use(router)

app.mount('#app')