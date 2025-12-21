<template>
  <v-card
    class="current-balance-card fill-height"
    :elevation="4"
    @click="openModal"
    v-ripple
    rounded="xl"
    :class="accentClass"
  >
    <v-card-text class="d-flex align-center fill-height">
      <div>
        <div class="d-flex align-center mb-1">
          <div class="text-overline">Aktueller Kontostand</div>
          <v-icon
            class="ml-2"
            size="x-small"
            color="grey-lighten-1"
            icon="fa-pencil"
          />
        </div>
        <div class="text-h4 font-weight-bold" :class="amountClass">
          {{ formattedAmount }}
        </div>
      </div>
    </v-card-text>

    <BalanceEditModal
      v-model="isModalOpen"
      :current-amount="amount"
      @saved="$emit('refresh')"
    />
  </v-card>
</template>

<script>
import BalanceEditModal from './BalanceEditModal.vue';

export default {
  name: 'CurrentBalanceCard',
  components: {
    BalanceEditModal,
  },
  props: {
    amount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['refresh'],
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {
    formattedAmount() {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(this.amount);
    },
    amountClass() {
      return this.amount >= 0 ? 'text-positive' : 'text-negative';
    },
    accentClass() {
      return this.amount >= 0 ? 'card-accent-success' : 'card-accent-error';
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
  },
};
</script>

<style scoped>
.current-balance-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.current-balance-card:hover {
  transform: translateY(-2px);
}
</style>