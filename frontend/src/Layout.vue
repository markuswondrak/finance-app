<template>
  <v-app id="inspire">
    <template v-if="!hideNavigation">
      <AppSidebar
        v-model="drawer"
        :rail="rail"
        :temporary="mobile"
      />

      <!-- Floating Navigation Toggle Button -->
      <v-btn
        :class="[mobile ? 'nav-toggle-mobile' : 'nav-toggle-desktop', 'glass-button']"
        :icon="navIcon"
        color="income"
        size="large"
        :aria-label="mobile ? (drawer ? 'Navigation schließen' : 'Navigation öffnen') : (rail ? 'Navigation erweitern' : 'Navigation minimieren')"
        :aria-expanded="mobile ? drawer : !rail"
        aria-controls="app-navigation"
        @click="toggleDrawer"
      />
    </template>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer v-if="!hideNavigation" app color="surface" class="justify-center">
      <span class="text-grey">
        &copy; 2025
        <a href="https://wondee.info" style="color: #4ADE80;">wondee.info</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/Navigation/AppSidebar.vue'

const { mobile } = useDisplay()
const route = useRoute()

// Computed property to check if navigation should be hidden
const hideNavigation = computed(() => route.meta.hideNavigation)

// Navigation state
const drawer = ref(!mobile.value) // Start open on desktop, closed on mobile
const rail = ref(false)

// Update drawer state when switching between mobile/desktop
watch(mobile, (isMobile) => {
  if (isMobile) {
    drawer.value = false
    rail.value = false
  } else {
    drawer.value = true
  }
})

const navIcon = computed(() => {
  if (mobile.value) {
    return drawer.value ? 'fa-xmark' : 'fa-bars'
  }
  return rail.value ? 'fa-chevron-right' : 'fa-chevron-left'
})

const toggleDrawer = () => {
  if (mobile.value) {
    drawer.value = !drawer.value
  } else {
    rail.value = !rail.value
  }
}
</script>