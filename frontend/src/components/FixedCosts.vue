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
          <v-card no-body rounded="xl" elevation="4">
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
                  :entries="config.entries"
                  :cols="config.cols"
                  :formComponent="config.formComponent"
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
import LoadablePage from "./LoadablePage";
import {
  displayMonth,
  toCurrency,
  toQuaterlyDueDate,
  toHalfyearlyDueDate,
  toMonth
} from "./Utils";

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
    FixedCostsTable
  },
  data() {
    return {
      tab: null,
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
          cols: this.monthlyCols,
          formComponent: 'monthly-cost-edit-form'
        },
        {
          label: 'Vierteljährliche Kosten',
          entries: this.quaterly,
          cols: this.quaterlyCols,
          formComponent: 'quaterly-cost-edit-form'
        },
        {
          label: 'Halbjährliche Kosten',
          entries: this.halfyearly,
          cols: this.halfyearlyCols,
          formComponent: 'halfyearly-cost-edit-form'
        },
        {
          label: 'Jährliche Kosten',
          entries: this.yearly,
          cols: this.yearlyCols,
          formComponent: 'yearly-cost-edit-form'
        }
      ];
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