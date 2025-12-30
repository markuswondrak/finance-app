<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Empty State: No balance entered -->
    <v-alert
      v-if="!loading && data && data.checkingBalance === 0"
      type="info"
      variant="tonal"
      class="mb-6"
      closable
    >
      <template v-slot:title>Kontostand eingeben</template>
      Gib deinen aktuellen Kontostand ein, um deinen Monatsspielraum zu berechnen.
      <template v-slot:append>
        <v-btn variant="flat" color="success" size="small" @click="showEditBalance = true">
          Kontostand eingeben
        </v-btn>
      </template>
    </v-alert>

    <!-- Safe to Spend Card -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" class="d-flex">
        <v-card :class="safeToSpendCardClass" elevation="0">
          <v-card-text class="pa-6">
            <div class="text-subtitle-2 text-grey-lighten-1 mb-2">Monatsspielraum</div>
            <div class="safe-to-spend-amount" :class="safeToSpendClass">
              {{ formatCurrency(data?.safeToSpend || 0) }}
            </div>
            <div class="text-caption text-grey mt-2">
              Verfügbar nach Abzug aller ausstehenden Kosten
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="flex-grow-1" elevation="0">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="text-subtitle-2 text-grey-lighten-1">Kontostand</div>
              <v-btn size="small" variant="text" @click="showEditBalance = true">
                <v-icon size="small">fa-pen</v-icon>
              </v-btn>
            </div>
            <div class="text-h4 font-weight-bold">
              {{ formatCurrency(data?.checkingBalance || 0) }}
            </div>
            <div class="d-flex justify-space-between mt-4 text-body-2">
              <span class="text-grey-lighten-1">Ausstehend:</span>
              <span class="text-warning">{{ formatCurrency(data?.pendingTotal || 0) }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fixed Costs Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Fixkosten</span>
            <v-btn size="small" variant="text" @click="showAddCost = true">
              <v-icon size="small" class="mr-1">fa-plus</v-icon>
              Hinzufügen
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list v-if="data?.includedFixedCosts?.length" density="compact">
              <v-list-item
                v-for="cost in data.includedFixedCosts"
                :key="cost.id"
                class="px-0"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center justify-center mr-2">
                    <v-checkbox-btn
                      :model-value="cost.isPaid"
                      color="success"
                      density="compact"
                      @update:model-value="togglePaid(cost.id, $event)"
                    />
                  </div>
                </template>
                <v-list-item-title :class="{ 'text-decoration-line-through text-grey': cost.isPaid }">
                  {{ cost.name }}
                </v-list-item-title>
                <template v-slot:append>
                  <span class="text-body-2 mr-4" :class="cost.isPaid ? 'text-grey' : 'text-warning'">
                    {{ formatCurrency(cost.amount) }}
                  </span>
                  <v-btn icon size="x-small" variant="text" @click="excludeCost(cost.id)">
                    <v-icon size="small">fa-xmark</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center py-4">
              <div class="text-grey mb-2">Keine Fixkosten für diesen Monat</div>
              <router-link to="/fixedcosts" class="text-primary text-decoration-none">
                <v-icon size="small" class="mr-1">fa-plus</v-icon>
                Fixkosten hinzufügen
              </router-link>
            </div>

            <!-- Excluded costs expandable -->
            <v-expansion-panels v-if="data?.excludedFixedCosts?.length" variant="accordion" class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title class="text-body-2">
                  Ausgeschlossene Fixkosten ({{ data.excludedFixedCosts.length }})
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="cost in data.excludedFixedCosts"
                      :key="cost.id"
                      class="px-0"
                    >
                      <v-list-item-title class="text-grey">{{ cost.name }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-body-2 text-grey mr-4">{{ formatCurrency(cost.amount) }}</span>
                        <v-btn icon size="x-small" variant="text" @click="includeCost(cost.id)">
                          <v-icon size="small">fa-plus</v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- One-time Costs Section -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Einmalige Kosten</span>
            <v-btn size="small" variant="text" @click="showAddOneTime = true">
              <v-icon size="small" class="mr-1">fa-plus</v-icon>
              Hinzufügen
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list v-if="data?.oneTimeCosts?.length" density="compact">
              <v-list-item
                v-for="cost in data.oneTimeCosts"
                :key="cost.id"
                class="px-0"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center justify-center mr-2">
                    <v-checkbox-btn
                      :model-value="cost.isPaid"
                      color="success"
                      density="compact"
                      @update:model-value="toggleOneTimePaid(cost.id, $event)"
                    />
                  </div>
                </template>
                <v-list-item-title :class="{ 'text-decoration-line-through text-grey': cost.isPaid }">
                  {{ cost.name }}
                </v-list-item-title>
                <template v-slot:append>
                  <span class="text-body-2 mr-4" :class="cost.isPaid ? 'text-grey' : 'text-warning'">
                    {{ formatCurrency(cost.amount) }}
                  </span>
                  <v-btn icon size="x-small" variant="text" @click="deleteOneTime(cost.id)">
                    <v-icon size="small">fa-trash</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey py-4">
              Keine einmaligen Kosten
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Balance Dialog -->
    <v-dialog v-model="showEditBalance" max-width="400">
      <v-card>
        <v-card-title>Kontostand aktualisieren</v-card-title>
        <v-card-text>
          <v-form v-model="balanceFormValid" @submit.prevent="updateBalance">
            <base-text-field
              v-model.number="newBalance"
              label="Aktueller Kontostand"
              type="number"
              prefix="€"
              :rules="balanceRules"
              @keyup.enter="updateBalance"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showEditBalance = false">Abbrechen</v-btn>
          <v-btn color="success" variant="flat" @click="updateBalance" :disabled="!balanceFormValid">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add One-time Cost Dialog -->
    <v-dialog v-model="showAddOneTime" max-width="400">
      <v-card>
        <v-card-title>Einmalige Kosten hinzufügen</v-card-title>
        <v-card-text>
          <v-form v-model="oneTimeFormValid" @submit.prevent="addOneTimeCost">
            <base-text-field
              v-model="newOneTimeName"
              label="Bezeichnung"
              class="mb-4"
              :rules="nameRules"
              @keyup.enter="addOneTimeCost"
            />
            <base-text-field
              v-model.number="newOneTimeAmount"
              label="Betrag"
              type="number"
              prefix="€"
              :rules="amountRules"
              @keyup.enter="addOneTimeCost"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showAddOneTime = false">Abbrechen</v-btn>
          <v-btn color="success" variant="flat" @click="addOneTimeCost" :disabled="!oneTimeFormValid">Hinzufügen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SpendService } from '@/services/spend'
import { toCurrency } from '@/components/common/Utils'
import BaseTextField from '@/components/common/BaseTextField.vue'

const formatCurrency = (amount) => toCurrency(amount)

const data = ref(null)
const loading = ref(true)

// Dialog states
const showEditBalance = ref(false)
const showAddCost = ref(false)
const showAddOneTime = ref(false)

// Form data
const newBalance = ref(0)
const newOneTimeName = ref('')
const newOneTimeAmount = ref(0)

// Form validation
const balanceFormValid = ref(false)
const oneTimeFormValid = ref(false)

const balanceRules = [
  v => v !== '' && v !== null || 'Betrag ist erforderlich',
  v => !isNaN(Number(v)) || 'Betrag muss eine Zahl sein',
]

const nameRules = [
  v => !!v || 'Bezeichnung ist erforderlich',
  v => (v && v.length <= 100) || 'Bezeichnung darf maximal 100 Zeichen lang sein',
]

const amountRules = [
  v => v !== '' && v !== null || 'Betrag ist erforderlich',
  v => !isNaN(Number(v)) || 'Betrag muss eine Zahl sein',
  v => Number(v) !== 0 || 'Betrag darf nicht 0 sein',
]

const safeToSpendClass = computed(() => {
  if (!data.value) return ''
  return data.value.safeToSpend >= 0 ? 'text-success' : 'text-error'
})

const safeToSpendCardClass = computed(() => {
  const isNegative = data.value && data.value.safeToSpend < 0
  return ['flex-grow-1', isNegative ? 'safe-to-spend-card-negative' : 'safe-to-spend-card']
})

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    data.value = await SpendService.getSaveToSpend()
    newBalance.value = data.value?.checkingBalance || 0
  } catch (error) {
    console.error('Failed to load save-to-spend data:', error)
  } finally {
    loading.value = false
  }
}

async function updateBalance() {
  if (!balanceFormValid.value) return
  try {
    data.value = await SpendService.updateBalance(newBalance.value)
    showEditBalance.value = false
  } catch (error) {
    console.error('Failed to update balance:', error)
  }
}

async function togglePaid(costId, isPaid) {
  try {
    if (isPaid) {
      data.value = await SpendService.markFixedCostPaid(costId)
    } else {
      data.value = await SpendService.markFixedCostPending(costId)
    }
  } catch (error) {
    console.error('Failed to update payment status:', error)
  }
}

async function includeCost(costId) {
  try {
    data.value = await SpendService.includeFixedCost(costId)
  } catch (error) {
    console.error('Failed to include fixed cost:', error)
  }
}

async function excludeCost(costId) {
  try {
    data.value = await SpendService.excludeFixedCost(costId)
  } catch (error) {
    console.error('Failed to exclude fixed cost:', error)
  }
}

async function addOneTimeCost() {
  if (!oneTimeFormValid.value) return
  try {
    data.value = await SpendService.createOneTimeCost(newOneTimeName.value, newOneTimeAmount.value)
    showAddOneTime.value = false
    newOneTimeName.value = ''
    newOneTimeAmount.value = 0
  } catch (error) {
    console.error('Failed to create one-time cost:', error)
  }
}

async function toggleOneTimePaid(costId, isPaid) {
  try {
    if (isPaid) {
      data.value = await SpendService.markOneTimeCostPaid(costId)
    } else {
      data.value = await SpendService.markOneTimeCostPending(costId)
    }
  } catch (error) {
    console.error('Failed to update one-time cost payment status:', error)
  }
}

async function deleteOneTime(costId) {
  try {
    data.value = await SpendService.deleteOneTimeCost(costId)
  } catch (error) {
    console.error('Failed to delete one-time cost:', error)
  }
}
</script>

<style scoped>
.safe-to-spend-card {
  background: linear-gradient(135deg, rgba(0, 230, 118, 0.1) 0%, rgba(0, 230, 118, 0.05) 100%);
  border: 1px solid rgba(0, 230, 118, 0.2);
}

.safe-to-spend-card-negative {
  background: linear-gradient(135deg, rgba(255, 82, 82, 0.1) 0%, rgba(255, 82, 82, 0.05) 100%);
  border: 1px solid rgba(255, 82, 82, 0.2);
}

.safe-to-spend-amount {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.text-success {
  color: #00E676 !important;
}

.text-error {
  color: #FF5252 !important;
}

.text-warning {
  color: #FFA726 !important;
}
</style>
