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
                :items="filteredEntries"
                class="elevation-1"
                :no-data-text="'Keine Einträge bisher'"
              >
                <template v-for="header in cols" #[`item.${header.name}`]="{ item }">
                  <td :key="header.name" :class="[header.styleClass, header.name === 'amount' ? formatAmountColor(item.amount) : '']">
                    <div v-if="header.name === 'name'" class="d-flex align-center">
                      {{ transform(header.transformer, item[header.name]) }}
                      <v-icon v-if="item.isSaving" icon="fa-piggy-bank" color="success" class="ml-2" size="small"></v-icon>
                    </div>
                    <span v-else>
                      {{ transform(header.transformer, item[header.name]) }}
                    </span>
                  </td>
                </template>
                <template v-slot:item.actions="{ item }">
                  <special-cost-form :cost="item" @refresh="loadEntries" />
                  <delete-button :name="item.name" @confirm="deleteCost(item)"/>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <special-cost-form btn-text="Neue Sonderkosten Hinzufügen" @refresh="loadEntries" />
            </v-card-actions>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import LoadablePage from "./LoadablePage";
import { getSpecialCosts, deleteSpecialCost } from "../services/specialcosts";

import {
  CommonForm,
  toCurrency,
  monthlyCostToForm,
  displayMonth
} from "./Utils";
import SpecialCostForm from './editform/SpecialCostForm.vue';
import DeleteButton from './DeleteButton.vue';

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
      snackbar: false,
      snackbarText: "",
      snackbarColor: "success"
    };
  },
  computed: {
    cols() {
      return [
        { name: "name", label: "Bezeichnung", styleClass: "text-body-2" },
        { name: "amount", label: "Betrag", transformer: this.formatAmount, styleClass: "text-body-1 font-weight-bold" },
        { name: "dueDate", label: "Fällig am", transformer: this.formatDate, styleClass: "text-body-2" }
      ];
    },
    headers() {
       const h = this.cols.map(col => ({
          title: col.label,
          key: col.name,
          sortable: false,
          transformer: col.transformer
       }));
       h.push({ title: '', key: 'actions', sortable: false, align: 'right' });
       return h;
    },
    filteredEntries() {
      if (!this.entries) return [];
      return this.entries.filter(entry => this.isFuture(entry.dueDate));
    }
  },
  methods: {
    transform: (f, v) => (f ? f(v) : v),
    async loadEntries() {
      this.entries = await getSpecialCosts();
    },
    async deleteCost(cost) {
      try {
        await deleteSpecialCost(cost.id);
        await this.loadEntries();
        this.showSnackbar("Sonderkosten erfolgreich gelöscht", "success");
      } catch (error) {
        console.error("Failed to delete special cost:", error);
        this.showSnackbar("Fehler beim Löschen der Sonderkosten", "error");
      }
    },
    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    isFuture(dateObj) {
      if (!dateObj) return false;
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 1-based
      
      if (dateObj.year > currentYear) return true;
      if (dateObj.year === currentYear && dateObj.month >= currentMonth) return true;
      return false;
    },
    formatAmount(val) {
      const formatted = toCurrency(Math.abs(val));
      if (val > 0) return `+ ${formatted}`;
      if (val < 0) return `- ${formatted}`;
      return formatted;
    },
    formatAmountColor(val) {
      if (val > 0) return "text-success";
      if (val < 0) return "text-error";
      return "";
    },
    formatDate(val) {
      return displayMonth(val);
    }
  },
  created: async function() {
    await this.loadEntries();
    this.loaded = true;
  }
};
</script>
