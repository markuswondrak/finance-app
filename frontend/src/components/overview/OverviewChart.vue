<template>
  <div class="overview-chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { toCurrency, displayMonth } from "../Utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Theme-aligned chart colors (US2: Financial Trend Color Coding)
const CHART_COLORS = {
  positive: '#4ADE80',           // Mint green for positive trends
  negative: '#F87171',           // Soft coral for negative trends
  neutral: '#9CA3AF',            // Gray for neutral/zero values
  fill: 'rgba(74, 222, 128, 0.2)', // Mint green fill at 20% opacity
  gridLine: '#333333',           // Dark grid lines
  text: '#FFFFFF'                // White axis labels
};

export default {
  components: {
    Line
  },
  props: ["entries"],
  computed: {
    chartData() {
      const labels = [];
      const data = [];
      
      if (this.entries) {
        this.entries.forEach(entry => {
          data.push(entry.currentAmount);
          labels.push(displayMonth(entry.yearMonth));
        });
      }

      return {
        labels,
        datasets: [
          {
            backgroundColor: CHART_COLORS.fill,
            borderColor: CHART_COLORS.positive,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: CHART_COLORS.positive,
            pointBorderColor: CHART_COLORS.positive,
            pointHoverBackgroundColor: CHART_COLORS.positive,
            fill: true,
            tension: 0.3,
            data
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                 return toCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          y: {
             ticks: {
               color: CHART_COLORS.text,
               callback: function(value) {
                 return toCurrency(value);
               }
             },
             grid: {
               color: CHART_COLORS.gridLine
             }
          },
          x: {
             ticks: {
               color: CHART_COLORS.text
             },
             grid: {
               color: CHART_COLORS.gridLine
             }
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.overview-chart-wrapper {
  height: 100%;
  width: 100%;
}
</style>