<template>
  <v-footer class="landing-footer bg-transparent py-16">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h4 font-weight-bold mb-2">Ready to take control?</h2>
        <p class="text-h5 text-success mb-8 font-weight-bold">It’s 100% Free.</p>
        
        <div class="d-flex justify-center mb-12">
          <v-btn icon="fa-brands fa-google" variant="tonal" color="white" class="mx-2 glass-button" />
          <v-btn icon="fa-brands fa-github" variant="tonal" color="white" class="mx-2 glass-button" />
        </div>
      </div>

      <v-divider class="mb-8" style="border-color: rgba(255,255,255,0.1);" />

      <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption text-grey">
        <div class="mb-4 mb-md-0">
          &copy; {{ new Date().getFullYear() }} Finanz-App. All rights reserved.
        </div>
        <div>
          <a href="#" class="footer-link mx-3">Terms</a>
          <a href="#" class="footer-link mx-3">Privacy</a>
          <a href="#" @click.prevent="scrollToTop" class="footer-link mx-3">Back to Top</a>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.footer-link {
  color: #9CA3AF;
  text-decoration: none;
  transition: color 0.2s ease;
}
.footer-link:hover {
  color: white;
}
.glass-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>