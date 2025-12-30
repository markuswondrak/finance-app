<template>
  <v-container fluid class="pa-0 landing-page">
    <LandingHero />
    <CostTrackingFeature />
    <SaveToSpendFeature />
    <WealthFeature />
    <SavingsCalculator />
    <LandingCTA />
    <LandingFooter />
  </v-container>
</template>

<script setup>
import LandingHero from './LandingHero.vue';
import CostTrackingFeature from './CostTrackingFeature.vue';
import SaveToSpendFeature from './SaveToSpendFeature.vue';
import WealthFeature from './WealthFeature.vue';
import SavingsCalculator from './SavingsCalculator.vue';
import LandingCTA from './LandingCTA.vue';
import LandingFooter from './LandingFooter.vue';
</script>

<style scoped>
.landing-page {
  background-color: #121212; /* Fintech Dark Mode */
  min-height: 100vh;
}
</style>
