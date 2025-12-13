<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link to="/" prepend-icon="fa-chart-line" title="Überblick"></v-list-item>
        <v-list-item link to="/fixedcosts" prepend-icon="fa-money-check-dollar" title="Fixkosten"></v-list-item>
        <v-list-item link to="/specialcosts" prepend-icon="fa-money-bill-wave" title="Sonderkosten"></v-list-item>
        <v-list-group :opened="true">
          <template v-slot:activator>
            <v-list-item-title>Sonstiges</v-list-item-title>
          </template>
          <v-list-item link title="Einstellungen" append-icon="fa-gear"></v-list-item>
          <v-divider />
          <v-list-item link title="Impressum"></v-list-item>
          <v-list-item link title="Datenschutzerklärung"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" icon="fa-bars" />
      </template>
      <v-app-bar-title>Finanz-App</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer app>
      <span>
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