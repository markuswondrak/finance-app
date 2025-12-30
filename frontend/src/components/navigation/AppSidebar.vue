<template>
  <v-navigation-drawer
    id="app-navigation"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :rail="rail"
    :temporary="temporary"
    app
    color="surface"
  >
    <!-- Drawer Header (Logo) - Hidden on mobile if redundant, but keeping for now or hiding? 
         Let's keep it consistent, but maybe hide if temporary? 
         Requirements imply mobile has top bar. Let's hide sidebar header on mobile for cleaner look. -->
    <div v-if="!temporary" class="d-flex align-center pa-2" :class="rail ? 'justify-center' : ''" style="height: 64px;">
      <v-avatar size="40" class="elevation-2">
        <v-img src="/finapp_logo.png" alt="Logo"></v-img>
      </v-avatar>
      
      <div v-if="!rail" class="ml-3 font-weight-bold text-h6">
        <span class="text-income">Finanz</span><span class="text-white">-App</span>
      </div>
    </div>
    
    <v-divider v-if="!temporary"></v-divider>

    <v-list nav density="compact" class="mt-2">
      <v-list-item
        v-for="(item, i) in navigationItems"
        :key="i"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        active-class="nav-item-active"
        color="transparent"
      ></v-list-item>
    </v-list>

    <!-- Desktop Toggle Handle -->
    <div
      v-if="!temporary"
      class="rail-toggle-zone"
      @click="$emit('update:rail', !rail)"
    >
      <div class="rail-toggle-handle">
        <v-icon :icon="rail ? 'fa-chevron-right' : 'fa-chevron-left'" size="10" color="grey-lighten-1"></v-icon>
      </div>
    </div>

    <template v-slot:append>
      <v-divider class="mb-2"></v-divider>
      
      <v-list density="compact" nav>
        <v-menu
          v-if="user"
          v-model="menu"
          :close-on-content-click="true"
          location="end bottom"
          offset="10"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              class="profile-item rounded-lg"
              :title="user.name"
              append-icon="fa-chevron-right"
            >
              <template v-slot:prepend>
                <v-avatar size="32" class="me-0">
                  <v-img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    alt="Avatar"
                    @error="handleImageError"
                  ></v-img>
                  <v-icon v-else icon="fa-user-circle" size="32"></v-icon>
                </v-avatar>
              </template>
            </v-list-item>
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
                :to="item.disabled ? null : item.to"
                :disabled="item.disabled"
                :style="item.disabled ? 'opacity: 0.5; pointer-events: none;' : ''"
                @click="!item.disabled && item.action ? item.action() : null"
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

        <v-list-item
          v-else
          class="login-item rounded-lg"
          title="Log In"
          @click="login"
        >
          <template v-slot:prepend>
             <v-icon icon="fa-arrow-right-to-bracket" size="24"></v-icon>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AuthService } from '@/services/auth';

defineProps({
  modelValue: {
    type: [Boolean, null],
    default: null
  },
  rail: {
    type: Boolean,
    default: false
  },
  temporary: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'update:rail'])

const navigationItems = ref([
  { title: 'Überblick', to: '/overview', icon: 'fa-chart-line' },
  { title: 'Vermögen', to: '/wealth-overview', icon: 'fa-piggy-bank' },
  { title: 'Spielraum', to: '/save-to-spend', icon: 'fa-wallet' },
  { title: 'Fixkosten', to: '/fixedcosts', icon: 'fa-money-check-dollar' },
  { title: 'Sonderkosten', to: '/specialcosts', icon: 'fa-money-bill-wave' },
  { title: 'Hilfe', to: '/help', icon: 'fa-circle-question' }
])

// User Logic
const user = ref(null);
const menu = ref(false);

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
    { title: 'Profile Settings', icon: 'fa-user-gear', to: '/settings' },
    { title: 'Subscription', icon: 'fa-credit-card', to: '/subscription', disabled: true },
];
</script>

<style scoped>
.nav-item-active {
  position: relative;
  font-weight: bold;
  color: #00E676 !important; /* Mint Green */
}

.nav-item-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #00E676; /* Mint Green */
  border-radius: 0 4px 4px 0;
  opacity: 1 !important; /* Override potential Vuetify overlays */
}

.profile-item {
    transition: background-color 0.2s ease;
    cursor: pointer;
}
.profile-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
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

.login-item {
    color: #4ADE80;
}
.login-item:hover {
    background-color: rgba(74, 222, 128, 0.1);
}

/* Desktop Sidebar Toggle */
.rail-toggle-zone {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Align handle to right edge */
}

.rail-toggle-handle {
  width: 14px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 4px 0 0 4px;
  opacity: 0;
  transition: all 0.2s ease;
  border: 1px solid rgba(255,255,255,0.1);
  border-right: none;
  transform: translateX(5px);
}

.rail-toggle-zone:hover .rail-toggle-handle {
  opacity: 1;
  transform: translateX(0);
}
</style>
    