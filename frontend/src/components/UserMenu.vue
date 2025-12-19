<template>
  <div v-if="user" class="user-menu">
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
        >
          <v-avatar color="primary" size="large">
            <v-img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              alt="Avatar"
              @error="handleImageError"
            ></v-img>
            <span v-else class="text-h5">{{ initials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="primary">
              <v-img
                v-if="user.avatar_url"
                :src="user.avatar_url"
                @error="handleImageError"
              ></v-img>
              <span v-else class="text-h5">{{ initials }}</span>
            </v-avatar>
            <h3 class="mt-2">{{ user.name }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn
              rounded
              variant="text"
              @click="logout"
            >
              Log Out
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
  <div v-else>
      <v-btn
        variant="text"
        @click="login"
      >
        Log In
      </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { AuthService } from '@/services/auth';

const user = ref(null);

const initials = computed(() => {
  if (!user.value || !user.value.name) return '?';
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

onMounted(async () => {
  user.value = await AuthService.getUser();
});

const logout = async () => {
  await AuthService.logout();
  user.value = null;
};

const login = () => {
    AuthService.login();
}

const handleImageError = () => {
    // Fallback if image fails to load, e.g. set avatar_url to null to show initials
    if (user.value) {
        user.value.avatar_url = null;
    }
}
</script>

<style scoped>
.user-menu {
    margin-right: 16px;
}
</style>