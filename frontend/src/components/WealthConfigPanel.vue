<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel class="card-accent-success" rounded="lg">
      <v-expansion-panel-title>
        <v-icon icon="mdi-cog" class="mr-2"></v-icon>
        Vermögens-Einstellungen (Forecast)
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" v-model="isValid" @submit.prevent="saveProfile">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="profile.current_wealth"
                  label="Aktuelles Vermögen (€)"
                  type="number"
                  prefix="€"
                  :rules="wealthRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="profile.forecast_duration_years"
                  label="Vorschau-Zeitraum (Jahre)"
                  type="number"
                  :rules="durationRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <div class="text-subtitle-1 mb-2">Erwartete Rendite (%)</div>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="profile.rate_worst_case"
                  label="Worst Case"
                  type="number"
                  suffix="%"
                  :rules="rateRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="profile.rate_average_case"
                  label="Average Case"
                  type="number"
                  suffix="%"
                  :rules="rateRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="profile.rate_best_case"
                  label="Best Case"
                  type="number"
                  suffix="%"
                  :rules="rateRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-alert
              v-if="!consistencyValid"
              type="error"
              density="compact"
              variant="tonal"
              class="mt-2"
            >
              Logikfehler: Worst Case ≤ Average Case ≤ Best Case einhalten.
            </v-alert>

            <v-row class="mt-4">
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                class="btn-glow-success"
                :loading="loading"
                :disabled="!isValid || !consistencyValid"
                type="submit"
              >
                Speichern
              </v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-expansion-panels>
</template>

<script>
import { wealthService } from '@/services/wealthService';

export default {
  name: 'WealthConfigPanel',
  data: () => ({
    panel: null,
    isValid: false,
    loading: false,
    profile: {
      current_wealth: 0,
      forecast_duration_years: 10,
      rate_worst_case: 3,
      rate_average_case: 5,
      rate_best_case: 7,
    },
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',
    wealthRules: [
      v => v >= 0 || 'Vermögen darf nicht negativ sein',
    ],
    durationRules: [
      v => !!v || 'Dauer ist erforderlich',
      v => (v >= 1 && v <= 100) || 'Dauer muss zwischen 1 und 100 Jahren liegen',
    ],
    rateRules: [
      v => v !== undefined && v !== null || 'Rendite ist erforderlich',
      v => (v >= -20 && v <= 100) || 'Rendite muss zwischen -20% und 100% liegen',
    ],
  }),
  computed: {
    consistencyValid() {
      return (
        this.profile.rate_worst_case <= this.profile.rate_average_case &&
        this.profile.rate_average_case <= this.profile.rate_best_case
      );
    },
  },
  async created() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      this.loading = true;
      try {
        const data = await wealthService.getProfile();
        this.profile = data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveProfile() {
      if (!this.isValid || !this.consistencyValid) return;

      this.loading = true;
      try {
        await wealthService.updateProfile(this.profile);
        this.snackbarText = 'Einstellungen erfolgreich gespeichert';
        this.snackbarColor = 'success';
        this.snackbar = true;
      } catch (error) {
        this.snackbarText = `Fehler: ${error.message}`;
        this.snackbarColor = 'error';
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
