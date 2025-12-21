<template>
  <v-card variant="outlined" :class="['pa-4', 'glass', 'border', `card-accent-${accent}`]" rounded="lg">
    <div class="base-chart-container forecast-chart-container">
      <v-skeleton-loader
        v-if="loading"
        type="image"
        class="base-chart-skeleton forecast-chart-skeleton"
      />
      <div v-else-if="!data" class="base-chart-empty forecast-chart-empty d-flex align-center justify-center">
        <span class="text-grey">Keine Daten verfügbar</span>
      </div>
      <Line
        v-else
        ref="chartRef"
        :data="data"
        :options="mergedOptions"
      />
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'
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
import deepmerge from 'deepmerge'

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

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object, // { labels: [], datasets: [] }
    default: null
  },
  options: {
    type: Object,
    default: () => ({})
  },
  accent: {
    type: String,
    default: 'success'
  }
})

const COLORS = {
  text: '#FFFFFF',
  grid: 'rgba(255, 255, 255, 0.1)'
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  layout: {
    padding: 20
  },
  plugins: {
    legend: {
      display: false // Default to false, can be overridden
    }
  },
  elements: {
    point: {
      radius: 3,
      hoverRadius: 6
    },
    line: {
      borderWidth: 3
    }
  },
  scales: {
    x: {
      grid: {
        color: COLORS.grid,
        display: false
      },
      ticks: {
        color: COLORS.text
      }
    },
    y: {
      grid: {
        color: COLORS.grid,
        borderDash: [5, 5]
      },
      ticks: {
        color: COLORS.text,
        callback: function(value) {
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            compactDisplay: 'short',
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(value)
        }
      }
    }
  }
}

const mergedOptions = computed(() => {
  return deepmerge(defaultOptions, props.options)
})

const chartRef = ref(null)

defineExpose({
  chart: computed(() => chartRef.value?.chart)
})
</script>

<style scoped>
.base-chart-container {
  aspect-ratio: 21 / 9;
  width: 100%;
  position: relative;
  min-height: 300px;
}

.base-chart-skeleton {
  height: 100%;
  width: 100%;
}

.base-chart-empty {
  height: 100%;
  width: 100%;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  min-height: 300px;
}
</style>
