<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <base-text-field
        :model-value="displayDate"
        :label="label"
        prepend-inner-icon="fa-calendar"
        :error-messages="errorMessages"
        clearable
        readonly
        v-bind="props"
        @click:clear="input(null)"
      />
    </template>
    <v-date-picker
      :model-value="dateObject"
      @update:modelValue="input"
      color="primary"
      :min="minDate"
      :max="max"
      hide-header
    />
  </v-menu>
</template>
<script>
import { displayMonth } from "../Utils";
import BaseTextField from "../common/BaseTextField.vue";

export default {
  props: ["modelValue", "min", "max", "label", "rules"],
  emits: ["update:modelValue"],
  components: {
    BaseTextField
  },

  data() {
    return {
      menu: false,
      errorMessages: []
    };
  },
  computed: {
    displayDate() {
      return displayMonth(this.modelValue, false, null);
    },
    dateObject() {
      if (!this.modelValue || !this.modelValue.year || !this.modelValue.month) return null;
      return new Date(this.modelValue.year, this.modelValue.month - 1, 1);
    },
    minDate() {
      if (this.min && typeof this.min === 'object') {
          return new Date(this.min.year, this.min.month - 1, 1);
      }
      return undefined;
    }
  },
  methods: {
    input(date) {
      let inputYearMonth = null;
      if (date) {
          const d = new Date(date);
          inputYearMonth = { year: d.getFullYear(), month: d.getMonth() + 1 };
      }
      
      this.$emit("update:modelValue", inputYearMonth);
      this.menu = false;

      this.errorMessages = [];

      if (!this.rules) return;

      this.rules.forEach(rule => {
        let valForRule = inputYearMonth ? `${inputYearMonth.year}-${String(inputYearMonth.month).padStart(2, '0')}` : null;
        
        const result = rule(valForRule);
        if (typeof result === "string") {
          this.errorMessages.push(result);
        }
      });
    }
  }
};
</script>