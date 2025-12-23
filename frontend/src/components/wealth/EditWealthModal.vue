<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400">
    <v-card rounded="xl">
      <v-card-title class="text-h5 pa-4">
        Aktuelles Vermögen bearbeiten
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-text-field
          v-model.number="localValue"
          label="Startkapital"
          type="number"
          suffix="€"
          autofocus
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          @keyup.enter="save"
          :error-messages="error"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="cancel"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="success"
          variant="flat"
          @click="save"
          :loading="loading"
          class="px-6"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  initialValue: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localValue = ref(0);
const loading = ref(false);
const error = ref('');

watch(() => props.modelValue, (val) => {
  if (val) {
    localValue.ref = props.initialValue;
    localValue.value = props.initialValue;
    error.value = '';
  }
});

const cancel = () => {
  emit('update:modelValue', false);
};

const save = () => {
  if (localValue.value === null || localValue.value === '') {
    error.value = 'Bitte geben Sie einen Betrag ein.';
    return;
  }
  if (localValue.value < 0) {
    error.value = 'Der Betrag darf nicht negativ sein.';
    return;
  }
  
  emit('save', localValue.value);
};
</script>
