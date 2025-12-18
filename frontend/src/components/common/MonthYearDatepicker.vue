<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-bind="props"
        :model-value="displayDate"
        :label="label"
        readonly
        append-inner-icon="mdi-calendar"
        variant="outlined"
        hide-details
        class="month-year-picker-input"
        @click="menuOpen = true"
        @focus="menuOpen = true"
      ></v-text-field>
    </template>

    <v-card class="month-year-picker-card">
      <v-card-title class="d-flex justify-space-between align-center py-2 px-4">
        <v-btn icon variant="text" density="comfortable" @click="changeYear(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-h6 font-weight-bold">{{ currentViewYear }}</span>
        <v-btn icon variant="text" density="comfortable" @click="changeYear(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-2">
        <v-row no-gutters>
          <v-col
            v-for="(month, index) in months"
            :key="index"
            cols="4"
            class="pa-1"
          >
            <v-btn
              block
              variant="text"
              :color="isSelected(index) ? 'primary' : ''"
              :class="{ 'primary--text': isSelected(index) }"
              @click="selectMonth(index)"
            >
              {{ month }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { formatDateLabel } from '@/services/dateAdapter';

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  label: {
    type: String,
    default: 'Select Date'
  }
});

const emit = defineEmits(['update:modelValue']);

const menuOpen = ref(false);
const currentViewYear = ref(new Date().getFullYear());

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Initialize view year from prop or current date
onMounted(() => {
  if (props.modelValue && !isNaN(props.modelValue.getTime())) {
    currentViewYear.value = props.modelValue.getFullYear();
  } else {
    currentViewYear.value = new Date().getFullYear();
  }
});

// Watch for external updates
watch(() => props.modelValue, (newVal) => {
  if (newVal && !isNaN(newVal.getTime())) {
    currentViewYear.value = newVal.getFullYear();
  }
});

const displayDate = computed(() => {
  return formatDateLabel(props.modelValue);
});

const changeYear = (delta) => {
  currentViewYear.value += delta;
};

const isSelected = (monthIndex) => {
  if (!props.modelValue) return false;
  return (
    props.modelValue.getFullYear() === currentViewYear.value &&
    props.modelValue.getMonth() === monthIndex
  );
};

const selectMonth = (monthIndex) => {
  // Create new date set to 1st of selected month
  const newDate = new Date(currentViewYear.value, monthIndex, 1);
  emit('update:modelValue', newDate);
  menuOpen.value = false;
};
</script>

<style scoped>
.month-year-picker-card {
  background-color: #1E1E1E; /* Surface color from constitution */
}
</style>
