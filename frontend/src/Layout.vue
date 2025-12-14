<template>
  <v-app id="inspire">
    <AppSidebar v-model="drawer" :rail="rail" />

    <v-app-bar app clipped-left color="surface-bright" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="toggleDrawer" :icon="navIcon" color="income" />
      </template>
      <v-app-bar-title></v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer app color="surface" class="justify-center">
      <span class="text-grey">
        &copy; 2019
        <a href="https://wondee.info">wondee.info</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/Navigation/AppSidebar.vue'

const { mobile } = useDisplay()
const drawer = ref(null)
const rail = ref(false)

const navIcon = computed(() => {
  if (mobile.value) return 'fa-bars'
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