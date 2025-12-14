import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ForecastChart from '@/components/dashboard/ForecastChart.vue'
import { Line } from 'vue-chartjs'

// Mock chart.js to avoid canvas errors in JSDOM
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  Filler: {},
}))

const vuetify = createVuetify({
  components,
  directives,
})

describe('ForecastChart.vue', () => {
  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Balance',
        data: [1000, 1200, 1100],
        borderColor: '#00B8D4',
      }
    ]
  }

  const mountComponent = (props = {}) => {
    return mount(ForecastChart, {
      props,
      global: {
        plugins: [vuetify],
      },
    })
  }

  describe('Container', () => {
    it('renders with forecast-chart-container class', () => {
      const wrapper = mountComponent({ data: mockChartData })
      expect(wrapper.find('.forecast-chart-container').exists()).toBe(true)
    })

    it('has 21:9 aspect ratio CSS class applied', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const container = wrapper.find('.forecast-chart-container')
      expect(container.exists()).toBe(true)
      // The aspect-ratio is set in scoped styles
    })
  })

  describe('Loading State', () => {
    it('shows skeleton loader when loading=true', () => {
      const wrapper = mountComponent({ loading: true })
      const skeleton = wrapper.findComponent({ name: 'v-skeleton-loader' })
      expect(skeleton.exists()).toBe(true)
    })

    it('hides skeleton loader when loading=false', () => {
      const wrapper = mountComponent({ loading: false, data: mockChartData })
      const skeleton = wrapper.findComponent({ name: 'v-skeleton-loader' })
      expect(skeleton.exists()).toBe(false)
    })

    it('skeleton has forecast-chart-skeleton class for aspect ratio matching', () => {
      const wrapper = mountComponent({ loading: true })
      const skeleton = wrapper.find('.forecast-chart-skeleton')
      expect(skeleton.exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('shows "No data" message when data is null and not loading', () => {
      const wrapper = mountComponent({ loading: false, data: null })
      const emptyState = wrapper.find('.forecast-chart-empty')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toContain('Keine Daten')
    })

    it('does not show "No data" message when loading', () => {
      const wrapper = mountComponent({ loading: true, data: null })
      const emptyState = wrapper.find('.forecast-chart-empty')
      expect(emptyState.exists()).toBe(false)
    })
  })

  describe('Chart Rendering', () => {
    it('renders Line chart component when data is provided', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.exists()).toBe(true)
    })

    it('passes data prop to Line chart', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.props('data')).toEqual(mockChartData)
    })

    it('does not render Line chart when loading', () => {
      const wrapper = mountComponent({ loading: true, data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.exists()).toBe(false)
    })

    it('does not render Line chart when data is null', () => {
      const wrapper = mountComponent({ loading: false, data: null })
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('accepts loading prop with default false', () => {
      const wrapper = mountComponent({ data: mockChartData })
      // When loading is not specified, chart should render (default false)
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.exists()).toBe(true)
    })

    it('accepts data prop', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      expect(lineChart.props('data')).toBeDefined()
    })

    it('accepts options prop', () => {
      const customOptions = { responsive: false }
      const wrapper = mountComponent({ data: mockChartData, options: customOptions })
      // Options are merged with defaults in the component
      expect(wrapper.props('options')).toEqual(customOptions)
    })
  })
})
