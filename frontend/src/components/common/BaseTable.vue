<template>
  <v-card v-if="!noCard" variant="outlined" class="glass border card-accent-primary" rounded="lg" style="overflow: visible;">
    <v-table :class="{ 'tight-table': xs }" class="sticky-table" hover>
      <slot></slot>
    </v-table>
    <slot name="actions"></slot>
  </v-card>
  <div v-else>
    <v-table :class="{ 'tight-table': xs }" class="sticky-table" hover>
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

<style scoped>
/* Custom Sticky Header Implementation */
:deep(.v-table__wrapper) {
  overflow: visible; /* Allow header to stick relative to viewport */
}

:deep(table > thead > tr > th) {
  position: sticky !important;
  top: 0 !important;
  z-index: 2;
  background-color: rgb(30, 30, 30) !important; /* Match glass theme background */
  box-shadow: 0 1px 0px rgba(255, 255, 255, 0.1);
}

/* Mobile App Bar Offset */
@media (max-width: 600px) {
  :deep(table > thead > tr > th) {
    top: 64px !important; /* Vuetify default app-bar height */
  }
}
</style>