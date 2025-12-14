<template>
  <v-row>
    <v-col
      v-for="(metric, index) in displayMetrics"
      :key="index"
      cols="12"
      sm="4"
    >
      <KPICard
        :title="metric.title"
        :value="metric.value"
        :trend="metric.trend"
        :variant="metric.variant"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import KPICard from './KPICard.vue'

const props = defineProps({
  metrics: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Always render 3 slots, using placeholders if metrics are missing
const displayMetrics = computed(() => {
  const result = []
  for (let i = 0; i < 3; i++) {
    if (props.metrics[i]) {
      result.push(props.metrics[i])
    } else {
      result.push({
        title: '—',
        value: '—',
        trend: null,
        variant: 'default'
      })
    }
  }
  return result
})
</script>
