<template>
  <v-dialog v-model="show">
    <template v-slot:activator="{ props }">
      <v-btn icon variant="text" v-bind="props">
        <v-icon size="small">fa-file-lines</v-icon>
      </v-btn>
    </template>
    <v-card v-if="detail" rounded="xl" elevation="4">
      <v-card-title class="healine">Details vom {{ displayMonth(detail.yearMonth, false) }}</v-card-title>
      <v-skeleton-loader
        :loading="!loaded"
        transition="scale-transition"
        type="table-tbody"
        class="mx-auto"
      >
        <v-card-text>
          <div v-if="specialCosts && specialCosts.length > 0">
            <h3>Sonderkosten:</h3>
            <v-table>
              <tbody>
                <tr :key="index" v-for="(cost, index) in specialCosts">
                  <td class="text-body-2">{{ cost.name }}</td>
                  <td :class="[getAmountColorClass(cost.amount), 'text-h5']">{{ toCurrency(cost.amount) }}</td>
                  <td align="right">
                    <special-cost-form :cost="cost" @refresh="loadData(detail.index)" />
                    <delete-button :name="cost.name" @confirm="deleteSpecialCost(cost.id)" />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <p></p>
          <div v-if="specialCosts && fixedCosts.length > 0">
            <h3>Fixkosten:</h3>
            <v-table fixed-header>
              <tbody>
                <tr :key="index" v-for="(cost, index) in fixedCosts">
                  <td class="text-body-2">{{ cost.name }}</td>
                  <td :class="[getAmountColorClass(cost.amount), 'text-h5']">{{ toCurrency(cost.amount) }}</td>
                  <td>{{ cost.displayType }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-skeleton-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadablePage from "../common/LoadablePage";
import DeleteButton from "../common/DeleteButton.vue";
import SpecialCostForm from "../editform/SpecialCostForm.vue";
import { displayMonth, toCurrency } from "../common/Utils";
import { deleteSpecialCost } from "../../services/specialcosts";

export default {
  mixins: [LoadablePage],
  components: { DeleteButton, SpecialCostForm },
  props: ["detail"],
  data() {
    return {
      show: false,
      fixedCosts: null,
      specialCosts: null
    };
  },
  watch: {
    show(val) {
      if (val && !this.fixedCosts && !this.specialCosts) {
        this.loadData(this.detail.index);
      }
    }
  },
  methods: {
    displayMonth,
    toCurrency,
    getAmountColorClass(amount) {
      // Costs are typically negative expenses
      if (amount > 0) return 'text-positive';
      if (amount < 0) return 'text-negative';
      return 'text-neutral';
    },
    loadData: async function(index) {
      const result = await this.fetchData(
        "/api/overview/detail?index=" + index
      );
      this.fixedCosts = result.fixedCosts || [];
      this.specialCosts = result.specialCosts || [];
    },
    async deleteSpecialCost(id) {
      try {
        await deleteSpecialCost(id);
        await this.loadData(this.detail.index);
      } catch (error) {
        console.error("Failed to delete special cost:", error);
      }
    }
  }
};
</script>