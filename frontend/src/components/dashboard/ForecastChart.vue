<template>
  <div class="forecast-chart-container">
    <v-skeleton-loader
      v-if="loading"
      type="image"
      class="forecast-chart-skeleton"
    />
    <div v-else-if="!data" class="forecast-chart-empty d-flex align-center justify-center">
      <span class="text-grey">Keine Daten verfügbar</span>
    </div>
    <Line
      v-else
      :data="data"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
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

defineProps({
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
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
