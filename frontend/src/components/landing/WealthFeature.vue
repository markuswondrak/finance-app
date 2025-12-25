<template>
  <v-container class="wealth-feature py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card color="transparent" variant="flat" class="rounded-xl pa-4 pa-md-8 text-center">
          <v-icon icon="fa-chart-line" color="income" size="64" class="mb-4"></v-icon>
          <h2 class="text-h3 font-weight-bold mb-4">
            Vermögens-<br class="d-sm-none">prognose <br>
            <span class="text-income">automatisiert & präzise</span>
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Deine finanzielle Zukunft ist kein Ratespiel mehr. Indem du deine Spar- oder Entnahmeraten direkt in deinen Fixkosten festlegst, berechnet unsere App automatisch deine langfristige Vermögensentwicklung. Plane heute, wie du morgen leben willst – transparent und ohne manuellen Aufwand.
          </p>
          <v-list bg-color="transparent" class="px-0 d-inline-block text-left">
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income" lines="three">
               <v-list-item-title class="font-weight-bold">Nahtlose Cashflow-Integration</v-list-item-title>
               <v-list-item-subtitle class="text-wrap text-medium-emphasis">Hinterlege deine Raten einfach in deinen Fixkosten. Alles aktualisiert sich vollautomatisch.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Drei-Szenarien-Vorschau</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Vom Best-Case bis zur konservativen Schätzung: Visualisiere deinen Kapitalverlauf.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Intelligente Planungssicherheit</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Erkenne sofort, wie sich heutige Konsumentscheidungen auf dein Endvermögen auswirken.</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
</style>