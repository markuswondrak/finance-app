import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import KPISection from '@/components/overview/KPISection.vue'
import KPICard from '@/components/overview/KPICard.vue'

const vuetify = createVuetify({
  components,
  directives,
})

describe('KPISection.vue', () => {
  const mockMetrics = [
    {
      title: 'Balance',
      value: '€5,000',
      trend: { direction: 'up', percentage: 5 },
      variant: 'success'
    },
    {
      title: 'Expenses',
      value: '€1,200',
      trend: { direction: 'down', percentage: 3 },
      variant: 'default'
    },
    {
      title: 'Savings',
      value: '15%',
      trend: { direction: 'up', percentage: 2 },
      variant: 'success'
    }
  ]

  const mountComponent = (props = {}) => {
    return mount(KPISection, {
      props,
      global: {
        plugins: [vuetify],
      },
    })
  }

  describe('Responsive Grid', () => {
    it('renders v-row container', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const row = wrapper.findComponent({ name: 'v-row' })
      expect(row.exists()).toBe(true)
    })

    it('renders exactly 3 v-col elements', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cols = wrapper.findAllComponents({ name: 'v-col' })
      expect(cols).toHaveLength(3)
    })

    it('applies cols="12" for mobile (full width)', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cols = wrapper.findAllComponents({ name: 'v-col' })
      cols.forEach(col => {
        expect(col.props('cols')).toBe('12')
      })
    })

    it('applies sm="4" for tablet/desktop (3-column)', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cols = wrapper.findAllComponents({ name: 'v-col' })
      cols.forEach(col => {
        expect(col.props('sm')).toBe('4')
      })
    })
  })

  describe('Metrics Rendering', () => {
    it('renders 3 KPICard components', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cards = wrapper.findAllComponents(KPICard)
      expect(cards).toHaveLength(3)
    })

    it('passes correct props to each KPICard', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cards = wrapper.findAllComponents(KPICard)

      expect(cards[0].props('title')).toBe('Balance')
      expect(cards[0].props('value')).toBe('€5,000')
      expect(cards[0].props('variant')).toBe('success')

      expect(cards[1].props('title')).toBe('Expenses')
      expect(cards[1].props('value')).toBe('€1,200')

      expect(cards[2].props('title')).toBe('Savings')
      expect(cards[2].props('value')).toBe('15%')
    })

    it('passes trend data to KPICard', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cards = wrapper.findAllComponents(KPICard)

      expect(cards[0].props('trend')).toEqual({ direction: 'up', percentage: 5 })
    })
  })

  describe('Placeholder Behavior', () => {
    it('renders 3 slots even with empty metrics array', () => {
      const wrapper = mountComponent({ metrics: [] })
      const cards = wrapper.findAllComponents(KPICard)
      expect(cards).toHaveLength(3)
    })

    it('uses placeholder data for missing metrics', () => {
      const wrapper = mountComponent({ metrics: [] })
      const cards = wrapper.findAllComponents(KPICard)

      // All should have placeholder values
      cards.forEach(card => {
        expect(card.props('title')).toBe('—')
        expect(card.props('value')).toBe('—')
        expect(card.props('trend')).toBeNull()
        expect(card.props('variant')).toBe('default')
      })
    })

    it('fills remaining slots when fewer than 3 metrics provided', () => {
      const wrapper = mountComponent({
        metrics: [{ title: 'Only One', value: '€100', variant: 'default' }]
      })
      const cards = wrapper.findAllComponents(KPICard)

      expect(cards).toHaveLength(3)
      expect(cards[0].props('title')).toBe('Only One')
      expect(cards[1].props('title')).toBe('—')
      expect(cards[2].props('title')).toBe('—')
    })
  })

  describe('Loading State', () => {
    it('passes loading=true to all KPICards when loading', () => {
      const wrapper = mountComponent({ metrics: mockMetrics, loading: true })
      const cards = wrapper.findAllComponents(KPICard)

      cards.forEach(card => {
        expect(card.props('loading')).toBe(true)
      })
    })

    it('passes loading=false to all KPICards when not loading', () => {
      const wrapper = mountComponent({ metrics: mockMetrics, loading: false })
      const cards = wrapper.findAllComponents(KPICard)

      cards.forEach(card => {
        expect(card.props('loading')).toBe(false)
      })
    })

    it('defaults loading to false', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cards = wrapper.findAllComponents(KPICard)

      cards.forEach(card => {
        expect(card.props('loading')).toBe(false)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined metrics prop', () => {
      const wrapper = mountComponent({})
      const cards = wrapper.findAllComponents(KPICard)
      expect(cards).toHaveLength(3)
    })

    it('handles more than 3 metrics (only renders first 3)', () => {
      const extraMetrics = [
        ...mockMetrics,
        { title: 'Extra', value: '€999', variant: 'default' }
      ]
      const wrapper = mountComponent({ metrics: extraMetrics })
      const cards = wrapper.findAllComponents(KPICard)

      // displayMetrics computed only returns 3
      expect(cards).toHaveLength(3)
      // The fourth metric should not be rendered
      const titles = cards.map(c => c.props('title'))
      expect(titles).not.toContain('Extra')
    })
  })

  describe('Grid Classes (Breakpoint Verification)', () => {
    it('columns have correct responsive classes for stacking (mobile) and row (tablet+)', () => {
      const wrapper = mountComponent({ metrics: mockMetrics })
      const cols = wrapper.findAllComponents({ name: 'v-col' })

      // Each col should have cols="12" (full width mobile) and sm="4" (1/3 width on sm+)
      cols.forEach(col => {
        expect(col.props('cols')).toBe('12')
        expect(col.props('sm')).toBe('4')
      })
    })
  })
})
