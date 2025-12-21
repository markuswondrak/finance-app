import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import WealthForecastChart from '@/components/dashboard/WealthForecastChart.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

// Mock Chart.js components to avoid canvas rendering issues in tests
vi.mock('vue-chartjs', () => ({
  Line: {
    name: 'Line',
    template: '<div class="mock-chart"></div>',
    props: ['data', 'options']
  }
}))

describe('WealthForecastChart.vue', () => {
  it('renders loading state correctly', () => {
    const wrapper = mount(WealthForecastChart, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: true,
        forecast: null
      }
    })

    expect(wrapper.find('.forecast-chart-skeleton').exists()).toBe(true)
    expect(wrapper.find('.forecast-chart-empty').exists()).toBe(false)
  })

  it('renders empty state when no data provided', () => {
    const wrapper = mount(WealthForecastChart, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: false,
        forecast: null
      }
    })

    expect(wrapper.find('.forecast-chart-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('Keine Daten verfügbar')
  })

  it('renders chart when data is provided', () => {
    const mockForecast = {
      points: [
        { year: 2024, invested: 1000, worst: 1050, average: 1100, best: 1150 },
        { year: 2025, invested: 2000, worst: 2100, average: 2200, best: 2300 }
      ]
    }

    const wrapper = mount(WealthForecastChart, {
      global: {
        plugins: [vuetify]
      },
      props: {
        loading: false,
        forecast: mockForecast
      }
    })

    expect(wrapper.find('.forecast-chart-skeleton').exists()).toBe(false)
    expect(wrapper.find('.forecast-chart-empty').exists()).toBe(false)
    // We mocked Line, so we check if the mock exists or if the container renders the component
    // Since we mocked Line as a component with class mock-chart (if we did full mount)
    // But let's check if the Line component is passed the correct data
    const lineComponent = wrapper.findComponent({ name: 'Line' })
    expect(lineComponent.exists()).toBe(true)
    
    const passedData = lineComponent.props('data')
    expect(passedData.labels).toEqual([2024, 2025])
    expect(passedData.datasets.length).toBe(4)
    expect(passedData.datasets[0].label).toBe('Best Case')
    expect(passedData.datasets[0].data).toEqual([1150, 2300])
    expect(passedData.datasets[0].pointRadius).toBe(3)
  })
})
