import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from '@/components/landing/HeroSection.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Mock Chart.js to avoid canvas errors
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  Filler: {}
}))

// Mock vue-chartjs
vi.mock('vue-chartjs', () => ({
  Line: {
    template: '<div class="chart-mock"></div>',
    props: ['data', 'options']
  }
}))

describe('HeroSection.vue', () => {
  const vuetify = createVuetify({ components, directives })

  it('renders the headline', () => {
    const wrapper = mount(HeroSection, {
      global: { plugins: [vuetify] }
    })
    expect(wrapper.text()).toContain('Master Your Tomorrow')
  })

  it('renders placeholder buttons', () => {
    const wrapper = mount(HeroSection, {
      global: { plugins: [vuetify] }
    })
    const buttons = wrapper.findAllComponents({ name: 'VBtn' })
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    expect(buttons[0].text()).toContain('Sign up with Google')
  })
})
