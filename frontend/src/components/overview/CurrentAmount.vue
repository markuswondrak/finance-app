<template>
  <v-banner sticky elevation="4" :icon="icon" :color="currentAmount >= 0 ? 'surface-bright' : 'surface'">
    <template v-slot:text>
      Aktueller Betrag:
      <strong :class="currentAmount >= 0 ? 'text-success' : 'text-error'">{{ toCurrency(currentAmount) }}</strong>
    </template>
    <template v-slot:actions>
      <v-btn variant="text" color="primary" @click="show = true">Ändern</v-btn>
    </template>
    <v-dialog v-model="show" max-width="600">
      <v-card class="card-accent-primary">
        <v-card-title class="text-primary">
          <span>Aktuellen Betrag ändern</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <currency-input label="Betrag" v-model="newAmount" />
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="show = false">Abbrechen</v-btn>
          <v-btn variant="flat" color="primary" @click="show = false">Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-banner>
</template>
<script>
import { useDisplay } from 'vuetify';
import CurrencyInput from "../editform/CurrencyInput.vue";
import { toCurrency } from "../Utils";

export default {
  components: {
    CurrencyInput
  },
  props: ["currentAmount"],
  setup() {
    const { smAndUp } = useDisplay();
    return { smAndUp };
  },
  computed: {
    icon() {
      return this.smAndUp ? "fa-piggy-bank" : undefined;
    }
  },
  data() {
    return {
      valid: true,
      show: false,
      newAmount: this.currentAmount
    };
  },
  methods: {
    toCurrency
  }
};
</script>