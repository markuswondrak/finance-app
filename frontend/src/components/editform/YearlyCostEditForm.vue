<template>
  <cost-edit-form
    :successMsg="successMsg('Jährliche Kosten')"
    :title="title('Jährliche Kosten')"
    :changed="changed"
    :btn-text="btnText"
    :name="form.name"
    @save="saveCost"
    @open="form = costToForm(cost)"
    ref="editform"
  >
    <v-row>
      <v-col>
        <name-text-field v-model="form.name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <currency-input label="Betrag" v-model="form.amount" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select :items="items" v-model="form.month" label="Fällig im" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <incoming-select v-model="form.incoming" />
      </v-col>
    </v-row>
    <v-row>
      <from-to-date-fields v-model="form.fromTo" />
    </v-row>
  </cost-edit-form>
</template>
<script>
import CurrencyInput from "./CurrencyInput.vue";
import {
  CommonForm,
  monthlyCostToForm,
  toSelectItems,
  monthMap,
  baseFormToCost
} from "../Utils";
import CostEditForm from "./CostEditForm.vue";
import NameTextField from "./NameTextField.vue";
import FromToDateFields from "./FromToDateFields.vue";
import IncomingSelect from "./IncomingSelect.vue";

const costToForm = cost => {
  const form = monthlyCostToForm(cost);
  return !cost
    ? {
        ...form,
        month: null
      }
    : {
        ...form,
        month: cost.dueMonth - 1
      };
};

const formToCost = form => {
  return {
    ...baseFormToCost(form),
    dueMonth: form.month + 1
  };
};

export default {
  mixins: [CommonForm(costToForm, formToCost, "/api/costs/yearly")],
  components: {
    CostEditForm,
    NameTextField,
    CurrencyInput,
    FromToDateFields,
    IncomingSelect
  },
  props: ["btnText"],
  data() {
    return {
      items: toSelectItems(monthMap)
    };
  }
};
</script>