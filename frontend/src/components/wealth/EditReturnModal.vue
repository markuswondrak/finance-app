<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="450">
    <v-card rounded="xl">
      <v-card-title class="text-h5 pa-4">
        Erwartete Rendite bearbeiten
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model.number="localAverage"
              label="Durchschnittlich (Ø)"
              type="number"
              suffix="%"
              autofocus
              variant="outlined"
              density="comfortable"
              class="mb-2"
              hide-details="auto"
              @keyup.enter="save"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="localWorst"
              label="Worst Case"
              type="number"
              suffix="%"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @keyup.enter="save"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="localBest"
              label="Best Case"
              type="number"
              suffix="%"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @keyup.enter="save"
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-4"
          text
        >
          {{ error }}
        </v-alert>
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
  initialWorst: {
    type: Number,
    default: 2
  },
  initialAverage: {
    type: Number,
    default: 5
  },
  initialBest: {
    type: Number,
    default: 8
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localWorst = ref(2);
const localAverage = ref(5);
const localBest = ref(8);
const loading = ref(false);
const error = ref('');

watch(() => props.modelValue, (val) => {
  if (val) {
    localWorst.value = props.initialWorst;
    localAverage.value = props.initialAverage;
    localBest.value = props.initialBest;
    error.value = '';
  }
});

const cancel = () => {
  emit('update:modelValue', false);
};

const save = () => {
  if (localWorst.value > localAverage.value) {
    error.value = 'Worst Case darf nicht größer als der Durchschnitt sein.';
    return;
  }
  if (localAverage.value > localBest.value) {
    error.value = 'Durchschnitt darf nicht größer als der Best Case sein.';
    return;
  }
  
  emit('save', {
    worst: localWorst.value,
    average: localAverage.value,
    best: localBest.value
  });
};
</script>
