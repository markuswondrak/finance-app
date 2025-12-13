<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto" variant="flat">
          <v-card-text>
            <v-skeleton-loader v-if="!loaded" type="image" class="mx-auto" />
            <overview-chart v-else :entries="entries" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-skeleton-loader v-if="!loaded" type="heading" class="mx-auto" />
        <current-amount v-else :currentAmount="currentAmount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-skeleton-loader v-if="!loaded" type="table" class="mx-auto" />
        <overview-table v-else :entries="entries" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import OverviewChart from "./OverviewChart.vue";
import CurrentAmount from "./CurrentAmount.vue";
import LoadablePage from "../LoadablePage";
import OverviewTable from "./OverviewTable.vue";

export default {
  mixins: [LoadablePage],
  components: {
    OverviewChart,
    CurrentAmount,
    OverviewTable
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

<style>
</style>