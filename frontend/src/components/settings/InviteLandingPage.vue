<template>
  <v-container class="fill-height justify-center">
    <v-card class="pa-8 text-center glass-card" elevation="4" max-width="500" rounded="xl">
      <div class="mb-6">
        <v-icon icon="fa-users" size="64" color="primary"></v-icon>
      </div>
      <h1 class="text-h4 mb-4 font-weight-bold">Einladung zum Workspace</h1>
      
      <div v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <div v-else-if="error">
        <v-alert type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>
        <v-btn to="/" variant="text">Zur Startseite</v-btn>
      </div>
      
      <div v-else>
        <p class="text-body-1 mb-6">
          Sie wurden eingeladen, einem gemeinsamen Finanz-Workspace beizutreten.
          <span v-if="!user">Bitte melden Sie sich an, um fortzufahren.</span>
          <span v-else>Möchten Sie jetzt beitreten?</span>
        </p>

        <v-btn
          v-if="!user"
          color="primary"
          size="large"
          prepend-icon="fab fa-google"
          @click="login"
          block
        >
          Anmelden mit Google
        </v-btn>
        
        <v-btn
          v-else
          color="primary"
          size="large"
          :loading="joining"
          @click="joinWorkspace"
          block
        >
          Workspace beitreten
        </v-btn>
      </div>
    </v-card>

    <DestructiveJoinModal
      v-model="showDestructiveModal"
      :loading="joining"
      @confirm="confirmDestructiveJoin"
      @cancel="cancelDestructiveJoin"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '@/services/auth';
import { workspaceService } from '@/services/workspaceService';
import DestructiveJoinModal from './DestructiveJoinModal.vue';

const route = useRoute();
const router = useRouter();
const user = ref(null);
const loading = ref(true);
const joining = ref(false);
const error = ref(null);
const token = route.params.token;

const showDestructiveModal = ref(false);
const forceJoin = ref(false);

onMounted(async () => {
  try {
    user.value = await AuthService.getUser();
  } catch (e) {
    // Not logged in
  } finally {
    loading.value = false;
  }
});

const login = () => {
  localStorage.setItem('pending_invite_token', token);
  AuthService.login();
};

const joinWorkspace = async () => {
  joining.value = true;
  error.value = null;
  try {
    await workspaceService.joinWorkspace(token, forceJoin.value);
    // Success
    localStorage.removeItem('pending_invite_token');
    router.push('/overview');
  } catch (err) {
      if (err.data && err.data.code === 'EXISTING_DATA') {
          showDestructiveModal.value = true;
      } else if (err.data && err.data.code === 'INVITE_EXPIRED') {
          error.value = "Dieser Einladungslink ist abgelaufen. Bitte bitten Sie um eine neue Einladung.";
      } else {
          error.value = err.message || "Fehler beim Beitreten.";
      }
  } finally {
    joining.value = false;
  }
};

const confirmDestructiveJoin = () => {
    forceJoin.value = true;
    showDestructiveModal.value = false;
    joinWorkspace();
};

const cancelDestructiveJoin = () => {
    showDestructiveModal.value = false;
    forceJoin.value = false;
};
</script>