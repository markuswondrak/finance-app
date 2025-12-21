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
          ref="chartRef"
          :loading="loading" 
          :forecast="forecast" 
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <WealthForecastTable
          :loading="loading"
          :forecast="forecast"
          @row-hover="onRowHover"
          @row-leave="onRowLeave"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import WealthConfigPanel from './WealthConfigPanel.vue';
import WealthForecastChart from './WealthForecastChart.vue';
import WealthForecastTable from '@/components/wealth/WealthForecastTable.vue';
import { wealthService } from '@/services/wealthService';

const loading = ref(true);
const forecast = ref(null);
const error = ref(null);
const chartRef = ref(null);

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

const onRowHover = (year) => {
  if (chartRef.value && chartRef.value.highlightYear) {
    chartRef.value.highlightYear(year);
  }
};

const onRowLeave = () => {
  if (chartRef.value && chartRef.value.clearHighlight) {
    chartRef.value.clearHighlight();
  }
};

onMounted(() => {
  fetchForecast();
});
</script>