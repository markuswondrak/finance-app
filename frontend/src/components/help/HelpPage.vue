<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" lg="6" class="mx-auto">
        <h1 class="text-h4 mb-6">Hilfe</h1>

        <v-card elevation="2" class="mb-6">
          <v-card-title class="pa-4">Anleitung</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <p class="text-body-1 mb-4">
              Erfahre, wie du die Finanz-App optimal nutzt. Die Anleitung zeigt dir alle wichtigen Funktionen und wie du sie verwendest.
            </p>
            <v-btn
              color="success"
              prepend-icon="fa-book-open"
              @click="showWizard = true"
            >
              Anleitung starten
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="pa-4">Funktionen</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-list density="comfortable">
              <v-list-item prepend-icon="fa-chart-line">
                <v-list-item-title>Überblick</v-list-item-title>
                <v-list-item-subtitle>Sieh deine Finanzprognose auf einen Blick</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="fa-piggy-bank">
                <v-list-item-title>Vermögen</v-list-item-title>
                <v-list-item-subtitle>Verfolge dein langfristiges Sparziel</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="fa-wallet">
                <v-list-item-title>Spielraum</v-list-item-title>
                <v-list-item-subtitle>Sieh, wie viel du diesen Monat ausgeben kannst</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="fa-calendar-check">
                <v-list-item-title>Fixkosten</v-list-item-title>
                <v-list-item-subtitle>Verwalte regelmäßige Einnahmen und Ausgaben</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="fa-receipt">
                <v-list-item-title>Sonderkosten</v-list-item-title>
                <v-list-item-subtitle>Plane einmalige größere Ausgaben</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Onboarding Wizard Dialog -->
    <OnboardingWizard
      v-model="showWizard"
      @close="showWizard = false"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import OnboardingWizard from '@/components/help/OnboardingWizard.vue';

const showWizard = ref(false);
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
