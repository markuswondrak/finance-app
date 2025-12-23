import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import BaseHighlightCard from '@/components/common/BaseHighlightCard.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('BaseHighlightCard.vue', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '€1,000',
  }

  const mountComponent = (props = {}) => {
    return mount(BaseHighlightCard, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [vuetify],
      },
    })
  }

  describe('Props Rendering', () => {
    it('renders title prop correctly', () => {
      const wrapper = mountComponent({ title: 'Balance' })
      expect(wrapper.find('.base-highlight-card__title').text()).toBe('Balance')
    })

    it('renders value prop correctly', () => {
      const wrapper = mountComponent({ value: '€5,000' })
      expect(wrapper.find('.base-highlight-card__value').text()).toBe('€5,000')
    })

    it('renders numeric value prop', () => {
      const wrapper = mountComponent({ value: 1234 })
      expect(wrapper.find('.base-highlight-card__value').text()).toBe('1234')
    })

    it('renders trend with up direction', () => {
      const wrapper = mountComponent({
        trend: { direction: 'up', percentage: 5.5 }
      })
      const trend = wrapper.find('.base-highlight-card__trend')
      expect(trend.exists()).toBe(true)
      expect(trend.text()).toContain('5.5%')
    })

    it('renders trend with down direction', () => {
      const wrapper = mountComponent({
        trend: { direction: 'down', percentage: 3.2 }
      })
      const trend = wrapper.find('.base-highlight-card__trend')
      expect(trend.exists()).toBe(true)
      expect(trend.text()).toContain('3.2%')
    })

    it('does not render trend when not provided', () => {
      const wrapper = mountComponent({ trend: null })
      expect(wrapper.find('.base-highlight-card__trend').exists()).toBe(false)
    })
  })

  describe('Variants', () => {
    it('applies default variant class', () => {
      const wrapper = mountComponent({ variant: 'default' })
      expect(wrapper.find('.base-highlight-card--default').exists()).toBe(true)
    })

    it('applies success variant class', () => {
      const wrapper = mountComponent({ variant: 'success' })
      expect(wrapper.find('.base-highlight-card--success').exists()).toBe(true)
    })

    it('applies risk variant class', () => {
      const wrapper = mountComponent({ variant: 'risk' })
      expect(wrapper.find('.base-highlight-card--risk').exists()).toBe(true)
    })

    it('does not apply any color class for none variant', () => {
      const wrapper = mountComponent({ variant: 'none' })
      expect(wrapper.find('.base-highlight-card--default').exists()).toBe(false)
      expect(wrapper.find('.base-highlight-card--success').exists()).toBe(false)
      expect(wrapper.find('.base-highlight-card--risk').exists()).toBe(false)
      expect(wrapper.find('.base-highlight-card--none').exists()).toBe(true)
    })

    it('defaults to default variant when not specified', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.base-highlight-card--default').exists()).toBe(true)
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
      expect(wrapper.find('.base-highlight-card__title').exists()).toBe(false)
      expect(wrapper.find('.base-highlight-card__value').exists()).toBe(false)
    })

    it('shows content when not loading', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.find('.base-highlight-card__title').exists()).toBe(true)
      expect(wrapper.find('.base-highlight-card__value').exists()).toBe(true)
    })

    it('applies loading class when loading', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.base-highlight-card--loading').exists()).toBe(true)
    })
  })

  describe('Dynamic Font Sizing (FR-011)', () => {
    it('uses text-h4 for short values (<=8 chars)', () => {
      const wrapper = mountComponent({ value: '€100' })
      expect(wrapper.find('.base-highlight-card__value').classes()).toContain('text-h4')
    })

    it('uses text-h5 for medium values (9-12 chars)', () => {
      const wrapper = mountComponent({ value: '€100,000.00' })
      expect(wrapper.find('.base-highlight-card__value').classes()).toContain('text-h5')
    })

    it('uses text-h6 for long values (>12 chars)', () => {
      const wrapper = mountComponent({ value: '€1,000,000,000.00' })
      expect(wrapper.find('.base-highlight-card__value').classes()).toContain('text-h6')
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

  describe('Structure', () => {
    it('renders as v-card component', () => {
      const wrapper = mountComponent()
      const card = wrapper.findComponent({ name: 'v-card' })
      expect(card.exists()).toBe(true)
    })

    it('has base-highlight-card class', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.base-highlight-card').exists()).toBe(true)
    })
    
    it('has rounded-xl class', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'v-card' }).props('rounded')).toBe('xl')
    })
    
    it('has elevation 4', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'v-card' }).props('elevation')).toBe(4)
    })
  })

  describe('Interaction', () => {
    it('emits click event when clickable=true', async () => {
      const wrapper = mountComponent({ clickable: true })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('does not emit click event when clickable=false', async () => {
      const wrapper = mountComponent({ clickable: false })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('adds base-highlight-card--clickable class when clickable=true', () => {
      const wrapper = mountComponent({ clickable: true })
      expect(wrapper.classes()).toContain('base-highlight-card--clickable')
    })
  })

  describe('Footer/Insight', () => {
    it('renders insight prop', () => {
      const wrapper = mountComponent({ insight: 'Test Insight' })
      expect(wrapper.text()).toContain('Test Insight')
      expect(wrapper.find('.base-highlight-card__footer').exists()).toBe(true)
    })

    it('renders footer slot', () => {
      const wrapper = mount(BaseHighlightCard, {
        props: { ...defaultProps },
        global: { plugins: [vuetify] },
        slots: {
          footer: '<div class="custom-footer">Custom Footer</div>'
        }
      })
      expect(wrapper.find('.custom-footer').text()).toBe('Custom Footer')
      expect(wrapper.find('.base-highlight-card__footer').exists()).toBe(true)
    })

    it('does not render footer section if no insight or slot', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.base-highlight-card__footer').exists()).toBe(false)
    })
  })
})