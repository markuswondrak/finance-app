<template>
  <div style="height: 30em">
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
            backgroundColor: "rgba(0, 184, 212, 0.2)",
            borderColor: "#777777",
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#00B8D4",
            pointBorderColor: "#00E676",
            pointHoverBackgroundColor: "#00E676",
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
               color: "white",
               callback: function(value) {
                 return toCurrency(value);
               }
             }
          },
          x: {
             ticks: {
               color: "white"
             }
          }
        }
      }
    }
  }
};
</script>