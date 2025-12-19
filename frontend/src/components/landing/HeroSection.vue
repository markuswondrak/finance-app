<template>
  <v-container fluid class="hero-section fill-height">
    <v-row align="center" justify="center">
      <!-- Left Column: Content -->
      <v-col cols="12" md="6" lg="5" class="text-center text-md-left pl-md-16">
        <h1 class="text-h3 text-sm-h2 text-lg-h1 font-weight-bold mb-4">
          Master Your Tomorrow, <br />
          <span class="text-success">Starting Today.</span>
        </h1>
        <p class="text-h6 text-medium-emphasis mb-8 font-weight-light">
          Stop guessing. Start knowing. Track your costs, forecast your balance, and build a future-proof budget with Finanz-App.
        </p>
        
        <div class="d-flex flex-column flex-sm-row gap-4 justify-center justify-md-start">
          <v-btn
            size="x-large"
            color="white"
            variant="flat"
            prepend-icon="fa-brands fa-google"
            class="text-none mb-4 mb-sm-0 mr-sm-4"
            @click="login"
          >
            Sign up with Google
          </v-btn>
          <v-btn
            size="x-large"
            color="white"
            variant="outlined"
            prepend-icon="fa-brands fa-google"
            class="text-none"
            @click="login"
          >
            Log in with Google
          </v-btn>
        </div>
      </v-col>

      <!-- Right Column: 3D Chart Visualization -->
      <v-col cols="12" md="6" lg="6" class="position-relative">
        <div class="chart-3d-container">
          <div class="chart-3d-card glass-card">
            <Line :data="chartData" :options="chartOptions" class="chart-canvas" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { AuthService } from '@/services/auth'
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
  AuthService.login()
}

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Projected Balance',
      data: [1200, 1500, 1100, 1800, 2200, 2500],
      borderColor: '#2ecc71',
      backgroundColor: (ctx) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(46, 204, 113, 0.2)');
        gradient.addColorStop(1, 'rgba(46, 204, 113, 0)');
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
    tooltip: { enabled: false } // Purely visual
  },
  scales: {
    x: { display: false },
    y: { display: false, min: 0 }
  },
  animation: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: 2000,
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
.hero-section {
  min-height: 90vh; /* Nearly full viewport */
  position: relative;
  overflow: hidden;
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
</style>