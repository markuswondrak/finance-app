<template>
  <v-container fluid class="landing-hero d-flex align-center">
    <v-row align="center" justify="center">
      <!-- Left Column: Content -->
      <v-col cols="12" md="6" class="text-center text-md-left pl-md-16">
        <!-- Made in EU Badge -->
        <v-chip
          color="income"
          variant="outlined"
          class="mb-6 font-weight-bold"
          prepend-icon="fa-globe-europe"
        >
          Made in EU
        </v-chip>

        <!-- Main Headline -->
        <h1 class="text-h2 font-weight-bold mb-4 text-white">
          Deine Finanzen.<br>
          <span class="text-income">Einfach. Klar. Sicher.</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-h6 text-medium-emphasis mb-8" style="max-width: 600px;">
          Übernimm die Kontrolle über dein Vermögen. Die moderne Plattform für deine finanzielle Freiheit.
        </p>

        <!-- Login Button -->
        <div class="d-flex justify-center justify-md-start">
          <v-btn
            color="white"
            variant="tonal"
            size="x-large"
            rounded="xl"
            elevation="0"
            class="text-none font-weight-bold"
            prepend-icon="fa-brands fa-google"
            @click="login"
          >
            Login with Google
          </v-btn>
        </div>
      </v-col>

      <!-- Right Column: Chart -->
      <v-col cols="12" md="6" class="pr-md-16">
        <div class="hero-chart-container">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { AuthService } from '@/services/auth';
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

const login = () => {
  AuthService.login();
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Vermögensentwicklung',
      data: [1200, 1500, 1100, 1800, 2200, 2500],
      borderColor: '#4ADE80',
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.2)');
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#4ADE80',
      borderWidth: 3
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: { 
      display: true,
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.5)' }
    },
    y: { 
      display: true,
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: 'rgba(255,255,255,0.5)' }
    }
  }
}
</script>

<style scoped>
.landing-hero {
  min-height: 80vh;
  background: radial-gradient(circle at top right, rgba(74, 222, 128, 0.05), transparent 40%),
              radial-gradient(circle at bottom left, rgba(74, 222, 128, 0.05), transparent 40%);
}
.hero-chart-container {
  height: 400px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
