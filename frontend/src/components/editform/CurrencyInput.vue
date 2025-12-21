<template>
  <base-text-field
    :model-value="displayValue"
    :rules="valueRules"
    @input="inputChanged"
    @blur="focus = false"
    @focus="focus = true"
    :required="required"
    :label="label"
  />
</template>
<script>
import { toCurrency } from "../common/Utils";
import BaseTextField from "../common/BaseTextField.vue";

export default {
  props: ["id", "label", "modelValue", "required"],
  emits: ["update:modelValue"],
  components: {
    BaseTextField
  },
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
    }
  }
};
</script>