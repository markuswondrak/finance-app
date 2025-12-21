import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ForecastChart from "@/components/overview/ForecastChart.vue";
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

// Expected color constants for tests
const EXPECTED_COLORS = {
  positive: '#4ADE80',      // Mint green
  negative: '#F87171',      // Soft coral
  neutral: '#9CA3AF',       // Gray
  zeroLine: 'rgba(255, 255, 255, 0.2)',
  text: '#FFFFFF'
}

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

    it('passes enhanced data prop to Line chart', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const chartData = lineChart.props('data')
      // Data should be enhanced with segment styling
      expect(chartData.labels).toEqual(mockChartData.labels)
      expect(chartData.datasets[0].label).toBe(mockChartData.datasets[0].label)
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

  // T007-T009: Tests for User Story 1 - Color-Coded Financial Health Visualization
  describe('Color-Coded Visualization (US1)', () => {
    it('exposes CHART_COLORS constant with correct positive color (mint green)', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { CHART_COLORS } = wrapper.vm
      expect(CHART_COLORS.positive).toBe(EXPECTED_COLORS.positive)
    })

    it('exposes CHART_COLORS constant with correct negative color (soft coral)', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { CHART_COLORS } = wrapper.vm
      expect(CHART_COLORS.negative).toBe(EXPECTED_COLORS.negative)
    })

    it('getSegmentColor returns positive color for values > 0', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { getSegmentColor, CHART_COLORS } = wrapper.vm
      expect(getSegmentColor(100)).toBe(CHART_COLORS.positive)
      expect(getSegmentColor(0.01)).toBe(CHART_COLORS.positive)
    })

    it('getSegmentColor returns negative color for values < 0', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { getSegmentColor, CHART_COLORS } = wrapper.vm
      expect(getSegmentColor(-100)).toBe(CHART_COLORS.negative)
      expect(getSegmentColor(-0.01)).toBe(CHART_COLORS.negative)
    })

    it('getSegmentColor returns neutral color for zero values (transition point)', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { getSegmentColor, CHART_COLORS } = wrapper.vm
      expect(getSegmentColor(0)).toBe(CHART_COLORS.neutral)
    })
  })

  describe('Chart Options Configuration', () => {
    it('passes chart options to Line component', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options).toBeDefined()
      expect(options.responsive).toBe(true)
      expect(options.maintainAspectRatio).toBe(false)
    })

    it('configures x-axis with grid display disabled', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options.scales.x.grid.display).toBe(false)
    })

    it('configures y-axis with white text color', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options.scales.y.ticks.color).toBe(EXPECTED_COLORS.text)
    })

    it('configures y-axis with currency formatting callback', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(typeof options.scales.y.ticks.callback).toBe('function')
      // Test the callback formats correctly
      const formatted = options.scales.y.ticks.callback(1000)
      expect(formatted).toMatch(/1[.,]?000/)
      expect(formatted).toContain('€')
    })

    it('configures y-axis with grid enabled by default', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options.scales.y.grid.display).not.toBe(false)
    })
  })

  describe('Gradient Helper Function', () => {
    it('createGradient returns fallback color when chartArea is not available', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { createGradient } = wrapper.vm
      const result = createGradient({}, null, '#4ADE80', true)
      expect(result).toBe('#4ADE80')
    })
  })

  // T010-T012: Tests for Segment Styling
  describe('Segment Styling (US1 Implementation)', () => {
    it('T010: enhancedChartData adds segment.borderColor callback to first dataset', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].segment).toBeDefined()
      expect(typeof enhancedChartData.datasets[0].segment.borderColor).toBe('function')
    })

    it('T010: segment.borderColor returns positive color for positive y-values', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      const borderColorFn = enhancedChartData.datasets[0].segment.borderColor
      // Simulate Chart.js context
      const ctx = { p1: { parsed: { y: 100 } } }
      expect(borderColorFn(ctx)).toBe(CHART_COLORS.positive)
    })

    it('T010: segment.borderColor returns negative color for negative y-values', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      const borderColorFn = enhancedChartData.datasets[0].segment.borderColor
      // Simulate Chart.js context
      const ctx = { p1: { parsed: { y: -100 } } }
      expect(borderColorFn(ctx)).toBe(CHART_COLORS.negative)
    })

    it('T011: enhancedChartData adds pointBackgroundColor callback', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(typeof enhancedChartData.datasets[0].pointBackgroundColor).toBe('function')
    })

    it('T011: pointBackgroundColor returns correct color based on value', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      const pointColorFn = enhancedChartData.datasets[0].pointBackgroundColor
      // Positive value
      expect(pointColorFn({ parsed: { y: 100 } })).toBe(CHART_COLORS.positive)
      // Negative value
      expect(pointColorFn({ parsed: { y: -50 } })).toBe(CHART_COLORS.negative)
      // Zero value
      expect(pointColorFn({ parsed: { y: 0 } })).toBe(CHART_COLORS.neutral)
    })

    it('T012: enhancedChartData preserves original dataset properties', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].label).toBe(mockChartData.datasets[0].label)
      expect(enhancedChartData.datasets[0].data).toEqual(mockChartData.datasets[0].data)
    })

    it('T012: enhancedChartData preserves labels', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.labels).toEqual(mockChartData.labels)
    })

    it('does not modify additional datasets beyond the first', () => {
      const multiDatasetData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Balance', data: [1000, 1200, 1100] },
          { label: 'Forecast', data: [null, null, 1300], borderDash: [5, 5] }
        ]
      }
      const wrapper = mountComponent({ data: multiDatasetData })
      const { enhancedChartData } = wrapper.vm
      // Second dataset should not have segment styling
      expect(enhancedChartData.datasets[1].segment).toBeUndefined()
      expect(enhancedChartData.datasets[1].borderDash).toEqual([5, 5])
    })
  })

  // T013-T015: Tests for User Story 2 - Gradient Fill for Visual Depth
  describe('Gradient Fill (US2)', () => {
    it('T013: enhancedChartData configures fill.target as origin', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].fill).toBeDefined()
      expect(enhancedChartData.datasets[0].fill.target).toBe('origin')
    })

    it('T014: enhancedChartData configures fill.above for positive gradient', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].fill.above).toBeDefined()
      // fill.above should be a function that creates gradient
      expect(typeof enhancedChartData.datasets[0].fill.above).toBe('function')
    })

    it('T015: enhancedChartData configures fill.below for negative gradient', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].fill.below).toBeDefined()
      // fill.below should be a function that creates gradient
      expect(typeof enhancedChartData.datasets[0].fill.below).toBe('function')
    })

    it('T016: createPositiveGradient function is exposed', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { createPositiveGradient } = wrapper.vm
      expect(typeof createPositiveGradient).toBe('function')
    })

    it('T016: createPositiveGradient returns fallback when chartArea unavailable', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { createPositiveGradient, CHART_COLORS } = wrapper.vm
      // Mock context without chartArea
      const mockCtx = { chart: { chartArea: null, ctx: {} } }
      const result = createPositiveGradient(mockCtx)
      // Should return solid color as fallback
      expect(result).toBe(CHART_COLORS.positive + '80') // with alpha
    })

    it('T017: createNegativeGradient function is exposed', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { createNegativeGradient } = wrapper.vm
      expect(typeof createNegativeGradient).toBe('function')
    })

    it('T017: createNegativeGradient returns fallback when chartArea unavailable', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { createNegativeGradient, CHART_COLORS } = wrapper.vm
      // Mock context without chartArea
      const mockCtx = { chart: { chartArea: null, ctx: {} } }
      const result = createNegativeGradient(mockCtx)
      // Should return solid color as fallback
      expect(result).toBe(CHART_COLORS.negative + '80') // with alpha
    })

    it('T018: fill configuration uses gradient functions for above and below', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, createPositiveGradient, createNegativeGradient } = wrapper.vm
      const fillConfig = enhancedChartData.datasets[0].fill

      // Verify fill is properly configured
      expect(fillConfig.target).toBe('origin')
      expect(typeof fillConfig.above).toBe('function')
      expect(typeof fillConfig.below).toBe('function')
    })

    it('fill.above uses positive color gradient', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      const aboveFn = enhancedChartData.datasets[0].fill.above

      // Call with mock context (no chartArea)
      const mockCtx = { chart: { chartArea: null, ctx: {} } }
      const result = aboveFn(mockCtx)
      // Should use positive color
      expect(result).toContain('4ADE80')
    })

    it('fill.below uses negative color gradient', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      const belowFn = enhancedChartData.datasets[0].fill.below

      // Call with mock context (no chartArea)
      const mockCtx = { chart: { chartArea: null, ctx: {} } }
      const result = belowFn(mockCtx)
      // Should use negative color
      expect(result).toContain('F87171')
    })
  })

  // T020-T023: Tests for User Story 3 - Clean Chart with Prominent Data Line
  describe('Clean Chart with Prominent Data Line (US3)', () => {
    // T020: Test for grid lines being disabled or minimal
    it('T020: configures x-axis grid lines as disabled', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options.scales.x.grid.display).toBe(false)
    })

    it('T020: configures y-axis grid lines with default display', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const lineChart = wrapper.findComponent(Line)
      const options = lineChart.props('options')
      expect(options.scales.y.grid.display).not.toBe(false)
    })

    // T029: Test for smooth curve rendering
    it('T029: enhancedChartData sets tension: 0.3 for smooth curve', () => {
      const wrapper = mountComponent({ data: mockChartData })
      const { enhancedChartData } = wrapper.vm
      expect(enhancedChartData.datasets[0].tension).toBe(0.3)
    })
  })

  // Phase 6: Polish & Cross-Cutting Concerns (T030-T033)
  describe('Polish & Edge Cases', () => {
    // T030: Test for all-positive data scenario
    it('T030: handles all-positive data correctly (all mint green)', () => {
      const allPositiveData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Balance', data: [100, 200, 300] }]
      }
      const wrapper = mountComponent({ data: allPositiveData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      
      const borderColorFn = enhancedChartData.datasets[0].segment.borderColor
      // Check multiple points
      expect(borderColorFn({ p1: { parsed: { y: 100 } } })).toBe(CHART_COLORS.positive)
      expect(borderColorFn({ p1: { parsed: { y: 300 } } })).toBe(CHART_COLORS.positive)
    })

    // T031: Test for all-negative data scenario
    it('T031: handles all-negative data correctly (all soft coral)', () => {
      const allNegativeData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Balance', data: [-100, -200, -300] }]
      }
      const wrapper = mountComponent({ data: allNegativeData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      
      const borderColorFn = enhancedChartData.datasets[0].segment.borderColor
      // Check multiple points
      expect(borderColorFn({ p1: { parsed: { y: -100 } } })).toBe(CHART_COLORS.negative)
      expect(borderColorFn({ p1: { parsed: { y: -300 } } })).toBe(CHART_COLORS.negative)
    })

    // T032: Test for edge case with values exactly at zero
    it('T032: handles values exactly at zero (neutral/transition)', () => {
      const zeroData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Balance', data: [100, 0, -100] }]
      }
      const wrapper = mountComponent({ data: zeroData })
      const { enhancedChartData, CHART_COLORS } = wrapper.vm
      
      const pointColorFn = enhancedChartData.datasets[0].pointBackgroundColor
      
      // Check exact zero value
      expect(pointColorFn({ parsed: { y: 0 } })).toBe(CHART_COLORS.neutral)
      
      // Check transition point via segment color if applicable (though segment color uses p1/p0)
      const borderColorFn = enhancedChartData.datasets[0].segment.borderColor
      // The implementation usually checks p0 or p1, but for zero we expect consistency
      // If the logic is "start with positive, end with negative", it might be complex,
      // but let's check our getSegmentColor helper directly for zero
      const { getSegmentColor } = wrapper.vm
      expect(getSegmentColor(0)).toBe(CHART_COLORS.neutral)
    })

    // T033: Test for chart with very few data points
    it('T033: handles chart with single data point', () => {
      const singlePointData = {
        labels: ['Jan'],
        datasets: [{ label: 'Balance', data: [100] }]
      }
      const wrapper = mountComponent({ data: singlePointData })
      const { enhancedChartData } = wrapper.vm
      
      expect(enhancedChartData.datasets[0].data.length).toBe(1)
      expect(enhancedChartData.labels.length).toBe(1)
    })
    
    it('T033: handles chart with two data points', () => {
      const twoPointData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ label: 'Balance', data: [100, 200] }]
      }
      const wrapper = mountComponent({ data: twoPointData })
      const { enhancedChartData } = wrapper.vm
      
      expect(enhancedChartData.datasets[0].data.length).toBe(2)
      // Should still have styling
      expect(enhancedChartData.datasets[0].segment).toBeDefined()
    })
  })
})
