<template>
  <v-container fluid class="pa-0 landing-page">
    <LandingHero />
    <WealthFeature />
    <SavingsCalculator />
    <LandingFooter />
  </v-container>
</template>

<script setup>
import LandingHero from './LandingHero.vue';
import WealthFeature from './WealthFeature.vue';
import SavingsCalculator from './SavingsCalculator.vue';
import LandingFooter from './LandingFooter.vue';
</script>

<style scoped>
.landing-page {
  background-color: #121212; /* Fintech Dark Mode */
  min-height: 100vh;
}
</style>
