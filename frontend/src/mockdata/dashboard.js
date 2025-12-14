/**
 * Mock data for Dashboard components
 * Feature: 003-dashboard-layout
 */

/**
 * Forecast chart data (Chart.js format)
 * Line chart with financial forecast
 */
export const forecastChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Kontostand',
      data: [5000, 4800, 5200, 4900, 5500, 5300, 5800, 6000, 5700, 6200, 6500, 7000],
      borderColor: '#00B8D4',
      backgroundColor: 'rgba(0, 184, 212, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Prognose',
      data: [null, null, null, null, null, null, null, null, null, 6200, 6800, 7500],
      borderColor: '#7C4DFF',
      borderDash: [5, 5],
      fill: false,
      tension: 0.4
    }
  ]
}

/**
 * Chart.js options for forecast chart
 */
export const forecastChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#E0E0E0'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#9CA3AF'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#9CA3AF',
        callback: (value) => `€${value.toLocaleString()}`
      }
    }
  }
}

/**
 * KPI card data
 * Props: title, value, trend, variant
 */
export const kpiMetrics = [
  {
    title: 'Aktueller Kontostand',
    value: '€6,200',
    trend: {
      direction: 'up',
      percentage: 8.5
    },
    variant: 'success'
  },
  {
    title: 'Monatliche Ausgaben',
    value: '€2,450',
    trend: {
      direction: 'down',
      percentage: 3.2
    },
    variant: 'default'
  },
  {
    title: 'Sparquote',
    value: '18%',
    trend: {
      direction: 'up',
      percentage: 2.1
    },
    variant: 'success'
  }
]
