<template>
  <cost-edit-form
    :successMsg="successMsg('Vierteljährliche Kosten')"
    :title="title('Vierteljährliche Kosten')"
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
        <v-select :items="items" v-model="form.dueMonth" label="Fällig in" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <incoming-select v-model="form.type" />
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
  quaterlyStrings,
  toSelectItems,
  baseFormToCost
} from "../common/Utils";
import CostEditForm from "./CostEditForm.vue";
import NameTextField from "./NameTextField.vue";
import FromToDateFields from "./FromToDateFields.vue";
import IncomingSelect from "./IncomingSelect.vue";

const costToForm = cost => {
  const form = monthlyCostToForm(cost);
  return !cost
    ? {
        ...form,
        dueMonth: null
      }
    : {
        ...form,
        dueMonth: cost.dueMonth - 1
      };
};

const formToCost = form => {
  return {
    ...baseFormToCost(form),
    dueMonth: form.dueMonth + 1
  };
};

export default {
  mixins: [CommonForm(costToForm, formToCost, "/api/costs/quaterly")],
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
      items: toSelectItems(quaterlyStrings)
    };
  }
};
</script>