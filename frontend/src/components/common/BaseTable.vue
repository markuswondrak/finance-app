<template>
  <v-card v-if="!noCard" variant="outlined" class="glass border card-accent-primary" rounded="lg">
    <v-table fixed-header :class="{ 'tight-table': xs }" hover>
      <slot></slot>
    </v-table>
    <slot name="actions"></slot>
  </v-card>
  <div v-else>
    <v-table fixed-header :class="{ 'tight-table': xs }" hover>
      <slot></slot>
    </v-table>
    <slot name="actions"></slot>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify'

export default {
  name: 'BaseTable',
  props: {
    noCard: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { xs } = useDisplay();
    return { xs };
  }
};
</script>