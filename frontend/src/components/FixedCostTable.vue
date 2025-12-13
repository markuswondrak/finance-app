<template>
  <v-card class="card-accent-primary">
    <v-card-text>
      <v-data-table
        :headers="transformedHeaders"
        :items="entries"
        class="elevation-1"
        :no-data-text="'Keine Einträge bisher'"
        hover
      >
        <!-- Custom item slots for each dynamic column to apply transformation and styleClass -->
        <template v-for="header in cols" #[`item.${header.name}`]="{ item }">
          <td :key="header.name" :class="header.styleClass">
            {{ transform(header.transformer, item[header.name]) }}
          </td>
        </template>

        <!-- Slot for action buttons (edit and delete) -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center">
            <component :is="formComponent" :cost="item" />
            <delete-button :name="item.name" @confirm="$emit('delete-clicked', item)"/>
          </div>
        </template>

      </v-data-table>
    </v-card-text>

    <v-card-actions>
      <component :is="formComponent" btn-text="Neue Kosten Hinzufügen" btn-color="primary" />
    </v-card-actions>
  </v-card>
</template>
<script>
import { useDisplay } from 'vuetify'
import { toCurrency } from "./Utils";
import ResponsiveDateCol from "./ResponsiveDateCol.vue";
import MonthlyCostEditForm from "./editform/MonthlyCostEditForm.vue";
import QuaterlyCostEditForm from "./editform/QuaterlyCostEditForm.vue";
import HalfyearlyCostEditForm from "./editform/HalfyearlyCostEditForm.vue";
import YearlyCostEditForm from "./editform/YearlyCostEditForm.vue";
import DeleteButton from './DeleteButton.vue';


export default {
  props: ["entries", "cols", "formComponent"],

  components: {
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
    }
  },
  computed: {
    transformedHeaders() {
      const filteredCols = this.filter(this.cols);
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