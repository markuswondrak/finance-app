<template>
  <v-container class="savings-calculator py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center mb-8">
        <h2 class="text-h3 font-weight-bold">Sparplan-Rechner</h2>
        <p class="text-body-1 text-medium-emphasis">
          Sieh zu, wie dein Geld wächst.
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="5" lg="4">
        <v-card color="surface" variant="flat" class="pa-6 rounded-xl h-100">
          <!-- Inputs -->
          <v-text-field
            v-model.number="monthlySavings"
            label="Monatliche Sparrate (€)"
            type="number"
            variant="outlined"
            prefix="€"
            class="mb-4"
          ></v-text-field>

          <div class="mb-4">
            <label class="text-caption text-medium-emphasis">Rendite pro Jahr (%)</label>
            <v-slider
              v-model="returnRate"
              min="0"
              max="15"
              step="0.5"
              thumb-label
              color="income"
              hide-details
              class="mt-1"
            >
              <template v-slot:append>
                <v-text-field
                  v-model.number="returnRate"
                  type="number"
                  style="width: 80px"
                  density="compact"
                  hide-details
                  variant="outlined"
                  suffix="%"
                ></v-text-field>
              </template>
            </v-slider>
          </div>

          <div class="mb-4">
            <label class="text-caption text-medium-emphasis">Laufzeit</label>
            <v-btn-toggle
              v-model="years"
              color="income"
              variant="outlined"
              mandatory
              rounded="xl"
              class="d-flex w-100 mt-1"
            >
              <v-btn :value="15" class="flex-grow-1">15 J.</v-btn>
              <v-btn :value="20" class="flex-grow-1">20 J.</v-btn>
              <v-btn :value="25" class="flex-grow-1">25 J.</v-btn>
            </v-btn-toggle>
          </div>

          <!-- Result Display -->
          <div class="mt-8 text-center">
             <div class="text-caption text-medium-emphasis text-uppercase">Erwartetes Vermögen</div>
             <div class="text-h3 font-weight-bold text-income">{{ formattedTotal }}</div>
             <div class="text-caption text-medium-emphasis mt-2">
               Eingezahlt: {{ formattedInvested }} <br>
               Zinseszins: {{ formattedInterest }}
             </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="7" lg="8">
        <v-card color="surface" variant="flat" class="pa-6 rounded-xl h-100 d-flex align-center justify-center">
           <div style="height: 400px; width: 100%;">
             <ClientOnly>
               <Line :data="chartData" :options="chartOptions" />
               <template #placeholder>
                 <div class="chart-placeholder" />
               </template>
             </ClientOnly>
           </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { Line } from 'vue-chartjs'
import ClientOnly from '@/components/common/ClientOnly.vue'

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

const monthlySavings = ref(200);
const returnRate = ref(5.0);
const years = ref(15);

// Calculation Logic
const projection = computed(() => {
  const r = returnRate.value / 100;
  const t = years.value;
  const p = monthlySavings.value;
  
  const dataPoints = [];
  const labels = [];
  
  let currentBalance = 0;
  let totalInvested = 0;

  for (let year = 1; year <= t; year++) {
    // Annual calculation for simplicity in chart points
    // Using monthly compounding formula iteratively for each year
    for(let m=0; m<12; m++) {
        currentBalance = (currentBalance + p) * (1 + r/12);
        totalInvested += p;
    }
    dataPoints.push(currentBalance);
    labels.push(`J${year}`);
  }

  return {
    finalAmount: currentBalance,
    totalInvested: totalInvested,
    dataPoints,
    labels
  };
});

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(projection.value.finalAmount);
});

const formattedInvested = computed(() => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(projection.value.totalInvested);
});

const formattedInterest = computed(() => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(projection.value.finalAmount - projection.value.totalInvested);
});

// Chart Configuration
const chartData = computed(() => ({
  labels: projection.value.labels,
  datasets: [
    {
      label: 'Vermögensentwicklung',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.5)'); // #4ADE80 with opacity
        gradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');
        return gradient;
      },
      borderColor: '#4ADE80', // #4ADE80
      pointBackgroundColor: '#4ADE80',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4ADE80',
      fill: true,
      tension: 0.4, // Smooth curve
      data: projection.value.dataPoints
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
            }
            return label;
        }
      }
    }
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        callback: function(value) {
           return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumSignificantDigits: 3 }).format(value);
        }
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};
</script>

<style scoped>
.savings-calculator {
  background: rgba(0,0,0,0.2);
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 100%);
  border-radius: 8px;
}
</style>