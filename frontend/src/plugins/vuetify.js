import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { h } from 'vue'

// Font Awesome 6 iconset for Vuetify 3
const fa6 = {
  component: (props) => h('i', {
    class: `fa-solid ${props.icon}`,
    'aria-hidden': 'true',
  }),
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    defaultSet: 'fa6',
    sets: {
      fa6,
    },
  },
})