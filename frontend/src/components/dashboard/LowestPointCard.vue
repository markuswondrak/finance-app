<template>
  <v-card 
    class="lowest-point-card" 
    :class="`lowest-point-card--${variant}`"
    rounded="xl" 
    elevation="4"
  >
    <v-skeleton-loader v-if="loading" type="list-item-two-line" />
    <v-card-text v-else>
      <div class="text-caption text-grey">Lowest Point</div>
      <div 
        class="text-h5 font-weight-bold d-flex align-center"
        :class="textColorClass"
      >
        <v-icon 
          v-if="status === 'negative'" 
          icon="mdi-alert-circle-outline" 
          color="error"
          class="mr-2"
          size="small"
        />
        {{ formattedAmount }}
      </div>
      <div class="text-caption text-grey mt-1">
        {{ lowestDate }}
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
  if (lowestAmount.value > 0) return 'positive'
  if (lowestAmount.value < 0) return 'negative'
  return 'neutral'
})

const variant = computed(() => {
  switch (status.value) {
    case 'positive': return 'success'
    case 'negative': return 'risk'
    default: return 'default'
  }
})

const textColorClass = computed(() => {
  switch (status.value) {
    case 'positive': return 'text-success'
    case 'negative': return 'text-error'
    default: return 'text-white'
  }
})
</script>

<style scoped>
.lowest-point-card {
  height: 100%;
}

.lowest-point-card--success {
  border-left-color: #4ADE80 !important;
  border-left-width: 4px;
}

.lowest-point-card--risk {
  border-left-color: #F87171 !important;
  border-left-width: 4px;
}

.lowest-point-card--default {
  border-left-color: #00B8D4 !important;
  border-left-width: 4px;
}
</style>
