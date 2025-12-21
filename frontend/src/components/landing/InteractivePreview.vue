<template>
  <v-container class="interactive-preview py-16 text-center">
    <div ref="observerTarget">
      <div 
        class="fade-in-up"
        :class="{ visible: isVisible }"
      >
        <h2 class="text-h4 font-weight-bold mb-4">No more bad surprises.</h2>
        <p class="text-h6 text-medium-emphasis mb-12" style="max-width: 600px; margin: 0 auto;">
          We highlight your lowest projected balance so you can plan ahead with confidence.
        </p>

        <div class="preview-card-container mx-auto" style="max-width: 400px;">
          <LowestPointCard :entries="mockEntries" :loading="false" class="glass-card" />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import LowestPointCard from '@/components/overview/LowestPointCard.vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const mockEntries = [
  { currentAmount: 1200, yearMonth: { year: 2025, month: 1 } },
  { currentAmount: 800, yearMonth: { year: 2025, month: 2 } },
  { currentAmount: 450, yearMonth: { year: 2025, month: 3 } }, // Lowest point
  { currentAmount: 900, yearMonth: { year: 2025, month: 4 } },
]

const { targetRef: observerTarget, isIntersecting: isVisible } = useIntersectionObserver({ 
  threshold: 0.2,
  once: true 
})
</script>

<style scoped>
.interactive-preview {
  position: relative;
}
.preview-card-container {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
.preview-card-container:hover {
  transform: scale(1.15);
}
</style>