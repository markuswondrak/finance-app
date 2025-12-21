<template>
  <v-card 
    class="lowest-point-card" 
    :class="accentClass"
    rounded="xl" 
    elevation="4"
  >
    <v-card-text class="d-flex align-center fill-height">
      <div v-if="loading" class="w-100">
        <v-skeleton-loader type="list-item-two-line" />
      </div>
      <div v-else>
        <div class="text-overline mb-1">Niedrigster Stand</div>
        <div 
          class="text-h4 font-weight-bold d-flex align-center"
          :class="textColorClass"
        >
          <v-icon 
            v-if="status === 'negative'" 
            icon="fa-circle-exclamation" 
            class="mr-2"
            size="small"
          />
          {{ formattedAmount }}
        </div>
        <div class="text-caption text-grey mt-1">
          {{ lowestDate }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  entries: {
    type: Array,
    default: () => []
  }
})

const minEntry = computed(() => {
  if (!props.entries || props.entries.length === 0) return null
  
  return props.entries.reduce((min, current) => {
    return current.currentAmount < min.currentAmount ? current : min
  }, props.entries[0])
})

const lowestAmount = computed(() => {
  return minEntry.value ? minEntry.value.currentAmount : 0
})

const lowestDate = computed(() => {
  if (!minEntry.value || !minEntry.value.yearMonth) return ''
  const date = new Date(minEntry.value.yearMonth.year, minEntry.value.yearMonth.month - 1)
  const formatted = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(date)
  return `im ${formatted}`
})

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(lowestAmount.value)
})

const status = computed(() => {
  return lowestAmount.value >= 0 ? 'positive' : 'negative'
})

const accentClass = computed(() => {
  return status.value === 'positive' ? 'card-accent-success' : 'card-accent-error'
})

const textColorClass = computed(() => {
  return status.value === 'positive' ? 'text-positive' : 'text-negative'
})
</script>

<style scoped>
.lowest-point-card {
  height: 100%;
  border-left: 4px solid transparent;
}
</style>
