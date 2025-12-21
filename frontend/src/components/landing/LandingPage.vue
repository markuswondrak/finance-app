<template>
  <div class="landing-page">
    <HeroSection />
    <FeatureGrid />
    <InteractivePreview />
    <RoadmapTeaser />
    <LandingFooter />
  </div>
</template>

<script>
import HeroSection from '@/components/landing/HeroSection.vue'
import FeatureGrid from '@/components/landing/FeatureGrid.vue'
import InteractivePreview from '@/components/landing/InteractivePreview.vue'
import RoadmapTeaser from '@/components/landing/RoadmapTeaser.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'

export default {
  name: 'LandingPage',
  components: {
    HeroSection,
    FeatureGrid,
    InteractivePreview,
    RoadmapTeaser,
    LandingFooter
  }
}
</script>

<style scoped>
.landing-page {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: white;
}
</style>