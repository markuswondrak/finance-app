<template>
  <v-btn-toggle
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    mandatory
    color="primary"
    variant="outlined"
    density="comfortable"
    class="w-100 flex-wrap custom-toggle"
  >
    <v-btn value="expense" class="flex-grow-1 toggle-item" color="error">
      Ausgabe
    </v-btn>  
    <v-btn value="income" class="flex-grow-1 toggle-item" color="success">
      Einnahme
    </v-btn>
    <v-btn value="saving" class="flex-grow-1 toggle-item" color="warning">
      <v-icon start icon="fa-piggy-bank"></v-icon>
      Sparen
    </v-btn>
    <v-btn value="wealth_extraction" class="flex-grow-1 toggle-item" color="info">
      <v-icon start icon="fa-money-bill-transfer"></v-icon>
      Entnahme
    </v-btn>
  </v-btn-toggle>
</template>
<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"]
};
</script>
<style scoped>
.w-100 {
  width: 100%;
}
.flex-wrap {
  flex-wrap: wrap;
}
/* Ensure 2 items per row on small screens with consistent height */
@media (max-width: 600px) {
  .custom-toggle {
    height: auto !important;
    display: flex !important;
    flex-wrap: wrap !important;
  }
  .toggle-item {
    flex-basis: 50% !important;
    height: 48px !important; /* Matches default Vuetify button height */
    border-radius: 0 !important;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
  /* Fix borders for the 2x2 grid */
  .toggle-item:nth-child(odd) {
    border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }
}
</style>
