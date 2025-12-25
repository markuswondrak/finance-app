import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LandingPage from '@/components/landing/LandingPage.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import WealthFeature from '@/components/landing/WealthFeature.vue'
import SavingsCalculator from '@/components/landing/SavingsCalculator.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('LandingPage.vue', () => {
  it('renders all landing sections', () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [vuetify],
        stubs: {
          Line: true // Stub Chart.js component
        }
      }
    })

    expect(wrapper.findComponent(LandingHero).exists()).toBe(true)
    expect(wrapper.findComponent(WealthFeature).exists()).toBe(true)
    expect(wrapper.findComponent(SavingsCalculator).exists()).toBe(true)
    expect(wrapper.findComponent(LandingFooter).exists()).toBe(true)
  })
})
