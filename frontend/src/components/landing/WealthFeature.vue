<template>
  <v-container class="wealth-feature py-16">
    <v-row align="center">
      <v-col cols="12" md="6">
        <v-card color="transparent" variant="flat" class="rounded-xl pa-4 pa-md-8">
          <v-icon icon="fa-chart-line" color="income" size="64" class="mb-4"></v-icon>
          <h2 class="text-h3 font-weight-bold mb-4">
            Vermögensverwaltung <br>
            <span class="text-income">neu gedacht</span>
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Behalte den Überblick über all deine Assets. Von ETFs über Krypto bis hin zu Immobilien. 
            Analysiere deine Portfoliostruktur und optimiere deine finanzielle Zukunft mit unseren 
            fortschrittlichen Prognosetools.
          </p>
          <v-list bg-color="transparent" class="px-0">
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income">
               <v-list-item-title class="text-body-1">Automatisierte ETF-Analysen</v-list-item-title>
            </v-list-item>
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income">
                <v-list-item-title class="text-body-1">Langzeit-Vermögensprognose</v-list-item-title>
            </v-list-item>
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income">
                <v-list-item-title class="text-body-1">Risiko- und Diversifikations-Check</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-center">
        <!-- Visual placeholder -->
        <div class="visual-placeholder rounded-xl d-flex align-center justify-center">
             <v-icon size="128" color="income" style="opacity: 0.2;">fa-chart-area</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
.visual-placeholder {
  width: 100%;
  height: 400px;
  background: rgba(255,255,255,0.03);
  border: 1px dashed rgba(255,255,255,0.1);
}
</style>