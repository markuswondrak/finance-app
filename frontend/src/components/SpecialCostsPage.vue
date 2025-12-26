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
               <special-cost-form btn-text="Neue Sonderkosten Hinzufügen" @refresh="loadEntries" />
            </template>
          </table-action-bar>

          <BaseTable>
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.key" :class="header.class">
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredEntries" :key="item.id">
                <td v-for="col in cols" :key="col.name" :class="[col.styleClass, col.name === 'amount' ? formatColor(item) : '']">
                  <div v-if="col.name === 'name'" class="d-flex align-center">
                    {{ transform(col.transformer, item[col.name]) }}
                    <template v-if="item.isSaving">
                      <v-icon v-if="item.amount > 0" icon="fa-money-bill-transfer" color="info" class="ml-2" size="small"></v-icon>
                      <v-icon v-else icon="fa-piggy-bank" color="warning" class="ml-2" size="small"></v-icon>
                    </template>
                  </div>
                  <span v-else>
                    {{ transform(col.transformer, item[col.name]) }}
                  </span>
                </td>
                <td align="right" width="100px">
                  <div class="d-flex align-center justify-end">
                    <special-cost-form :cost="item" @refresh="loadEntries" />
                    <delete-button :name="item.name" @confirm="deleteCost(item)"/>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredEntries || filteredEntries.length === 0">
                 <td :colspan="cols.length + 1" class="text-center text-medium-emphasis pa-4">
                  Keine Einträge bisher
                </td>
              </tr>
            </tbody>
          </BaseTable>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" location="bottom">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import LoadablePage from "./common/LoadablePage";
import { getSpecialCosts, deleteSpecialCost } from "../services/specialcosts";
import TableActionBar from "./common/TableActionBar.vue";
import { dateToYearMonth } from "@/services/dateAdapter";

import {
  CommonForm,
  toCurrency,
  monthlyCostToForm,
  displayMonth
} from "./common/Utils";
import SpecialCostForm from './editform/SpecialCostForm.vue';
import DeleteButton from './common/DeleteButton.vue';
import BaseTable from "@/components/common/BaseTable.vue";

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
    BaseTable,
    SpecialCostForm,
    DeleteButton,
    TableActionBar
  },
  data() {
    return {
      entries: [],
      search: "",
      date: null,
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
          class: col.styleClass,
          transformer: col.transformer
       }));
       h.push({ title: '', key: 'actions', align: 'right', width: '100px' });
       return h;
    },
    filteredEntries() {
      if (!this.entries) return [];
      
      const query = (this.search || "").toLowerCase();
      const target = dateToYearMonth(this.date);

      return this.entries.filter(cost => {
        // Search Filter
        const matchesSearch = !query || 
           (cost.name && cost.name.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;

        // Date Filter
        if (target) {
           // Exact match
           if (!cost.dueDate) return false;
           return cost.dueDate.year === target.year && 
                  cost.dueDate.month === target.month;
        }

        return true;
      });
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
    formatAmount(val) {
      const formatted = toCurrency(Math.abs(val));
      if (val > 0) return `+ ${formatted}`;
      if (val < 0) return `- ${formatted}`;
      return formatted;
    },
    formatColor(item) {
      if (item.amount > 0) return "text-success";
      if (item.amount < 0) return "text-error";
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