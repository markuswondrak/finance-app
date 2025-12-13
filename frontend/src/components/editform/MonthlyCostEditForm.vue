<template>
  <cost-edit-form
    :successMsg="successMsg('Monatliche Kosten')"
    :title="title('Monatliche Kosten')"
    :changed="changed"
    :btn-text="btnText"
    :name="form.name"
    @save="saveCost"
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
import { CommonForm, monthlyCostToForm, monthlyFormToCost } from "../Utils";
import CostEditForm from "./CostEditForm.vue";
import NameTextField from "./NameTextField.vue";
import FromToDateFields from "./FromToDateFields.vue";
import IncomingSelect from "./IncomingSelect.vue";

export default {
  mixins: [CommonForm(monthlyCostToForm, monthlyFormToCost, "/api/costs/monthly")],
  components: {
    CostEditForm,
    NameTextField,
    CurrencyInput,
    FromToDateFields,
    IncomingSelect
  },
  props: ["btnText"]
};
</script>