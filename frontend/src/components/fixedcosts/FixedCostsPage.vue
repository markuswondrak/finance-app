<template>
  <v-container>
    <v-row>
      <v-col>
        <v-skeleton-loader
          type="table-tbody"
          :loading="!loaded"
          transition="scale-transition"
          class="mx-auto"
        >
          <!-- Action Bar -->
          <table-action-bar
            v-model:search="search"
            v-model:date="date"
          >
            <template #action>
              <component 
                v-if="activeConfig"
                :is="activeConfig.formComponent" 
                btn-text="Neue Kosten Hinzufügen" 
                btn-color="success" 
                @saved="handleSaved" 
              />
            </template>
          </table-action-bar>

          <v-card variant="outlined" class="glass border card-accent-primary" rounded="lg">
            <v-tabs v-model="tab" grow>
              <v-tab
                v-for="config in tabsConfig"
                :key="config.label"
                :value="config.label"
              >{{ config.label }}</v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <v-window-item
                v-for="config in tabsConfig"
                :key="config.label + '-content'"
                :value="config.label"
              >
                <fixed-costs-table
                  :entries="config.filteredEntries"
                  :cols="config.cols"
                  :formComponent="config.formComponent"
                  no-card
                  @delete-clicked="deleteCost"
                  @saved="handleSaved"
                />
              </v-window-item>
            </v-window>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="bottom"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import FixedCostsTable from "./FixedCostTable.vue";
import LoadablePage from "../common/LoadablePage";
import TableActionBar from "../common/TableActionBar.vue";
import MonthlyCostEditForm from "../editform/MonthlyCostEditForm.vue";
import QuaterlyCostEditForm from "../editform/QuaterlyCostEditForm.vue";
import HalfyearlyCostEditForm from "../editform/HalfyearlyCostEditForm.vue";
import YearlyCostEditForm from "../editform/YearlyCostEditForm.vue";
import { dateToYearMonth } from "@/services/dateAdapter";

import {
  displayMonth,
  toCurrency,
  toQuaterlyDueDate,
  toHalfyearlyDueDate,
  toMonth
} from "../common/Utils";

const defaultCols = [
  { name: "name", label: "Bezeichnung", styleClass: "text-body-2" },
  { name: "amount", label: "Betrag", transformer: toCurrency, styleClass: "text-body-1 font-weight-bold" },
  {
    name: "from",
    label: "Gültig ab",
    transformer: displayMonth,
    hide: true,
    styleClass: "text-caption"
  },
  { name: "to", label: "Gültig bis", transformer: displayMonth, hide: true, styleClass: "text-caption" }
];

function cols(additionalCols = false) {
  if (!additionalCols) {
    return defaultCols;
  }
  const cols = [...defaultCols];
  cols.splice(1, 0, ...additionalCols);
  return cols;
}

const quaterlyCols = cols([
  { name: "dueMonth", label: "Fällig in", transformer: toQuaterlyDueDate, styleClass: "text-body-2" }
]);

const halfyearlyCols = cols([
  { name: "dueMonth", label: "Fällig in", transformer: toHalfyearlyDueDate, styleClass: "text-body-2" }
]);

const yearlyCols = cols([
  { name: "dueMonth", label: "Fällig im", transformer: toMonth, styleClass: "text-body-2" }
]);

export default {
  mixins: [LoadablePage],
  components: {
    FixedCostsTable,
    TableActionBar,
    MonthlyCostEditForm,
    QuaterlyCostEditForm,
    HalfyearlyCostEditForm,
    YearlyCostEditForm
  },
  data() {
    return {
      tab: null,
      search: "",
      date: null,
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },

      monthly: [],
      quaterly: [],
      halfyearly: [],
      yearly: [],

      monthlyCols: cols(),
      quaterlyCols,
      halfyearlyCols,
      yearlyCols
    };
  },
  computed: {
    tabsConfig() {
      return [
        {
          label: 'Monatliche Kosten',
          entries: this.monthly,
          filteredEntries: this.filterCosts(this.monthly),
          cols: this.monthlyCols,
          formComponent: 'monthly-cost-edit-form'
        },
        {
          label: 'Vierteljährliche Kosten',
          entries: this.quaterly,
          filteredEntries: this.filterCosts(this.quaterly),
          cols: this.quaterlyCols,
          formComponent: 'quaterly-cost-edit-form'
        },
        {
          label: 'Halbjährliche Kosten',
          entries: this.halfyearly,
          filteredEntries: this.filterCosts(this.halfyearly),
          cols: this.halfyearlyCols,
          formComponent: 'halfyearly-cost-edit-form'
        },
        {
          label: 'Jährliche Kosten',
          entries: this.yearly,
          filteredEntries: this.filterCosts(this.yearly),
          cols: this.yearlyCols,
          formComponent: 'yearly-cost-edit-form'
        }
      ];
    },
    activeConfig() {
      return this.tabsConfig.find(c => c.label === this.tab);
    }
  },
  created: async function() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      const data = await this.fetchData("/api/costs");
      this.monthly = data.monthly;
      this.quaterly = data.quarterly;
      this.halfyearly = data.halfyearly;
      this.yearly = data.yearly;
    },
    async deleteCost(cost) {
      await fetch(`/api/costs/${cost.id}`, { method: 'DELETE' });
      await this.loadData();
    },
    async handleSaved(message = "Kosten erfolgreich gespeichert") {
      await this.loadData();
      this.showSnackbar(message);
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    filterCosts(entries) {
      if (!entries) return [];
      
      const query = (this.search || "").toLowerCase();
      const target = dateToYearMonth(this.date);

      return entries.filter(cost => {
        // Search Filter
        const matchesSearch = !query || 
          (cost.name && cost.name.toLowerCase().includes(query)) ||
          (cost.description && cost.description.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        // Date Filter
        if (!target) return true; // No date selected

        const from = cost.from;
        const to = cost.to;

        if (!from) return true; // Safe fallback

        const targetVal = target.year * 12 + target.month;
        const fromVal = from.year * 12 + from.month;
        
        if (targetVal < fromVal) return false; // Target is before start

        if (to) {
          const toVal = to.year * 12 + to.month;
          if (targetVal > toVal) return false; // Target is after end
        }

        return true;
      });
    }
  }
};
</script>

<style scoped>
strong.red {
  color: red;
}
.tabs {
  width: 100%;
}
</style>
