<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <WealthConfigPanel @saved="fetchForecast" />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <WealthForecastChart 
          :loading="loading" 
          :forecast="forecast" 
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WealthConfigPanel from '@/components/WealthConfigPanel.vue';
import WealthForecastChart from '@/components/dashboard/WealthForecastChart.vue';
import { wealthService } from '@/services/wealthService';

const loading = ref(true);
const forecast = ref(null);
const error = ref(null);

const fetchForecast = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await wealthService.getForecast();
    forecast.value = data;
  } catch (err) {
    console.error('Error fetching wealth forecast:', err);
    error.value = 'Kein Vermögensprofil konfiguriert oder Fehler beim Laden der Daten.';
    forecast.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchForecast();
});
</script>
