<template>
  <v-container class="cost-tracking-feature py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card color="transparent" variant="flat" class="rounded-xl pa-4 pa-md-8 text-center">
          <v-icon icon="fa-book-open" color="income" size="64" class="mb-4"></v-icon>
          <h2 class="text-h3 font-weight-bold mb-4">
            Dein Haushaltsbuch <br>
            <span class="text-income">für heute und morgen</span>
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Behalte die volle Kontrolle über deine Finanzen und schaffe das Fundament für deine Vorsorge. Unser Haushaltsbuch denkt mit: Erfasse deine Fixkosten flexibel in jedem Rhythmus und plane Einmalzahlungen präzise ein. So weißt du jederzeit genau, was übrig bleibt, um deine Zukunft finanziell abzusichern.
          </p>
          
          <v-list bg-color="transparent" class="px-0 d-inline-block text-left mb-8">
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income" lines="three">
               <v-list-item-title class="font-weight-bold">Maximale Intervall-Flexibilität</v-list-item-title>
               <v-list-item-subtitle class="text-wrap text-medium-emphasis">Ob monatlich, quartalsweise oder jährlich – vermeide böse Überraschungen.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Einmalkosten fest im Griff</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Plane Sonderausgaben oder außerordentliche Einzahlungen punktgenau ein.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Finanzielle Weitsicht als Standard</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Nutze die Übersicht, um Sparpotenziale für deine Ziele zu identifizieren.</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <!-- Preview Component -->
          <div class="preview-wrapper mx-auto" style="max-width: 400px;">
             <LowestPointCard :entries="mockEntries" :loading="false" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import LowestPointCard from '@/components/overview/LowestPointCard.vue';

const mockEntries = [
  { yearMonth: { year: 2025, month: 1 }, currentAmount: 2500 },
  { yearMonth: { year: 2025, month: 2 }, currentAmount: 2800 },
  { yearMonth: { year: 2025, month: 3 }, currentAmount: 1200 }, // Highlighted low point
  { yearMonth: { year: 2025, month: 4 }, currentAmount: 1500 },
  { yearMonth: { year: 2025, month: 5 }, currentAmount: 1800 },
  { yearMonth: { year: 2025, month: 6 }, currentAmount: 2100 },
];
</script>

<style scoped>
.cost-tracking-feature {
  background: rgba(255, 255, 255, 0.02);
}
.preview-wrapper {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
.preview-wrapper:hover {
  transform: scale(1.1);
}
</style>