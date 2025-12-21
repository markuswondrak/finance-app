import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FeatureGrid from '@/components/landing/FeatureGrid.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Robust Mock IntersectionObserver as a Class
class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

describe('FeatureGrid.vue', () => {
  const vuetify = createVuetify({ components, directives })

  it('renders three feature cards', () => {
    const wrapper = mount(FeatureGrid, {
      global: { plugins: [vuetify] }
    })
    const cards = wrapper.findAll('.glass-card')
    expect(cards).toHaveLength(3)
  })

  it('renders correct feature titles', () => {
    const wrapper = mount(FeatureGrid, {
      global: { plugins: [vuetify] }
    })
    expect(wrapper.text()).toContain('Smart Forecasting')
    expect(wrapper.text()).toContain('Flexible Cost Tracking')
    expect(wrapper.text()).toContain('Debt Prevention')
  })
})
