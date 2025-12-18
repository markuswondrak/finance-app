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
    <v-btn :value="false" class="flex-grow-1" color="error">
      Ausgabe
    </v-btn>
    <v-btn :value="true" class="flex-grow-1" color="success">
      Einnahme
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