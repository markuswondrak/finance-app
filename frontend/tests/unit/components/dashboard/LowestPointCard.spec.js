import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import LowestPointCard from '@/components/dashboard/LowestPointCard.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('LowestPointCard.vue', () => {
  it('imports correctly', () => {
    expect(LowestPointCard).toBeTruthy()
  })

  it('renders loading state', () => {
    const wrapper = mount(LowestPointCard, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: true,
        entries: []
      }
    })
    expect(wrapper.findComponent({ name: 'VSkeletonLoader' }).exists()).toBe(true)
  })

  it('calculates lowestAmount correctly', () => {
    const entries = [
      { currentAmount: 5000, yearMonth: { year: 2025, month: 1 } },
      { currentAmount: 1500, yearMonth: { year: 2025, month: 2 } },
      { currentAmount: 3000, yearMonth: { year: 2025, month: 3 } }
    ]
    const wrapper = mount(LowestPointCard, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: false,
        entries
      }
    })
    
    // Using vm to access computed property directly for unit testing logic
    expect(wrapper.vm.lowestAmount).toBe(1500)
  })

  it('formats amount as currency', () => {
    const entries = [
      { currentAmount: 1500, yearMonth: { year: 2025, month: 1 } }
    ]
    const wrapper = mount(LowestPointCard, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: false,
        entries
      }
    })
    
    // Expecting German format "1.500 €"
    // Note: Non-breaking space might be used by Intl.NumberFormat
    expect(wrapper.vm.formattedAmount).toMatch(/1\.500\s?€/)
  })

  it('determines correct status and variant', async () => {
    const wrapper = mount(LowestPointCard, {
      global: { plugins: [vuetify] },
      props: { loading: false, entries: [] }
    })

    // Positive
    await wrapper.setProps({ entries: [{ currentAmount: 500, yearMonth: { year: 2025, month: 1 } }] })
    expect(wrapper.vm.status).toBe('positive')
    expect(wrapper.vm.variant).toBe('success')

    // Negative
    await wrapper.setProps({ entries: [{ currentAmount: -500, yearMonth: { year: 2025, month: 1 } }] })
    expect(wrapper.vm.status).toBe('negative')
    expect(wrapper.vm.variant).toBe('risk')

    // Neutral (Zero)
    await wrapper.setProps({ entries: [{ currentAmount: 0, yearMonth: { year: 2025, month: 1 } }] })
    expect(wrapper.vm.status).toBe('neutral')
    expect(wrapper.vm.variant).toBe('default')
  })

  it('applies correct CSS classes and shows/hides icon', async () => {
    const wrapper = mount(LowestPointCard, {
      global: { plugins: [vuetify] },
      props: { loading: false, entries: [] }
    })

    // Positive: Green text, no icon
    await wrapper.setProps({ entries: [{ currentAmount: 500, yearMonth: { year: 2025, month: 1 } }] })
    expect(wrapper.find('.text-success').exists()).toBe(true)
    expect(wrapper.find('.v-icon').exists()).toBe(false)
    expect(wrapper.find('.lowest-point-card--success').exists()).toBe(true)

    // Negative: Red text, alert icon
    await wrapper.setProps({ entries: [{ currentAmount: -500, yearMonth: { year: 2025, month: 1 } }] })
    expect(wrapper.find('.text-error').exists()).toBe(true)
    expect(wrapper.find('.v-icon').exists()).toBe(true)
    expect(wrapper.find('.lowest-point-card--risk').exists()).toBe(true)
    
    // Neutral: Grey text (or white), no icon
    await wrapper.setProps({ entries: [{ currentAmount: 0, yearMonth: { year: 2025, month: 1 } }] })
    // Using text-white as per spec/research for neutral/dark theme
    expect(wrapper.find('.text-white').exists()).toBe(true) 
    expect(wrapper.find('.v-icon').exists()).toBe(false)
    expect(wrapper.find('.lowest-point-card--default').exists()).toBe(true)
  })

  it('formats lowest date correctly', () => {
    const entries = [
      { currentAmount: 1500, yearMonth: { year: 2025, month: 8 } }
    ]
    const wrapper = mount(LowestPointCard, {
      global: { plugins: [vuetify] },
      props: { loading: false, entries }
    })
    
    // Expecting German format "im August 2025"
    expect(wrapper.vm.lowestDate).toMatch(/im August 2025/)
  })
})
