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

// Custom dark theme with finance-focused colors
const financeDark = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#2A2A2A',
    'surface-light': '#333333',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#00B8D4',        // Electric Blue - main accent
    'primary-darken-1': '#0097A7',
    secondary: '#7C4DFF',      // Deep Purple - secondary accent
    'secondary-darken-1': '#651FFF',
    success: '#00C853',        // Green - income/positive
    'success-darken-1': '#00A844',
    warning: '#FFB300',        // Amber - warnings
    error: '#FF5252',          // Red - expense/negative
    'error-darken-1': '#E53935',
    info: '#00B8D4',           // Electric Blue
    'income': '#00E676',       // Bright green for income
    'expense': '#FF5252',      // Red for expenses
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'financeDark',
    themes: {
      financeDark,
    },
  },
  icons: {
    defaultSet: 'fa6',
    sets: {
      fa6,
    },
  },
})