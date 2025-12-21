<template>
  <v-card
    class="kpi-card"
    :class="[`kpi-card--${variant}`, { 'kpi-card--loading': loading }]"
  >
    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line"
    />
    <template v-else>
      <v-card-text>
        <div class="kpi-card__title text-caption text-grey">{{ title }}</div>
        <div
          class="kpi-card__value font-weight-bold"
          :class="valueSizeClass"
        >
          {{ value }}
        </div>
        <div v-if="trend" class="kpi-card__trend d-flex align-center mt-1">
          <v-icon
            :icon="trendIcon"
            :color="trendColor"
            size="small"
            class="mr-1"
          />
          <span :class="`text-${trendColor}`" class="text-caption">
            {{ trend.percentage }}%
          </span>
        </div>
      </v-card-text>
    </template>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  trend: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'risk'].includes(v)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  switch (props.trend.direction) {
    case 'up': return 'fa-arrow-up'
    case 'down': return 'fa-arrow-down'
    default: return 'fa-minus'
  }
})

const trendColor = computed(() => {
  if (!props.trend) return 'grey'
  switch (props.trend.direction) {
    case 'up': return 'success'
    case 'down': return 'error'
    default: return 'grey'
  }
})

// Dynamic font sizing based on value length (FR-011)
const valueSizeClass = computed(() => {
  const valueStr = String(props.value)
  const length = valueStr.length

  if (length <= 6) {
    return 'text-h5' // Default large size for short values
  } else if (length <= 10) {
    return 'text-h6' // Medium size
  } else {
    return 'text-subtitle-1' // Smaller size for long values
  }
})
</script>

<style scoped>
.kpi-card {
  height: 100%;
}

.kpi-card--success {
  border-left-color: #4ADE80 !important;
}

.kpi-card--risk {
  border-left-color: #F87171 !important;
}

.kpi-card--default {
  border-left-color: #00B8D4 !important;
}

.kpi-card__value {
  color: #E0E0E0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
