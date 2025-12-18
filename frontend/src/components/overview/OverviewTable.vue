<template>
  <v-card class="card-accent-primary" rounded="xl" elevation="4">
    <v-table fixed-header :class="{ 'tight-table': xs }" hover>
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
            <special-cost-form :cost="cost(index, entry.yearMonth)" icon="fa-square-plus"/>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
<script>
import { useDisplay } from 'vuetify'
import OverviewDetails from "./OverviewDetails.vue";
import { displayMonth, toCurrency } from "../Utils";
import SpecialCostForm from "../editform/SpecialCostForm.vue";

export default {
  props: ["entries"],
  components: {
    OverviewDetails,
    SpecialCostForm
  },
  setup() {
    const { xs } = useDisplay();
    return { xs };
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
        var tmp = value.split(" ");
        var rest = tmp[0].substring(0, tmp[0].length - 2);
        return rest + " T" + tmp[1];
      } else {
        return value;
      }
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