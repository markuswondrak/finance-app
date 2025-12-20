<template>
  <base-text-field
    ref="input"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :rules="nameRules"
    :counter="20"
    label="Bezeichnung"
    :required="required"
  />
</template>
<script>
import BaseTextField from "../common/BaseTextField.vue";

export default {
  props: ["modelValue", "required"],
  emits: ["update:modelValue"],
  components: {
    BaseTextField
  },
  data() {
    return {
      nameRules: [
        v => !!v || "Bezeichnung darf nicht leer sein",
        v => (v && v.length <= 20) || "Bezeichnung muss weniger als 20 Zeichen haben"
      ]
    };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>