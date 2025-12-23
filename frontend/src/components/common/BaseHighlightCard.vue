<template>
  <v-card
    class="base-highlight-card fill-height"
    :class="[`base-highlight-card--${variant}`, { 'base-highlight-card--loading': loading }, { 'base-highlight-card--clickable': clickable }]"
    :elevation="4"
    rounded="xl"
    @click="onClick"
    :ripple="clickable"
  >
    <v-skeleton-loader
      v-if="loading"
      type="list-item-two-line"
      class="fill-height"
    />
    <template v-else>
      <v-card-text class="pb-2">
        <div class="base-highlight-card__title text-overline text-grey-lighten-1 mb-1">{{ title }}</div>
        <div
          class="base-highlight-card__value font-weight-bold"
          :class="valueSizeClass"
        >
          {{ value }}
        </div>
        <div v-if="trend" class="base-highlight-card__trend d-flex align-center mt-1">
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
      
      <!-- Footer/Insight Section -->
      <div v-if="hasFooter" class="base-highlight-card__footer px-4 pb-4 pt-0 text-caption text-grey-lighten-1">
        <slot name="footer">
          {{ insight }}
        </slot>
      </div>
    </template>
  </v-card>
</template>

<script setup>
import { computed, useSlots } from 'vue'

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
    validator: (v) => ['default', 'success', 'risk', 'none'].includes(v)
  },
  loading: {
    type: Boolean,
    default: false
  },
  insight: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
const slots = useSlots()

const hasFooter = computed(() => !!props.insight || !!slots.footer)

const onClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

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

  if (length <= 8) {
    return 'text-h4' // Match CurrentBalanceCard
  } else if (length <= 12) {
    return 'text-h5'
  } else {
    return 'text-h6'
  }
})
</script>

<style scoped>
.base-highlight-card {
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.base-highlight-card--clickable {
  cursor: pointer;
}

.base-highlight-card--clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.4) !important;
}

.base-highlight-card--success {
  border-left: 4px solid #4ADE80 !important;
}

.base-highlight-card--risk {
  border-left: 4px solid #F87171 !important;
}

.base-highlight-card--default {
  border-left: 4px solid #00B8D4 !important;
}

.base-highlight-card__value {
  color: #E0E0E0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.base-highlight-card__footer {
  margin-top: auto;
}
</style>
