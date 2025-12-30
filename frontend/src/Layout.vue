<template>
  <v-app id="inspire">
    <!-- Branded Splash Screen -->
    <Transition name="fade">
      <div v-if="isAuthChecking" class="splash-screen">
        <div class="splash-content">
          <h1 class="splash-title">
            <span class="text-income">Finanz</span><span class="text-white">-App</span>
          </h1>
          <v-progress-circular
            indeterminate
            color="income"
            size="24"
            width="2"
            class="mt-6"
          />
        </div>
      </div>
    </Transition>

    <template v-if="!isAuthChecking">
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
    </template>
  </v-app>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/navigation/AppSidebar.vue'
import OnboardingWizard from '@/components/help/OnboardingWizard.vue'
import { AuthService } from '@/services/auth'

const { mobile } = useDisplay()
const route = useRoute()
const router = useRouter()

// Auth checking state for splash screen
const isAuthChecking = ref(true)

// Computed property to check if navigation should be hidden
const hideNavigation = computed(() => route.meta.hideNavigation)

// Navigation state
const drawer = ref(!mobile.value) // Start open on desktop, closed on mobile
const rail = ref(false)

// Onboarding wizard state
const showOnboardingWizard = ref(false)
const user = ref(null)

// Check auth state and handle routing on mount
onMounted(async () => {
  user.value = await AuthService.getUser()
  const isAuthenticated = !!user.value

  // Handle routing based on auth state before showing content
  if (route.meta.guestOnly && isAuthenticated) {
    await router.replace('/overview')
  } else if (route.meta.requiresAuth && !isAuthenticated) {
    await router.replace('/')
  }

  // Auth check complete, show content
  isAuthChecking.value = false

  // Check if user needs onboarding
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

/* Splash screen styles */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.splash-title {
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: -0.5px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
