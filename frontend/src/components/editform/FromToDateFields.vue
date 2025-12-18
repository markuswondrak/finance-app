<template>
  <v-row>
    <v-col>
      <month-year-datepicker
        label="Gültig ab"
        :model-value="fromDate"
        @update:model-value="updateFrom"
        :max="toDate"
      />
    </v-col>
    <v-col>
      <month-year-datepicker
        label="Gültig bis"
        :model-value="toDate"
        @update:model-value="updateTo"
        :min="fromDate"
        :error-messages="toDateErrors"
      />
    </v-col>
  </v-row>
</template>

<script>
import MonthYearDatepicker from '@/components/common/MonthYearDatepicker.vue';
import { dateToYearMonth, yearMonthToDate } from '@/services/dateAdapter';

export default {
  props: ['modelValue'],
  components: {
    MonthYearDatepicker
  },
  computed: {
    fromDate() {
      return yearMonthToDate(this.modelValue.from);
    },
    toDate() {
      return yearMonthToDate(this.modelValue.to);
    },
    toDateErrors() {
      if (!this.toDate || !this.fromDate) return [];
      if (this.toDate < this.fromDate) {
        return ["'Gültig bis' darf nicht kleiner als 'Gültig ab' sein"];
      }
      return [];
    }
  },
  methods: {
    updateFrom(date) {
      this.modelValue.from = dateToYearMonth(date);
    },
    updateTo(date) {
      this.modelValue.to = dateToYearMonth(date);
    }
  }
}
</script>