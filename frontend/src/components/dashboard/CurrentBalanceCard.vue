<template>
  <v-card
    class="current-balance-card fill-height"
    elevation="2"
    @click="openModal"
    v-ripple
    rounded="xl"
  >
    <v-card-text class="d-flex flex-column align-center justify-center fill-height">
      <div class="text-subtitle-1 mb-2">Aktueller Kontostand</div>
      <div class="text-h3 font-weight-bold text-success">
        {{ formattedAmount }}
      </div>
      <v-icon
        color="grey-lighten-1"
        class="mt-2 edit-icon"
        size="small"
      >
        mdi-pencil
      </v-icon>
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

.edit-icon {
  opacity: 0;
  transition: opacity 0.2s;
}

.current-balance-card:hover .edit-icon {
  opacity: 1;
}
</style>
