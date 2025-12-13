<template>
  <v-row>
    <v-col>
      <month-date-picker label="Gültig ab" v-model="modelValue.from" :max="modelValue.to" />
    </v-col>
    <v-col>
      <month-date-picker label="Gültig bis" v-model="modelValue.to" :rules="toDateRules" :min="modelValue.from" />
    </v-col>
  </v-row>
</template>
<script>
import MonthDatePicker from './MonthDatePicker.vue'

export default {
  props: ['modelValue'],
  components: {
    MonthDatePicker
  },
  data() {
    return {
      toDateRules: [
        d => {
          if (!d || !this.modelValue.from) return true;
          // modelValue.from is [year, month]
          const fromDate = new Date(this.modelValue.from[0], this.modelValue.from[1] - 1);
          // d is YYYY-MM string from MonthDatePicker
          const toDate = new Date(d);
          return toDate >= fromDate || "'Gültig bis' darf nicht kleiner als 'Gültig ab' sein";
        }
      ]
    }
  }
}
</script>