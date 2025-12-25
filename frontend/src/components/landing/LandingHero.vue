<template>
  <v-container fluid class="landing-hero d-flex flex-column justify-center align-center text-center">
    <!-- Made in EU Badge -->
    <v-chip
      color="income"
      variant="outlined"
      class="mb-6 font-weight-bold"
      prepend-icon="fa-globe-europe"
    >
      Made in EU
    </v-chip>

    <!-- Main Headline -->
    <h1 class="text-h2 font-weight-bold mb-4 text-white">
      Deine Finanzen.<br>
      <span class="text-income">Einfach. Klar. Sicher.</span>
    </h1>

    <!-- Subheadline -->
    <p class="text-h6 text-medium-emphasis mb-8" style="max-width: 600px;">
      Übernimm die Kontrolle über dein Vermögen. Die moderne Plattform für deine finanzielle Freiheit.
    </p>

    <!-- Login Button -->
    <div class="d-flex gap-4">
      <v-btn
        color="white"
        variant="tonal"
        size="x-large"
        rounded="xl"
        elevation="0"
        class="text-none font-weight-bold"
        prepend-icon="fa-brands fa-google"
        @click="login"
      >
        Login with Google
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { AuthService } from '@/services/auth';

const login = () => {
  AuthService.login();
};
</script>

<style scoped>
.landing-hero {
  min-height: 80vh;
  background: radial-gradient(circle at top right, rgba(0,255,128,0.05), transparent 40%),
              radial-gradient(circle at bottom left, rgba(0,255,128,0.05), transparent 40%);
}
</style>
