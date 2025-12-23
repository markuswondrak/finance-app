<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Forecast Chart Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <WealthForecastChart 
          ref="chartRef"
          :loading="loading" 
          :forecast="forecast" 
        />
      </v-col>
    </v-row>

    <!-- Highlight Cards Section -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <BaseHighlightCard
          title="Aktuelles Vermögen"
          :value="formattedCurrentWealth"
          :insight="nextMilestoneInsight"
          :loading="loading"
          variant="success"
          clickable
          @click="showEditWealth = true"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <BaseHighlightCard
          title="Zeithorizont"
          :value="formattedDuration"
          :insight="endPortfolioInsight"
          :loading="loading"
          variant="none"
          clickable
          @click="showEditHorizon = true"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <BaseHighlightCard
          title="Erwartete Rendite"
          :value="formattedReturn"
          :insight="returnSpreadInsight"
          :loading="loading"
          variant="none"
          clickable
          @click="showEditReturn = true"
        />
      </v-col>
    </v-row>

    <!-- Forecast Table Section -->
    <v-row>
      <v-col cols="12">
        <WealthForecastTable
          :loading="loading"
          :forecast="forecast"
          @row-hover="onRowHover"
          @row-leave="onRowLeave"
        />
      </v-col>
    </v-row>

    <!-- Edit Modals -->
    <EditWealthModal
      v-model="showEditWealth"
      :initial-value="profile?.current_wealth || 0"
      @save="updateWealth"
    />
    <EditHorizonModal
      v-model="showEditHorizon"
      :initial-value="profile?.forecast_duration_years || 20"
      @save="updateHorizon"
    />
    <EditReturnModal
      v-model="showEditReturn"
      :initial-worst="profile?.rate_worst_case || 2"
      :initial-average="profile?.rate_average_case || 5"
      :initial-best="profile?.rate_best_case || 8"
      @save="updateReturn"
    />

    <!-- Notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseHighlightCard from '@/components/common/BaseHighlightCard.vue';
import WealthForecastChart from './WealthForecastChart.vue';
import WealthForecastTable from '@/components/wealth/WealthForecastTable.vue';
import EditWealthModal from './EditWealthModal.vue';
import EditHorizonModal from './EditHorizonModal.vue';
import EditReturnModal from './EditReturnModal.vue';
import { wealthService } from '@/services/wealthService';
import { toCurrency } from '@/components/common/Utils';

const loading = ref(true);
const profile = ref(null);
const forecast = ref(null);
const error = ref(null);
const chartRef = ref(null);

// Modal states
const showEditWealth = ref(false);
const showEditHorizon = ref(false);
const showEditReturn = ref(false);

// Notification state
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Formatted values for cards
const formattedCurrentWealth = computed(() => {
  return profile.value ? toCurrency(profile.value.current_wealth) : '—';
});

const formattedDuration = computed(() => {
  return profile.value ? `${profile.value.forecast_duration_years} Jahre` : '—';
});

const formattedReturn = computed(() => {
  return profile.value ? `Ø ${profile.value.rate_average_case}%` : '—';
});

// Insight calculations
const nextMilestoneInsight = computed(() => {
  if (!forecast.value || !forecast.value.points || forecast.value.points.length === 0 || !profile.value) return '';
  
  const current = profile.value.current_wealth;
  const nextMilestone = Math.ceil((current + 1) / 100000) * 100000;
  
  const milestonePoint = forecast.value.points.find(p => p.average >= nextMilestone);
  
  if (milestonePoint) {
    const milestoneLabel = nextMilestone >= 1000000 ? `${(nextMilestone / 1000000).toFixed(1)}M` : `${nextMilestone / 1000}k`;
    return `${milestoneLabel} € in ${milestonePoint.year}`;
  }
  
  return 'Kein Meilenstein erreicht';
});

const endPortfolioInsight = computed(() => {
  if (!forecast.value || !forecast.value.points || forecast.value.points.length === 0) return '';
  
  const lastPoint = forecast.value.points[forecast.value.points.length - 1];
  return `Endwert: ${toCurrency(lastPoint.average)}`;
});

const returnSpreadInsight = computed(() => {
  if (!forecast.value || !forecast.value.points || forecast.value.points.length === 0) return '';
  
  const lastPoint = forecast.value.points[forecast.value.points.length - 1];
  const spread = lastPoint.best - lastPoint.worst;
  return `Abweichung: ±${toCurrency(spread / 2)}`;
});

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [profileData, forecastData] = await Promise.all([
      wealthService.getProfile(),
      wealthService.getForecast()
    ]);
    profile.value = profileData;
    forecast.value = forecastData;
  } catch (err) {
    console.error('Error loading wealth data:', err);
    error.value = 'Fehler beim Laden der Daten.';
  } finally {
    loading.value = false;
  }
};

const saveProfile = async (updatedProfile) => {
  try {
    await wealthService.updateProfile(updatedProfile);
    showNotification('Konfiguration erfolgreich gespeichert.', 'success');
    await loadData();
  } catch (err) {
    console.error('Error saving wealth profile:', err);
    showNotification('Fehler beim Speichern der Konfiguration.', 'error');
  }
};

const updateWealth = async (val) => {
  showEditWealth.value = false;
  await saveProfile({
    ...profile.value,
    current_wealth: val
  });
};

const updateHorizon = async (val) => {
  showEditHorizon.value = false;
  await saveProfile({
    ...profile.value,
    forecast_duration_years: val
  });
};

const updateReturn = async (rates) => {
  showEditReturn.value = false;
  await saveProfile({
    ...profile.value,
    rate_worst_case: rates.worst,
    rate_average_case: rates.average,
    rate_best_case: rates.best
  });
};

const showNotification = (text, color) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
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
  loadData();
});
</script>