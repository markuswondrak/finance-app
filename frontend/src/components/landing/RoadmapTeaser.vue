<template>
  <v-container class="roadmap-teaser py-16 text-center">
    <div ref="observerTarget">
      <div 
        class="fade-in-up"
        :class="{ visible: isVisible }"
      >
        <h2 class="text-h4 font-weight-bold mb-4">Your Wealth, Optimized.</h2>
        <div class="mb-8">
          <v-chip color="success" variant="outlined" size="small" class="text-uppercase font-weight-bold letter-spacing-1">
            Coming Soon
          </v-chip>
        </div>
        
        <p class="text-h6 text-medium-emphasis mb-12 mx-auto" style="max-width: 700px;">
          Currently building: Portfolio tracking and savings plan automation. Go from debt-free to wealth-builder within the same ecosystem.
        </p>

        <v-row justify="center" class="dimmed-section">
          <v-col cols="12" md="5">
            <v-card class="glass-card pa-6 text-left h-100 opacity-60" flat>
              <v-icon icon="fa-solid fa-layer-group" color="grey" class="mb-4" size="large" />
              <h3 class="text-h6 text-grey-lighten-1 mb-2">Portfolio Tracking</h3>
              <p class="text-grey-darken-1">Unified view of all your assets across brokers and banks.</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-card class="glass-card pa-6 text-left h-100 opacity-60" flat>
              <v-icon icon="fa-solid fa-robot" color="grey" class="mb-4" size="large" />
              <h3 class="text-h6 text-grey-lighten-1 mb-2">Savings Automation</h3>
              <p class="text-grey-darken-1">Smart rules to auto-invest your monthly surplus.</p>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { targetRef: observerTarget, isIntersecting: isVisible } = useIntersectionObserver({ 
  threshold: 0.2,
  once: true 
})
</script>

<style scoped>
.opacity-60 {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}
.opacity-60:hover {
  opacity: 0.8;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>