import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import KPICard from '@/components/dashboard/KPICard.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('KPICard.vue', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '€1,000',
  }

  const mountComponent = (props = {}) => {
    return mount(KPICard, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  describe('Props Rendering', () => {
    it('renders title prop correctly', () => {
      const wrapper = mountComponent({ title: 'Balance' })
      expect(wrapper.find('.kpi-card__title').text()).toBe('Balance')
    })

    it('renders value prop correctly', () => {
      const wrapper = mountComponent({ value: '€5,000' })
      expect(wrapper.find('.kpi-card__value').text()).toBe('€5,000')
    })

    it('renders numeric value prop', () => {
      const wrapper = mountComponent({ value: 1234 })
      expect(wrapper.find('.kpi-card__value').text()).toBe('1234')
    })

    it('renders trend with up direction', () => {
      const wrapper = mountComponent({
        trend: { direction: 'up', percentage: 5.5 }
      })
      const trend = wrapper.find('.kpi-card__trend')
      expect(trend.exists()).toBe(true)
      expect(trend.text()).toContain('5.5%')
    })

    it('renders trend with down direction', () => {
      const wrapper = mountComponent({
        trend: { direction: 'down', percentage: 3.2 }
      })
      const trend = wrapper.find('.kpi-card__trend')
      expect(trend.exists()).toBe(true)
      expect(trend.text()).toContain('3.2%')
    })

    it('does not render trend when not provided', () => {
      const wrapper = mountComponent({ trend: null })
      expect(wrapper.find('.kpi-card__trend').exists()).toBe(false)
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const wrapper = mountComponent({ variant: 'default' })
      expect(wrapper.find('.kpi-card--default').exists()).toBe(true)
    })

    it('applies success variant class', () => {
      const wrapper = mountComponent({ variant: 'success' })
      expect(wrapper.find('.kpi-card--success').exists()).toBe(true)
    })

    it('applies risk variant class', () => {
      const wrapper = mountComponent({ variant: 'risk' })
      expect(wrapper.find('.kpi-card--risk').exists()).toBe(true)
    })

    it('defaults to default variant when not specified', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.kpi-card--default').exists()).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('shows skeleton loader when loading=true', () => {
      const wrapper = mountComponent({ loading: true })
      const skeleton = wrapper.findComponent({ name: 'v-skeleton-loader' })
      expect(skeleton.exists()).toBe(true)
    })

    it('hides content when loading', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.kpi-card__title').exists()).toBe(false)
      expect(wrapper.find('.kpi-card__value').exists()).toBe(false)
    })

    it('shows content when not loading', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.find('.kpi-card__title').exists()).toBe(true)
      expect(wrapper.find('.kpi-card__value').exists()).toBe(true)
    })

    it('applies loading class when loading', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.kpi-card--loading').exists()).toBe(true)
    })
  })

  describe('Dynamic Font Sizing (FR-011)', () => {
    it('uses text-h5 for short values (<=6 chars)', () => {
      const wrapper = mountComponent({ value: '€100' })
      expect(wrapper.find('.kpi-card__value').classes()).toContain('text-h5')
    })

    it('uses text-h6 for medium values (7-10 chars)', () => {
      const wrapper = mountComponent({ value: '€100,000' })
      expect(wrapper.find('.kpi-card__value').classes()).toContain('text-h6')
    })

    it('uses text-subtitle-1 for long values (>10 chars)', () => {
      const wrapper = mountComponent({ value: '€1,000,000.00' })
      expect(wrapper.find('.kpi-card__value').classes()).toContain('text-subtitle-1')
    })

    it('handles numeric values for font sizing', () => {
      const wrapper = mountComponent({ value: 12345678901 })
      expect(wrapper.find('.kpi-card__value').classes()).toContain('text-subtitle-1')
    })
  })

  describe('Trend Icons', () => {
    it('shows arrow-up icon for up trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'up', percentage: 5 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('icon')).toBe('fa-arrow-up')
    })

    it('shows arrow-down icon for down trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'down', percentage: 3 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('icon')).toBe('fa-arrow-down')
    })

    it('shows minus icon for flat trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'flat', percentage: 0 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('icon')).toBe('fa-minus')
    })
  })

  describe('Trend Colors', () => {
    it('applies success color for up trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'up', percentage: 5 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('color')).toBe('success')
    })

    it('applies error color for down trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'down', percentage: 3 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('color')).toBe('error')
    })

    it('applies grey color for flat trend', () => {
      const wrapper = mountComponent({
        trend: { direction: 'flat', percentage: 0 }
      })
      const icon = wrapper.findComponent({ name: 'v-icon' })
      expect(icon.props('color')).toBe('grey')
    })
  })

  describe('Structure', () => {
    it('renders as v-card component', () => {
      const wrapper = mountComponent()
      const card = wrapper.findComponent({ name: 'v-card' })
      expect(card.exists()).toBe(true)
    })

    it('has kpi-card class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.kpi-card').exists()).toBe(true)
    })
  })
})
