<template>
  <v-container fluid class="landing-hero d-flex align-center">
    <v-row align="center" justify="center">
      <!-- Left Column: Content -->
      <v-col cols="12" md="6" lg="5" class="text-center text-md-left pl-md-16">
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

      <!-- Right Column: 3D Chart Visualization -->
      <v-col cols="12" md="6" lg="6" class="position-relative">
        <div class="chart-3d-container">
          <div class="chart-3d-card glass-card">
            <ClientOnly>
              <Line :data="chartData" :options="chartOptions" class="chart-canvas" />
              <template #placeholder>
                <div class="chart-placeholder" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { AuthService } from '@/services/auth'
import ClientOnly from '@/components/common/ClientOnly.vue'
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

if (!import.meta.env.SSR) {
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
}

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
      pointRadius: 0,
      borderWidth: 3
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false, min: 0 }
  },
  animation: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: 1000,
      from: NaN, // simpler progressive draw
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * 300;
      }
    },
    y: {
      duration: 0 // Immediate Y presence
    }
  }
}
</script>

<style scoped>
.landing-hero {
  min-height: 90vh; /* Increased to match old hero */
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at top right, rgba(74, 222, 128, 0.05), transparent 40%),
              radial-gradient(circle at bottom left, rgba(74, 222, 128, 0.05), transparent 40%);
}

.chart-3d-container {
  perspective: 1000px;
  transform-style: preserve-3d;
  padding: 40px;
}

.chart-3d-card {
  transform: rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease-out;
  border-radius: 16px;
  padding: 20px;
  height: 400px;
  /* glass-card styles are in finance.css, but adding shadow here as in old file */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.chart-3d-container:hover .chart-3d-card {
  transform: rotateY(-5deg) rotateX(2deg) translateY(-10px);
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 960px) {
  .chart-3d-container {
    padding: 20px 0;
    perspective: none;
  }
  .chart-3d-card {
    transform: none !important;
    height: 300px;
  }
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%);
  border-radius: 8px;
}
</style>