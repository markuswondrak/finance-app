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
          <v-card rounded="xl" elevation="4">
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="entries"
                class="elevation-1"
                :no-data-text="'Keine Einträge bisher'"
              >
                <template v-for="header in cols" #[`item.${header.name}`]="{ item }">
                  <td :key="header.name" :class="header.styleClass">
                    {{ transform(header.transformer, item[header.name]) }}
                  </td>
                </template>
                <template v-slot:item.actions="{ item }">
                  <special-cost-form :cost="item"/>
                  <delete-button :name="item.name" @confirm="deleteCost(item)"/>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <special-cost-form btn-text="Neue Sonderkosten Hinzufügen" />
            </v-card-actions>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadablePage from "./LoadablePage";

import {
  CommonForm,
  toCurrency,
  monthlyCostToForm,
  displayMonth
} from "./Utils";
import SpecialCostForm from './editform/SpecialCostForm.vue';
import DeleteButton from './DeleteButton.vue';

const cols = [
  { name: "name", label: "Bezeichnung", styleClass: "text-body-2" },
  { name: "amount", label: "Betrag", transformer: toCurrency, styleClass: "text-body-1 font-weight-bold" },
  { name: "dueDate", label: "Fällig am", transformer: displayMonth, styleClass: "text-body-2" }
];

const costToForm = cost => {
  const form = monthlyCostToForm(cost);

  return !cost
    ? {
        ...form,
        dueYearMonth: null
      }
    : {
        ...form,
        dueYearMonth: cost.dueYearMonth
      };
};

export default {
  mixins: [LoadablePage, CommonForm(costToForm)],
  components: {
    SpecialCostForm,
    DeleteButton
  },
  data() {
    return {
      entries: [],
      cols
    };
  },
  computed: {
    headers() {
       const h = this.cols.map(col => ({
          title: col.label,
          key: col.name,
          sortable: false,
          transformer: col.transformer
       }));
       h.push({ title: '', key: 'actions', sortable: false, align: 'right' });
       return h;
    }
  },
  methods: {
    transform: (f, v) => (f ? f(v) : v),
    async deleteCost(cost) {
      await fetch(`/api/specialcosts/${cost.id}`, { method: 'DELETE' });
      const data = await this.fetchData("/api/specialcosts");
      this.entries = data;
    }
  },
  created: async function() {
    const data = await this.fetchData("/api/specialcosts");
    this.entries = data;
  }
};
</script>