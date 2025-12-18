<template>
  <v-text-field
    :model-value="displayValue"
    :rules="valueRules"
    @blur="inputChanged"
    @focus="focus = true"
    :required="required"
    :label="label"
    variant="outlined"
    density="comfortable"
  />
</template>
<script>
import { toCurrency } from "../Utils";

export default {
  props: ["id", "label", "modelValue", "required"],
  emits: ["update:modelValue"],
  data() {
    return {
      focus: false,

      valueRules: [
        v => parseInt(v) > 0 || 'Betrag muss positiv und ungleich 0 sein',
      ],
    }
  },
  
  computed: {
    displayValue() {
      return this.focus ? this.modelValue : toCurrency(this.modelValue);
    }
  },
  methods: {
    inputChanged(e) {
      const newValue = Number(e.target.value);
      
      this.$emit("update:modelValue", isNaN(newValue) ? 0 : newValue);
      this.focus = false;
    }
  }
};
</script>