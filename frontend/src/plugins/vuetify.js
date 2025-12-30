import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { h } from 'vue'

// Font Awesome 6 iconset for Vuetify 3
const fa6 = {
  component: (props) => {
    const icon = props.icon || ''
    // Support explicit style prefixes (fa-regular, fa-brands)
    const hasStylePrefix = icon.startsWith('fa-regular ') || icon.startsWith('fa-brands ')
    const iconClass = hasStylePrefix ? icon : `fa-solid ${icon}`
    return h('i', {
      class: iconClass,
      'aria-hidden': 'true',
    })
  },
}

// Custom dark theme with finance-focused colors
const financeDark = {
  dark: true,
  colors: {
    // Base dark colors
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#2A2A2A',
    'surface-light': '#333333',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',

    // Primary accents (unchanged)
    primary: '#00B8D4',        // Electric Blue - main accent
    'primary-darken-1': '#0097A7',
    secondary: '#7C4DFF',      // Deep Purple - secondary accent
    'secondary-darken-1': '#651FFF',
    warning: '#FFB300',        // Amber - warnings
    info: '#00B8D4',           // Electric Blue

    // Financial indicator colors (new - WCAG AA compliant)
    positive: '#4ADE80',       // Mint green for income/surplus
    negative: '#F87171',       // Soft coral for expense/deficit
    neutral: '#9CA3AF',        // Gray for zero values

    // Semantic colors (mapped to financial indicators)
    success: '#4ADE80',        // Mint green - alias to positive
    error: '#F87171',          // Soft coral - alias to negative

    // Legacy aliases (for backward compatibility)
    income: '#4ADE80',         // Mint green - alias to positive
    expense: '#F87171',        // Soft coral - alias to negative
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
    aliases: {
      checkboxOn: 'fa-square-check',
      checkboxOff: 'fa-regular fa-square',
      checkboxIndeterminate: 'fa-square-minus',
    },
    sets: {
      fa6,
    },
  },
})