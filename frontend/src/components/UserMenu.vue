<template>
  <div v-if="user" class="user-menu-container">
    <v-menu
      v-model="menu"
      :close-on-content-click="true"
      location="bottom end"
      offset="5"
      transition="slide-y-transition"
      :content-class="'user-menu-content'"
    >
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          class="user-trigger d-flex align-center pl-1 pr-2 py-1 rounded-pill"
          role="button"
          tabindex="0"
        >
          <v-avatar size="36" class="mr-2" color="grey-darken-3">
            <v-img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              alt="Avatar"
              @error="handleImageError"
            ></v-img>
            <span v-else class="text-subtitle-2 font-weight-bold">{{ initials }}</span>
          </v-avatar>
          <v-icon icon="fa-chevron-down" size="x-small" class="chevron-icon"></v-icon>
        </div>
      </template>

      <v-card class="user-dropdown" width="260" elevation="10">
        <v-list bg-color="transparent" class="py-2" density="compact">
          <!-- User Info Header -->
          <v-list-item class="px-4 pb-2 pt-2">
            <v-list-item-title class="text-white font-weight-bold text-body-1 mb-1">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-grey-lighten-1 text-caption">
              {{ user.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2 border-opacity-25"></v-divider>

          <!-- Menu Items -->
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            :value="index"
            class="menu-item mx-2 rounded mb-1"
            @click="item.action"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" size="small" class="mr-3 text-grey-lighten-1"></v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium text-grey-lighten-1">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>

          <!-- Logout Separate -->
           <v-list-item
            class="menu-item mx-2 rounded"
            @click="logout"
          >
            <template v-slot:prepend>
              <v-icon icon="fa-right-from-bracket" size="small" class="mr-3 text-grey-lighten-1"></v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium text-grey-lighten-1">
              Log Out
            </v-list-item-title>
          </v-list-item>

        </v-list>
      </v-card>
    </v-menu>
  </div>
  <div v-else class="login-container">
      <v-btn
        class="login-button text-none px-6"
        rounded="pill"
        variant="outlined"
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
const menu = ref(false);

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
  menu.value = false;
  await AuthService.logout();
  user.value = null;
};

const login = () => {
    AuthService.login();
}

const handleImageError = () => {
    if (user.value) {
        user.value.avatar_url = null;
    }
}

const menuItems = [
    { title: 'Profile Settings', icon: 'fa-user-gear', action: () => {} },
    { title: 'Subscription', icon: 'fa-credit-card', action: () => {} },
];

</script>

<style scoped>
.user-menu-container, .login-container {
    margin-right: 16px;
}

.login-button {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: #4ADE80 !important; /* Brand Green */
    font-weight: 500;
    transition: all 0.3s ease;
}

.login-button:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(74, 222, 128, 0.5) !important; /* Brand Green Border on hover */
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.2);
}

.user-trigger {
    transition: all 0.2s ease;
    border: 1px solid transparent;
    cursor: pointer;
}

.user-trigger:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(74, 222, 128, 0.3); /* Green accent subtle border */
    box-shadow: 0 0 12px rgba(74, 222, 128, 0.15); /* Green glow */
}

.user-trigger .chevron-icon {
    color: #9CA3AF; /* text-neutral */
    transition: transform 0.2s ease;
}

.user-trigger:hover .chevron-icon {
    color: #4ADE80; /* text-positive / green */
}

.user-dropdown {
    background-color: #1a1a1a !important;
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}

.menu-item {
    transition: background-color 0.2s ease;
    min-height: 40px;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
}

.v-divider {
    border-color: rgba(255, 255, 255, 0.1);
}
</style>