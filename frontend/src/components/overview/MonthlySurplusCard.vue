<template>
  <v-card class="mx-auto fill-height" rounded="xl" elevation="4" :class="accentClass">
    <v-card-text class="fill-height">
      <div v-if="loading">
        <v-skeleton-loader type="article" />
      </div>
      <div v-else class="d-flex justify-space-between align-center fill-height">
        <div>
            <div class="text-overline mb-1">
                Monatlicher Überschuss
                <v-tooltip activator="parent" location="bottom">
                    Dies ist der monatliche Überschuss basierend auf Einnahmen minus Fixkosten.
                </v-tooltip>
            </div>
            <div class="text-h4 font-weight-bold" :class="amountClass">
            {{ formattedSurplus }}
            </div>
        </div>
        <div class="sparkline-container">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { statisticsService } from "@/services/statistics";
import { toCurrency } from "../common/Utils";
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

export default {
  name: "MonthlySurplusCard",
  components: { Line },
  data() {
    return {
      loading: true,
      surplus: 0,
      history: [],
    };
  },
  computed: {
    formattedSurplus() {
      return toCurrency(this.surplus);
    },
    amountClass() {
      return this.surplus >= 0 ? "text-positive" : "text-negative";
    },
    accentClass() {
      return this.surplus >= 0 ? "card-accent-success" : "card-accent-error";
    },
    chartData() {
        if (!this.history || this.history.length === 0) return null;
        
        const labels = this.history.map(p => p.month);
        const data = this.history.map(p => p.surplus);
        
        const color = this.surplus >= 0 ? '#4ADE80' : '#F87171'; 

        return {
            labels,
            datasets: [{
                data,
                borderColor: color,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0, 
                pointHoverRadius: 4,
                tension: 0.4, 
                fill: false
            }]
        };
    },
    chartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                title: { display: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            animation: false, 
        };
    }
  },
  async mounted() {
    try {
      const data = await statisticsService.getSurplusStatistics();
      this.surplus = data.current_surplus;
      this.history = data.history;
    } catch (e) {
      console.error("Failed to fetch surplus statistics", e);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.sparkline-container {
    height: 60px;
    width: 120px;
}
</style>