<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="displayDate"
        :label="label"
        prepend-icon="fa-calendar-week"
        :error-messages="errorMessages"
        clearable
        clear-icon="fa-xmark"
        readonly
        v-bind="props"
        @click:clear="input(null)"
      />
    </template>
    <v-date-picker
      :model-value="dateObject"
      @update:modelValue="input"
      color="blue"
      :min="minDate"
      :max="max"
      view-mode="year" 
    />
  </v-menu>
</template>
<script>
import { displayMonth } from "../Utils";

export default {
  props: ["modelValue", "min", "max", "label", "rules"],
  emits: ["update:modelValue"],

  data() {
    return {
      menu: false,
      errorMessages: []
    };
  },
  computed: {
    displayDate() {
      const dateObj = this.modelValue ? { year: this.modelValue[0], month: this.modelValue[1] } : null;
      return displayMonth(dateObj, false, null);
    },
    dateObject() {
      if (!this.modelValue) return null;
      return new Date(this.modelValue[0], this.modelValue[1] - 1, 1);
    },
    minDate() {
      if (this.min && Array.isArray(this.min)) {
          return new Date(this.min[0], this.min[1] - 1, 1);
      }
      return undefined;
    }
  },
  methods: {
    input(date) {
      let inputYearMonth = null;
      if (date) {
          const d = new Date(date);
          inputYearMonth = [d.getFullYear(), d.getMonth() + 1];
      }
      
      this.$emit("update:modelValue", inputYearMonth);
      this.menu = false;

      this.errorMessages = [];

      if (!this.rules) return;

      this.rules.forEach(rule => {
        // Validation rules might expect string or array?
        // Original code: `rule(e)` where e was string `YYYY-MM`.
        // Now e is array `[Y, M]`.
        // The rules used in `FromToDateFields`:
        // `d => !d || !this.value.from || new Date(d) >= new Date(this.value.from) ...`
        // `d` was passed from `input(e)` where `e` was `YYYY-MM`.
        // `new Date('YYYY-MM')` works.
        // `new Date([Y, M])` matches `new Date(Y, M)`? No. `new Date([2023, 1])` is Invalid Date.
        // So I should pass a Date object or ISO string to validation rules if they expect date.
        
        // I'll convert array to ISO string YYYY-MM for validation compatibility
        let valForRule = inputYearMonth ? `${inputYearMonth[0]}-${String(inputYearMonth[1]).padStart(2, '0')}` : null;
        
        const result = rule(valForRule);
        if (typeof result === "string") {
          this.errorMessages.push(result);
        }
      });
    }
  }
};
</script>