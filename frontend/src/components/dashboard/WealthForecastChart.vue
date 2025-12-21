<template>
  <BaseChart
    :loading="loading"
    :data="chartData"
    :options="chartOptions"
    accent="success"
  />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '@/components/common/BaseChart.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  forecast: {
    type: Object, // Expects { points: [], ... } from API
    default: null
  }
})

// Colors aligned with finance.css and theme
const COLORS = {
  invested: '#E0E0E0', // Neutral
  worst: '#F87171',    // Negative/Error
  average: '#00B8D4',  // Primary/Cyan
  best: '#4ADE80',     // Positive/Success
  text: '#FFFFFF',
  grid: 'rgba(255, 255, 255, 0.1)'
}

// Helper to create simple vertical fade for a color
function createGradient(ctx, color) {
  const chart = ctx.chart
  const { ctx: canvasCtx, chartArea } = chart

  if (!chartArea) return color

  const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.0)`)
  
  return gradient
}

const chartData = computed(() => {
  if (!props.forecast || !props.forecast.points || props.forecast.points.length === 0) return null

  const points = props.forecast.points
  const labels = points.map(p => p.year)

  return {
    labels,
    datasets: [
      {
        label: 'Best Case',
        data: points.map(p => p.best),
        borderColor: COLORS.best,
        backgroundColor: (ctx) => createGradient(ctx, COLORS.best),
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Average Case',
        data: points.map(p => p.average),
        borderColor: COLORS.average,
        backgroundColor: (ctx) => createGradient(ctx, COLORS.average),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Worst Case',
        data: points.map(p => p.worst),
        borderColor: COLORS.worst,
        backgroundColor: (ctx) => createGradient(ctx, COLORS.worst),
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Investiertes Kapital',
        data: points.map(p => p.invested),
        borderColor: COLORS.invested,
        borderDash: [5, 5], // Dashed for baseline
        borderWidth: 2,
        fill: false,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = computed(() => ({
  plugins: {
    legend: {
      display: true,
      labels: {
        color: COLORS.text,
        usePointStyle: true,
        boxWidth: 8
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  }
}))
</script>
