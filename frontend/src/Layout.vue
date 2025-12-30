<template>
  <v-app id="inspire">
    <!-- Mobile Header -->
    <v-app-bar v-if="mobile && !hideNavigation" app color="surface" elevation="0" class="border-b">
      <v-app-bar-nav-icon icon="fa-bars" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold">
        <span class="text-income">Finanz</span><span class="text-white">-App</span>
      </v-app-bar-title>
    </v-app-bar>

    <template v-if="!hideNavigation">
      <AppSidebar
        v-model="drawer"
        :rail="rail"
        :temporary="mobile"
        @update:rail="rail = $event"
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

    <!-- Onboarding Wizard -->
    <OnboardingWizard
      v-model="showOnboardingWizard"
      @close="onOnboardingComplete"
    />
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import OnboardingWizard from '@/components/help/OnboardingWizard.vue'
import { AuthService } from '@/services/auth'

const { mobile } = useDisplay()
const route = useRoute()

// Computed property to check if navigation should be hidden
const hideNavigation = computed(() => route.meta.hideNavigation)

// Navigation state
const drawer = ref(!mobile.value) // Start open on desktop, closed on mobile
const rail = ref(false)

// Onboarding wizard state
const showOnboardingWizard = ref(false)
const user = ref(null)

// Check if user needs onboarding on mount
onMounted(async () => {
  user.value = await AuthService.getUser()
  if (user.value && user.value.onboarding_completed === false) {
    showOnboardingWizard.value = true
  }
})

const onOnboardingComplete = () => {
  showOnboardingWizard.value = false
  if (user.value) {
    user.value.onboarding_completed = true
  }
}

// Update drawer state when switching between mobile/desktop
watch(mobile, (isMobile) => {
  if (isMobile) {
    drawer.value = false
    rail.value = false
  } else {
    drawer.value = true
    rail.value = false // Ensure it's expanded by default on desktop switch
  }
})
</script>
<style scoped>
.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
