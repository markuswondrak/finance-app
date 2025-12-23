<template>
  <BaseTable :no-card="noCard">
    <thead>
      <tr>
        <th v-for="header in transformedHeaders" :key="header.key" :class="header.class">
          {{ header.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in entries" :key="item.id">
        <td v-for="col in visibleCols" :key="col.name" :class="[col.styleClass, col.name === 'amount' ? formatColor(item) : '']">
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
            <component :is="formComponent" :cost="item" @saved="$emit('saved')" />
            <delete-button :name="item.name" @confirm="$emit('delete-clicked', item)"/>
          </div>
        </td>
      </tr>
      <tr v-if="!entries || entries.length === 0">
        <td :colspan="visibleCols.length + 1" class="text-center text-medium-emphasis pa-4">
          Keine Einträge bisher
        </td>
      </tr>
    </tbody>

    <template #actions>
      <v-card-actions>
        <component :is="formComponent" btn-text="Neue Kosten Hinzufügen" btn-color="primary" @saved="$emit('saved')" />
      </v-card-actions>
    </template>
  </BaseTable>
</template>

<script>
import { useDisplay } from 'vuetify'
import BaseTable from "@/components/common/BaseTable.vue";
import { toCurrency } from "../common/Utils";
import ResponsiveDateCol from "../common/ResponsiveDateCol.vue";
import MonthlyCostEditForm from "../editform/MonthlyCostEditForm.vue";
import QuaterlyCostEditForm from "../editform/QuaterlyCostEditForm.vue";
import HalfyearlyCostEditForm from "../editform/HalfyearlyCostEditForm.vue";
import YearlyCostEditForm from "../editform/YearlyCostEditForm.vue";
import DeleteButton from '../common/DeleteButton.vue';

export default {
  props: {
    entries: Array,
    cols: Array,
    formComponent: String,
    noCard: {
      type: Boolean,
      default: false
    }
  },

  components: {
    BaseTable,
    ResponsiveDateCol,
    MonthlyCostEditForm,
    QuaterlyCostEditForm,
    HalfyearlyCostEditForm,
    YearlyCostEditForm,
    DeleteButton
  },
  setup() {
    const { smAndDown, mdAndUp } = useDisplay();
    return { smAndDown, mdAndUp };
  },
  methods: {
    transform: (f, v) => (f ? f(v) : v),
    filter(cols) {
      return cols.filter(col => {
        if (!col.hide) return true;
        return this.mdAndUp;
      });
    },
    formatColor(item) {
      if (item.amount > 0) return "text-success";
      if (item.amount < 0) return "text-error";
      return "";
    }
  },
  computed: {
    visibleCols() {
       return this.filter(this.cols);
    },
    transformedHeaders() {
      const filteredCols = this.visibleCols;
      const headers = filteredCols.map(col => ({
        title: col.label,
        key: col.name,
        sortable: false,
        class: col.styleClass,
        transformer: col.transformer
      }));
      headers.push({
        title: '',
        key: 'actions',
        sortable: false,
        align: 'right',
        width: '100px'
      });
      return headers;
    }
  }
};
</script>