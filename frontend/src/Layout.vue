<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped color="surface">
      <v-list dense nav>
        <v-list-item
          link
          to="/"
          prepend-icon="fa-chart-line"
          title="Überblick"
          color="primary"
        ></v-list-item>
        <v-list-item
          link
          to="/fixedcosts"
          prepend-icon="fa-money-check-dollar"
          title="Fixkosten"
          color="primary"
        ></v-list-item>
        <v-list-item
          link
          to="/specialcosts"
          prepend-icon="fa-money-bill-wave"
          title="Sonderkosten"
          color="primary"
        ></v-list-item>
        <v-divider class="my-2" />
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="fa-ellipsis" title="Sonstiges" />
          </template>
          <v-list-item link title="Einstellungen" prepend-icon="fa-gear" color="primary"></v-list-item>
          <v-divider />
          <v-list-item link title="Impressum"></v-list-item>
          <v-list-item link title="Datenschutzerklärung"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="surface-bright" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" icon="fa-bars" color="primary" />
      </template>
      <v-app-bar-title>
        <span class="text-primary font-weight-bold">Finanz</span><span class="text-white">-App</span>
      </v-app-bar-title>
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

<script>
import { RouterView } from 'vue-router'

export default {
  components: {
    RouterView
  },
  data: () => ({
    drawer: null
  })
}
</script>