<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-card class="border-error" border rounded="xl">
      <v-card-title class="text-h5 pa-4 text-error">
        <v-icon icon="fa-triangle-exclamation" class="mr-2"></v-icon>
        Achtung: Datenverlust
      </v-card-title>
      <v-card-text class="pa-4">
        <p class="mb-4">
          Sie sind dabei, einem neuen Workspace beizutreten.
          <strong>Ihre aktuellen persönlichen Daten (Fixkosten, Budgets, etc.) werden unwiderruflich gelöscht.</strong>
        </p>
        <p class="mb-2">
          Bitte bestätigen Sie, dass Sie Ihre bestehenden Daten löschen und dem neuen Workspace beitreten möchten.
        </p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="$emit('cancel')"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
          @click="$emit('confirm')"
        >
          Daten löschen & Beitreten
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  loading: Boolean
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
.border-error {
  border: 1px solid rgba(var(--v-theme-error), 0.5) !important;
}
</style>
