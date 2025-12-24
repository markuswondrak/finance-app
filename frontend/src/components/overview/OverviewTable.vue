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
          <td class="text-body-1">{{ formatResponsive(toCurrency(entry.sumFixedCosts)) }}</td>
          <td class="text-body-1">{{ formatResponsive(toCurrency(entry.sumSpecialCosts)) }}</td>
          <td
            class="amount text-h6"
            :class="getAmountColorClass(entry.currentAmount)"
          >{{ formatResponsive(toCurrency(entry.currentAmount)) }}</td>
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
    formatResponsive(value) {
      if (value.length > 5 && window.innerWidth < 768) {
        const tmp = value.split(/\s/);
        const amount = tmp[0];
        const currency = tmp.length > 1 ? tmp[1] : '€';
        
        const integerPart = amount.split(',')[0];
        if (integerPart.includes('.')) {
          const thousands = integerPart.split('.')[0];
          return thousands + 'T' + currency;
        }
        return integerPart + currency;
      }
      return value;
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