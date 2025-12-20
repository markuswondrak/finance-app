<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <WealthConfigPanel />
      </v-col>
    </v-row>

    <!-- Placeholder for Forecast Chart (T015) -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card variant="outlined" class="pa-6 text-center">
          <v-icon icon="mdi-chart-line" size="large" color="grey"></v-icon>
          <div class="text-h6 text-grey mt-2">Zukünftiger Vermögensverlauf (Coming Soon)</div>
          <div class="text-body-2 text-grey">Konfigurieren Sie oben Ihre Parameter, um die Vorschau zu sehen.</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WealthConfigPanel from '@/components/WealthConfigPanel.vue';

export default {
  name: 'WealthOverviewPage',
  components: {
    WealthConfigPanel,
  },
};
</script>
