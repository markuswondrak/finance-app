<template>
  <v-container class="landing-cta py-16 text-center">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-h4 font-weight-bold text-white mb-2">
          Finanzen smarter planen.
        </h2>
        <p class="text-h5 font-weight-bold text-income mb-8">
          Starte jetzt.
        </p>
        
        <v-btn
          color="white"
          variant="tonal"
          size="x-large"
          rounded="xl"
          elevation="0"
          class="text-none font-weight-bold px-8"
          prepend-icon="fa-brands fa-google"
          @click="login"
        >
          Login with Google
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { AuthService } from '@/services/auth';

const login = () => {
  AuthService.login();
};
</script>

<style scoped>
.landing-cta {
  background: transparent;
}
</style>
