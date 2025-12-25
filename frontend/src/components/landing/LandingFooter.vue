<template>
  <v-footer class="landing-footer py-8 bg-transparent d-flex flex-column">
    <div class="d-flex mb-4">
      <a href="#" class="text-caption text-medium-emphasis text-decoration-none mx-4 hover-link">Impressum</a>
      <a href="#" class="text-caption text-medium-emphasis text-decoration-none mx-4 hover-link">Datenschutz</a>
    </div>
    <div class="text-caption text-disabled">
      &copy; {{ new Date().getFullYear() }} Finance App. Made in EU.
    </div>
  </v-footer>
</template>

<script setup>
</script>

<style scoped>
.hover-link:hover {
  color: white !important;
  text-decoration: underline !important;
}
</style>