<template>
  <v-container class="feature-grid py-16">
    <div ref="observerTarget" class="observer-target"></div>
    <v-row justify="center">
      <v-col
        v-for="(feature, index) in features"
        :key="index"
        cols="12"
        md="4"
      >
        <div 
          class="fade-in-up h-100"
          :class="{ visible: isVisible }"
          :style="{ transitionDelay: `${index * 200}ms` }"
        >
          <v-card class="glass-card h-100 pa-6 d-flex flex-column" flat>
            <div class="mb-6">
              <v-icon :icon="feature.icon" color="success" size="x-large" />
            </div>
            <h3 class="text-h5 font-weight-bold mb-3">{{ feature.title }}</h3>
            <p class="text-body-1 text-medium-emphasis">{{ feature.description }}</p>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const features = [
  {
    title: 'Smart Forecasting',
    description: 'See your bank balance months in advance. Predict your financial health before the month even starts.',
    icon: 'fa-solid fa-chart-line'
  },
  {
    title: 'Flexible Cost Tracking',
    description: 'Monthly bills, quarterly insurance, or that one-time vacation—track everything in one place.',
    icon: 'fa-solid fa-list-check'
  },
  {
    title: 'Debt Prevention',
    description: 'Identify savings potential and stay in the green with automated alerts and visual balance trends.',
    icon: 'fa-solid fa-shield-halved'
  }
]

// T008 usage: useIntersectionObserver returns targetRef and isIntersecting ref
// We enable 'once: true' so it doesn't fade out again
const { targetRef: observerTarget, isIntersecting: isVisible } = useIntersectionObserver({ 
  threshold: 0.1,
  once: true 
})
</script>

<style scoped>
.feature-grid {
  position: relative;
}
.observer-target {
  position: absolute;
  top: 50px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>