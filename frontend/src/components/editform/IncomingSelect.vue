<template>
  <v-btn-toggle
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    mandatory
    color="primary"
    variant="outlined"
    density="comfortable"
    class="w-100"
  >
    <v-btn value="expense" class="flex-grow-1" color="error">
      Ausgabe
    </v-btn>
    <v-btn value="income" class="flex-grow-1" color="success">
      Einnahme
    </v-btn>
    <v-btn value="saving" class="flex-grow-1" color="success">
      <v-icon start icon="fa-piggy-bank"></v-icon>
      Sparen
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
</style>
