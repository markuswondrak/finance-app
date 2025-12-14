<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Hero Chart Section with 21:9 aspect ratio -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="mx-auto gradient-dark card-accent-primary" rounded="xl" elevation="4">
          <v-card-text class="pa-0">
            <div class="chart-container">
              <v-skeleton-loader v-if="!loaded" type="image" class="chart-skeleton" />
              <overview-chart v-else :entries="entries" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- KPI Cards Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <KPISection :metrics="kpiMetrics" :loading="!loaded" />
      </v-col>
    </v-row>

    <!-- Overview Table -->
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="!loaded" type="table" class="mx-auto" />
        <overview-table v-else :entries="entries" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import OverviewChart from "./OverviewChart.vue";
import LoadablePage from "../LoadablePage";
import OverviewTable from "./OverviewTable.vue";
import KPISection from "../dashboard/KPISection.vue";
import { toCurrency } from "../Utils";

export default {
  mixins: [LoadablePage],
  components: {
    OverviewChart,
    OverviewTable,
    KPISection
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
    const result = await this.fetchData("/api/overview/all");

    var storageShowChart = localStorage.getItem("finance-config.showChart");
    this.config.showChart = storageShowChart == "true";

    this.entries = result.entries;
    this.currentAmount = result.currentAmount;
  },
  methods: {
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
.chart-container {
  aspect-ratio: 21 / 9;
  width: 100%;
  position: relative;
}

.chart-skeleton {
  height: 100%;
  width: 100%;
}
</style>