<template>
  <v-checkbox
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    hint="Anhacken, wenn es sich bei dem Betrag um einen eingehenden (z.B. Gehalt) handelt."
    persistent-hint
    label="Eingehend"
    color="primary"
  />
</template>
<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"]
};
</script>