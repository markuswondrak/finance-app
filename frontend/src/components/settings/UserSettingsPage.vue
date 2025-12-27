<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" lg="6" class="mx-auto">
        <h1 class="text-h4 mb-6">Benutzereinstellungen</h1>
        
        <v-card class="mb-6" elevation="2">
          <v-card-title class="pa-4">Profil</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="auto">
                <v-avatar size="80" class="elevation-2">
                  <v-img v-if="user?.avatar_url" :src="user.avatar_url" alt="Avatar"></v-img>
                  <v-icon v-else icon="fa-user-circle" size="80"></v-icon>
                </v-avatar>
              </v-col>
              <v-col>
                <div class="text-h6">{{ user?.name }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ user?.email }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="mb-6">
          <v-card-title class="pa-4">Konto-Informationen</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-list density="comfortable">
              <v-list-item>
                <v-list-item-title class="text-caption text-uppercase text-medium-emphasis">Name</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">{{ user?.name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-uppercase text-medium-emphasis">Email</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">{{ user?.email }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="mb-6">
          <v-card-title class="pa-4 d-flex justify-space-between align-center">
            <span>Workspace</span>
            <v-btn
              color="success"
              variant="text"
              prepend-icon="fa-user-plus"
              @click="showInviteModal = true"
            >
              Mitglied einladen
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div v-if="workspace && workspace.Users">
                <v-list density="compact">
                    <v-list-item v-for="member in workspace.Users" :key="member.id" :title="member.name" :subtitle="member.email">
                        <template v-slot:prepend>
                            <v-avatar size="32">
                                <v-img v-if="member.avatar_url" :src="member.avatar_url"></v-img>
                                <v-icon v-else icon="fa-user"></v-icon>
                            </v-avatar>
                        </template>
                        <template v-slot:append>
                            <v-btn
                                v-if="member.id !== user?.id"
                                icon="fa-trash-can"
                                variant="text"
                                color="error"
                                size="small"
                                @click="confirmRemove(member)"
                            ></v-btn>
                            <v-chip
                                v-else
                                color="success"
                                size="small"
                                variant="outlined"
                            >
                                Du
                            </v-chip>
                        </template>
                    </v-list-item>
                </v-list>
            </div>
            <div v-else class="text-body-2 text-medium-emphasis">
              Laden...
            </div>
          </v-card-text>
          <v-divider v-if="workspace && workspace.Users.length > 1"></v-divider>
          <v-card-actions class="pa-4" v-if="workspace && workspace.Users.length > 1">
             <v-spacer></v-spacer>
             <v-btn color="error" variant="text" @click="confirmLeave">
               Workspace verlassen
             </v-btn>
          </v-card-actions>
        </v-card>

        <v-card elevation="2" class="mt-6 border-error" border>
          <v-card-title class="pa-4 text-error">Gefahrenzone</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div class="text-body-2 mb-4">
              Sobald Sie Ihr Konto löschen, gibt es kein Zurück mehr. Bitte seien Sie vorsichtig.
            </div>
            <v-btn
              color="error"
              variant="outlined"
              prepend-icon="fa-trash-can"
              @click="showDeleteModal = true"
            >
              Konto löschen
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Invite Member Modal -->
    <v-dialog v-model="showInviteModal" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="text-h5 pa-4">
          Mitglied einladen
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="mb-4">
            Senden Sie eine Einladung per E-Mail, um jemanden zu Ihrem Workspace hinzuzufügen.
          </p>
          <v-text-field
            v-model="inviteEmail"
            label="E-Mail Adresse"
            variant="outlined"
            density="compact"
            placeholder="freund@beispiel.de"
            :rules="[rules.required, rules.email]"
            @keyup.enter="sendInvite"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeInviteModal"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="success"
            :loading="inviteLoading"
            @click="sendInvite"
          >
            Einladung senden
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Account Modal -->
    <v-dialog v-model="showDeleteModal" max-width="500">
      <v-card rounded="xl">
        <v-card-title class="text-h5 pa-4">
          Konto wirklich löschen?
        </v-card-title>
        <v-card-text class="pa-4">
          <p class="mb-4">
            Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden unwiderruflich gelöscht.
          </p>
          <p class="mb-2 font-weight-bold">
            Bitte geben Sie "Ja ich bin sicher!" ein, um fortzufahren:
          </p>
          <v-text-field
            v-model="deleteConfirmationInput"
            label="Bestätigung"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="confirmDelete"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeDeleteModal"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="error"
            :disabled="deleteConfirmationInput !== 'Ja ich bin sicher!'"
            @click="confirmDelete"
          >
            Ja, Konto löschen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AuthService } from '@/services/auth';
import { workspaceService } from '@/services/workspaceService';

const user = ref(null);
const workspace = ref(null);
const showDeleteModal = ref(false);
const showInviteModal = ref(false);
const inviteEmail = ref('');
const inviteLoading = ref(false);
const deleteConfirmationInput = ref('');
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const rules = {
  required: value => !!value || 'Erforderlich.',
  email: value => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/
    return pattern.test(value) || 'Ungültige E-Mail.'
  },
}

onMounted(async () => {
  user.value = await AuthService.getUser();
  try {
      workspace.value = await workspaceService.getWorkspace();
  } catch (e) {
      console.error(e);
  }
});

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteConfirmationInput.value = '';
};

const closeInviteModal = () => {
  showInviteModal.value = false;
  inviteEmail.value = '';
};

const sendInvite = async () => {
  if (!inviteEmail.value) return;
  inviteLoading.value = true;
  try {
    await workspaceService.inviteMember(inviteEmail.value);
    showSnackbar('Einladung erfolgreich gesendet.', 'success');
    closeInviteModal();
  } catch (error) {
    showSnackbar(error.message, 'error');
  } finally {
    inviteLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (deleteConfirmationInput.value !== 'Ja ich bin sicher!') return;
  
  try {
    await AuthService.deleteAccount();
    showSnackbar('Ihr Konto wurde erfolgreich gelöscht.', 'success');
  } catch (error) {
    showSnackbar('Fehler beim Löschen des Kontos.', 'error');
  }
};

const showSnackbar = (text, color) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.border-error {
  border: 1px solid rgba(var(--v-theme-error), 0.5) !important;
}
</style>
