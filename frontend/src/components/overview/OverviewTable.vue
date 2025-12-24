<template>
  <BaseTable>
      <thead>
        <tr>
          <th>Monat</th>
          <th>Fixe Kosten</th>
          <th>Sonder Kosten</th>
          <th>Saldo</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(entry, index) in entries">
          <td class="text-body-2">{{ formatMonth(entry) }}</td>
          <td class="text-body-1">{{ toCurrency(entry.sumFixedCosts, true) }}</td>
          <td class="text-body-1">{{ toCurrency(entry.sumSpecialCosts, true) }}</td>
          <td
            class="amount text-h6"
            :class="getAmountColorClass(entry.currentAmount)"
          >{{ toCurrency(entry.currentAmount, true) }}</td>
          <td align="right" class="action-cell">
            <overview-details v-if="!entry.empty" :detail="{...entry, index}" />
            <special-cost-form :cost="cost(index, entry.yearMonth)" icon="fa-square-plus" @refresh="$emit('refresh')"/>
          </td>
        </tr>
      </tbody>
  </BaseTable>
</template>
<script>
import OverviewDetails from "./OverviewDetails.vue";
import { displayMonth, toCurrency } from "../common/Utils";
import SpecialCostForm from "../editform/SpecialCostForm.vue";
import BaseTable from "@/components/common/BaseTable.vue";

export default {
  props: ["entries"],
  components: {
    BaseTable,
    OverviewDetails,
    SpecialCostForm
  },
  data() {
    return {
      month: "No Month"
    };
  },
  methods: {
    toCurrency,
    formatMonth({ yearMonth }) {
       return displayMonth(yearMonth);
    },
    getAmountColorClass(amount) {
      if (amount > 0) return 'positive-amount';
      if (amount < 0) return 'negative-amount';
      return 'text-neutral';
    },
    cost(index, dueYearMonth) {
      return {
        index,
        name: "",
        amount: 0,
        dueDate: dueYearMonth
      };
    }
  }
};
</script>