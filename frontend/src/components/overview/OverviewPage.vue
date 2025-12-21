<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Hero Chart Section with 21:9 aspect ratio -->
    <v-row class="mb-6">
      <v-col cols="12">
        <ForecastChart :data="chartData" :loading="!loaded" />
      </v-col>
    </v-row>

    <!-- KPI Cards Section -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-skeleton-loader v-if="!loaded" type="image" height="100%" />
        <CurrentBalanceCard 
          v-else 
          :amount="currentAmount" 
          @refresh="loadData" 
        />
      </v-col>
      <v-col cols="12" sm="4">
         <v-skeleton-loader v-if="!loaded" type="list-item-two-line" />
         <MonthlySurplusCard v-else />
      </v-col>
      <v-col cols="12" sm="4">
         <v-skeleton-loader v-if="!loaded" type="list-item-two-line" />
         <LowestPointCard 
           v-else
           :entries="entries"
           :loading="!loaded"
         />
      </v-col>
    </v-row>

    <!-- Overview Table -->
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="!loaded" type="table" class="mx-auto" />
        <overview-table v-else :entries="entries" @refresh="loadData" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import ForecastChart from "./ForecastChart.vue";
import LoadablePage from "../common/LoadablePage";
import OverviewTable from "./OverviewTable.vue";
import CurrentBalanceCard from "./CurrentBalanceCard.vue";
import KPICard from "./KPICard.vue";
import MonthlySurplusCard from "./MonthlySurplusCard.vue";
import LowestPointCard from "./LowestPointCard.vue";
import { toCurrency, displayMonth } from "../common/Utils";

export default {
  mixins: [LoadablePage],
  components: {
    ForecastChart,
    OverviewTable,
    CurrentBalanceCard,
    KPICard,
    MonthlySurplusCard,
    LowestPointCard
  },
  data() {
    return {
      entries: null,
      currentAmount: 0,
      config: { showChart: true },
    };
  },
  computed: {
    showChart() {
      return this.loaded && this.config.showChart;
    },
    chartData() {
      if (!this.entries || this.entries.length === 0) return null;

      const labels = this.entries.map(entry => displayMonth(entry.yearMonth));
      const data = this.entries.map(entry => entry.currentAmount);

      return {
        labels,
        datasets: [
          {
            label: 'Kontostand',
            data,
            // Minimal configuration, ForecastChart handles the rest
            borderColor: '#4ADE80',
            backgroundColor: '#4ADE80',
          }
        ]
      };
    },
    kpiMetrics() {
      if (!this.entries || this.entries.length === 0) {
        return [];
      }

      // Calculate monthly expenses (sum of negative amounts from latest month)
      const latestEntry = this.entries[this.entries.length - 1];
      const previousEntry = this.entries.length > 1 ? this.entries[this.entries.length - 2] : null;

      // Calculate trend for current amount
      let balanceTrend = null;
      if (previousEntry) {
        const change = this.currentAmount - previousEntry.currentAmount;
        const percentage = previousEntry.currentAmount !== 0
          ? Math.abs((change / previousEntry.currentAmount) * 100).toFixed(1)
          : 0;
        balanceTrend = {
          direction: change >= 0 ? 'up' : 'down',
          percentage: parseFloat(percentage)
        };
      }

      // Calculate monthly change
      let monthlyChange = 0;
      let monthlyTrend = null;
      if (latestEntry && previousEntry) {
        monthlyChange = latestEntry.currentAmount - previousEntry.currentAmount;
        monthlyTrend = {
          direction: monthlyChange >= 0 ? 'up' : 'down',
          percentage: 0
        };
      }

      // Calculate average over all entries
      const totalSum = this.entries.reduce((sum, e) => sum + e.currentAmount, 0);
      const average = totalSum / this.entries.length;

      return [
        {
          title: 'Aktueller Kontostand',
          value: toCurrency(this.currentAmount),
          trend: balanceTrend,
          variant: this.currentAmount >= 0 ? 'success' : 'risk'
        },
        {
          title: 'Monatliche Änderung',
          value: toCurrency(monthlyChange),
          trend: monthlyTrend,
          variant: monthlyChange >= 0 ? 'success' : 'risk'
        },
        {
          title: 'Durchschnitt',
          value: toCurrency(average),
          trend: null,
          variant: 'default'
        }
      ];
    }
  },
  created: async function() {
    await this.loadData();

    var storageShowChart = localStorage.getItem("finance-config.showChart");
    this.config.showChart = storageShowChart == "true";
  },
  methods: {
    async loadData() {
        const result = await this.fetchData("/api/overview/all");
        this.entries = result.entries;
        this.currentAmount = result.currentAmount;
    },
    showGraphic: function() {
      this.config.showChart = true;
      localStorage.setItem("finance-config.showChart", "true");
    },
    hideGraphic: function() {
      this.config.showChart = false;
      localStorage.setItem("finance-config.showChart", "false");
    },
  }
};
</script>

<style scoped>
/* Styles removed as they are handled by BaseChart */
</style>