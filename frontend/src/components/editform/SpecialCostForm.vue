<template>
  <cost-edit-form
    ref="editform"
    :title="title('Sonderkosten')"
    :successMsg="successMsg('Sonderkosten')"
    :changed="changed"
    :btn-text="btnText"
    :icon="icon"
    :name="form.name"
    @save="saveCost"
    @open="form = costToForm(cost)"
  >
    <v-row>
      <v-col cols="12">
        <base-text-field
          label="Bezeichnung"
          v-model="form.name"
          required
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12" sm="6">
        <base-text-field
          label="Betrag"
          v-model.number="form.amount"
          type="number"
          prefix="€"
          required
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <incoming-select v-model="form.type" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <month-year-datepicker
          v-model="dueDateObject"
          label="Fällig am"
        />
      </v-col>
    </v-row>
  </cost-edit-form>
</template>
<script>
import CostEditForm from "./CostEditForm.vue";
import MonthYearDatepicker from "@/components/common/MonthYearDatepicker.vue";
import BaseTextField from "@/components/common/BaseTextField.vue";
import { dateToYearMonth, yearMonthToDate } from "@/services/dateAdapter";
import { monthlyCostToForm, CommonForm, baseFormToCost } from "../common/Utils";
import { saveSpecialCost } from "../../services/specialcosts";
import IncomingSelect from "./IncomingSelect.vue";

const costToForm = cost => {
  const form = monthlyCostToForm(cost);
  return !cost
    ? {
        ...form,
        dueDate: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }
      }
    : {
        ...form,
        dueDate: cost.dueDate
      };
};

const formToCost = form => ({
  ...baseFormToCost(form),
  dueDate: form.dueDate
})

export default {
  mixins: [CommonForm(costToForm, formToCost, '/api/specialcosts')],
  components: {
    CostEditForm,
    MonthYearDatepicker,
    BaseTextField,
    IncomingSelect
  },
  props: ["btnText", "icon"],
  computed: {
    // These computed properties are added for testing compatibility (T012)
    type() {
      return this.form.type === 'income' ? 'income' : 'expense';
    },
    backendAmount() {
      return this.form.amount === 0 ? 0 : this.form.amount * (this.form.type === 'income' ? 1 : -1);
    },
    dueDateObject: {
      get() {
        return yearMonthToDate(this.form.dueDate);
      },
      set(date) {
        this.form.dueDate = dateToYearMonth(date);
      }
    }
  },
  methods: {
    async saveCost() {
      const cost = formToCost(this.form);
      try {
        await saveSpecialCost(cost);
        this.$refs.editform.success();
        this.$emit('refresh');
      } catch (error) {
        console.error("Failed to save special cost:", error);
        this.$refs.editform.error("Fehler beim Speichern der Sonderkosten.");
      }
    }
  }
};
</script>
<style scoped>
.w-100 {
  width: 100%;
}
</style>