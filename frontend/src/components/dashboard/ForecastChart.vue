<template>
  <div class="forecast-chart-container">
    <v-skeleton-loader
      v-if="loading"
      type="image"
      class="forecast-chart-skeleton"
    />
    <div v-else-if="!enhancedChartData" class="forecast-chart-empty d-flex align-center justify-center">
      <span class="text-grey">Keine Daten verfügbar</span>
    </div>
    <Line
      v-else
      :data="enhancedChartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// T001: Chart colors for positive/negative value visualization
const CHART_COLORS = {
  positive: '#4ADE80',      // Mint green for values > 0
  negative: '#F87171',      // Soft coral for values < 0
  neutral: '#9CA3AF',       // Gray for zero values
  zeroLine: 'rgba(255, 255, 255, 0.2)',  // Subtle dashed line
  text: '#FFFFFF'           // Axis label color
}

// T002: Create gradient for fill visualization
function createGradient(ctx, chartArea, color, isPositive) {
  if (!chartArea) return color
  const gradient = ctx.createLinearGradient(
    0,
    isPositive ? chartArea.top : chartArea.bottom,
    0,
    isPositive ? chartArea.bottom : chartArea.top
  )
  // Convert hex to rgba for gradient stops
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  return gradient
}

// T003: Get segment color based on value (positive/negative)
function getSegmentColor(value) {
  if (value > 0) return CHART_COLORS.positive
  if (value < 0) return CHART_COLORS.negative
  return CHART_COLORS.neutral
}

// T016: Create positive gradient (mint green) that fades toward zero line
function createPositiveGradient(ctx) {
  const chart = ctx.chart
  const { ctx: canvasCtx, chartArea } = chart

  // Return fallback color if chart area not yet available
  if (!chartArea) {
    return CHART_COLORS.positive + '80' // Add alpha
  }

  // Create gradient from top (line) to bottom (zero line direction)
  const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  // Convert hex to rgba
  const r = parseInt(CHART_COLORS.positive.slice(1, 3), 16)
  const g = parseInt(CHART_COLORS.positive.slice(3, 5), 16)
  const b = parseInt(CHART_COLORS.positive.slice(5, 7), 16)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`)  // Solid at top
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)    // Transparent toward zero
  return gradient
}

// T017: Create negative gradient (coral) that fades toward zero line
function createNegativeGradient(ctx) {
  const chart = ctx.chart
  const { ctx: canvasCtx, chartArea } = chart

  // Return fallback color if chart area not yet available
  if (!chartArea) {
    return CHART_COLORS.negative + '80' // Add alpha
  }

  // Create gradient from bottom (line) to top (zero line direction)
  const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
  // Convert hex to rgba
  const r = parseInt(CHART_COLORS.negative.slice(1, 3), 16)
  const g = parseInt(CHART_COLORS.negative.slice(3, 5), 16)
  const b = parseInt(CHART_COLORS.negative.slice(5, 7), 16)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`)  // Solid at bottom
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)    // Transparent toward zero
  return gradient
}

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

// T010-T012, T018-T019, T024-T025, T029: Enhanced chart data with segment styling, gradient fills, and prominent line
const enhancedChartData = computed(() => {
  if (!props.data) return null

  return {
    ...props.data,
    datasets: props.data.datasets.map((dataset, index) => {
      // Only apply segment styling to the first dataset (main forecast line)
      if (index === 0) {
        return {
          ...dataset,
          // T024: Prominent line thickness (3px)
          borderWidth: 3,
          // T025: Data point markers
          pointRadius: 4,
          pointHoverRadius: 6,
          // T029: Smooth curve rendering
          tension: 0.3,
          // T010: Segment border color based on y-value
          segment: {
            borderColor: (ctx) => {
              const y1 = ctx.p1.parsed.y
              return getSegmentColor(y1)
            }
          },
          // T011: Point background color matches segment color
          pointBackgroundColor: (ctx) => {
            const value = ctx.parsed?.y ?? 0
            return getSegmentColor(value)
          },
          pointBorderColor: (ctx) => {
            const value = ctx.parsed?.y ?? 0
            return getSegmentColor(value)
          },
          // T018-T019: Fill configuration with gradient functions
          // Gradients are recreated on each render (handles resize automatically)
          fill: {
            target: 'origin',
            above: createPositiveGradient,
            below: createNegativeGradient
          }
        }
      }
      return dataset
    })
  }
})

// T004-T006, T026-T028: Chart options with scales configuration and zero line styling
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 20
  },
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    // T005: X-axis configuration
    x: {
      grid: {
        display: false
      }
    },
    // T006, T026-T028: Y-axis configuration with currency formatting and zero line
    y: {
      ticks: {
        color: CHART_COLORS.text,
        callback: function(value) {
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value)
        }
      },
      grid: {
        // T026: Disable all grid lines (zero line handled via color callback)
        display: false,
        // T027: Show only zero line with zeroLine color
        color: (ctx) => ctx.tick.value === 0 ? CHART_COLORS.zeroLine : 'transparent',
        // T028: Dashed pattern only for zero line
        borderDash: (ctx) => ctx.tick.value === 0 ? [5, 5] : []
      }
    }
  }
}))

// Expose for testing
defineExpose({
  CHART_COLORS,
  createGradient,
  getSegmentColor,
  enhancedChartData,
  createPositiveGradient,
  createNegativeGradient
})
</script>

<style scoped>
.forecast-chart-container {
  aspect-ratio: 21 / 9;
  width: 100%;
  position: relative;
}

.forecast-chart-skeleton {
  height: 100%;
  width: 100%;
}

.forecast-chart-empty {
  height: 100%;
  width: 100%;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
}
</style>
