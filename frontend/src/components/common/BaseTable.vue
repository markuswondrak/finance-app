<template>
  <v-card variant="outlined" class="glass border card-accent-primary" rounded="lg">
    <v-table fixed-header :class="{ 'tight-table': xs }" hover>
      <slot></slot>
    </v-table>
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  name: 'BaseTable',
  setup() {
    const { xs } = useDisplay();
    return { xs };
  }
};
</script>