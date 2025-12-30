<template>
  <v-container class="save-to-spend-feature py-16">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card color="transparent" variant="flat" class="rounded-xl pa-4 pa-md-8 text-center">
          <v-icon icon="fa-wallet" color="income" size="64" class="mb-4"></v-icon>
          <h2 class="text-h3 font-weight-bold mb-4">
            Dein Monatsspielraum <br>
            <span class="text-income">immer im Blick</span>
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Schluss mit dem Rätselraten am Monatsende. Die <i>Finanz App</i> zeigt dir in Echtzeit, was du nach Abzug aller ausstehenden Kosten wirklich ausgeben kannst – ohne dein Budget zu gefährden.
          </p>

          <v-list bg-color="transparent" class="px-0 d-inline-block text-left mb-8">
            <v-list-item class="px-0" prepend-icon="fa-circle-check" base-color="income" lines="three">
               <v-list-item-title class="font-weight-bold">Echtzeit-Übersicht</v-list-item-title>
               <v-list-item-subtitle class="text-wrap text-medium-emphasis">Sieh sofort, wie viel dir nach allen offenen Fixkosten und Einmalausgaben bleibt.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Flexible Kostensteuerung</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Schließe einzelne Fixkosten ein oder aus – je nachdem, was für deinen Monat relevant ist.</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="px-0 mt-4" prepend-icon="fa-circle-check" base-color="income" lines="three">
                <v-list-item-title class="font-weight-bold">Einmalkosten spontan erfassen</v-list-item-title>
                <v-list-item-subtitle class="text-wrap text-medium-emphasis">Unerwartete Ausgabe? Füge sie hinzu und dein Spielraum passt sich automatisch an.</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <!-- Preview Component -->
          <div class="preview-wrapper mx-auto" style="max-width: 500px;">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-card class="safe-to-spend-card pa-4" elevation="0">
                  <div class="text-caption text-grey-lighten-1 mb-1">Monatsspielraum</div>
                  <div class="safe-to-spend-amount text-success">
                    {{ formatCurrency(mockData.safeToSpend) }}
                  </div>
                  <div class="text-caption text-grey mt-1">
                    Verfügbar diesen Monat
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="balance-card pa-4" elevation="0">
                  <div class="text-caption text-grey-lighten-1 mb-1">Kontostand</div>
                  <div class="balance-amount">
                    {{ formatCurrency(mockData.checkingBalance) }}
                  </div>
                  <div class="d-flex justify-space-between mt-2 text-caption">
                    <span class="text-grey-lighten-1">Ausstehend:</span>
                    <span class="text-warning">{{ formatCurrency(mockData.pendingTotal) }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const mockData = {
  safeToSpend: 124750,
  checkingBalance: 285000,
  pendingTotal: -160250
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount / 100)
}
</script>

<style scoped>
.save-to-spend-feature {
  background: rgba(255, 255, 255, 0.02);
}

.preview-wrapper {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.preview-wrapper:hover {
  transform: scale(1.1);
}

.safe-to-spend-card {
  background: linear-gradient(135deg, rgba(0, 230, 118, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%);
  border: 1px solid rgba(0, 230, 118, 0.2);
  border-radius: 12px;
}

.balance-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.safe-to-spend-amount {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.text-success {
  color: #00E676 !important;
}

.text-warning {
  color: #FFA726 !important;
}
</style>
