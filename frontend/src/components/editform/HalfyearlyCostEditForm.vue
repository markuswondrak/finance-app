<template>
  <cost-edit-form
    :successMsg="successMsg('Halbjährige Kosten')"
    :title="title('Halbjährige Kosten')"
    :changed="changed"
    :btn-text="btnText"
    :btn-color="btnColor"
    :btn-variant="btnVariant"
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
  toSelectItems,
  healfyearlyStrings,
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
  mixins: [CommonForm(costToForm, formToCost, "/api/costs/halfyearly")],
  components: {
    CostEditForm,
    NameTextField,
    CurrencyInput,
    FromToDateFields,
    IncomingSelect
  },
  props: ["btnText", "btnColor", "btnVariant"],
  data() {
    return {
      items: toSelectItems(healfyearlyStrings)
    };
  }
};
</script>