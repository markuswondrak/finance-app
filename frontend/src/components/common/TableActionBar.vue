<template>
  <v-card class="mb-4 glass card-accent-primary" rounded="xl" elevation="0">
    <v-card-text class="py-2">
      <v-row align="center" dense>
        <!-- Search Input -->
        <v-col cols="12" md="4" lg="3">
          <v-text-field
            :model-value="search"
            @update:model-value="$emit('update:search', $event)"
            label="Suchen"
            prepend-inner-icon="fa-search"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            bg-color="surface"
          ></v-text-field>
        </v-col>

        <!-- Date Filter -->
        <v-col cols="12" md="4" lg="3">
           <div class="d-flex align-center">
              <month-year-datepicker
                :model-value="date"
                @update:model-value="$emit('update:date', $event)"
                label="Gültig in Jahr/Monat"
                class="flex-grow-1"
              />
              <v-btn 
                v-if="date" 
                icon="fa-times" 
                variant="text" 
                size="small" 
                color="error" 
                class="ml-1"
                @click="$emit('update:date', null)"
                title="Filter zurücksetzen"
              ></v-btn>
           </div>
        </v-col>

        <v-spacer class="d-none d-md-block"></v-spacer>

        <!-- Action Button Slot -->
        <v-col cols="12" md="auto" class="text-center text-md-right mt-2 mt-md-0">
          <slot name="action"></slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MonthYearDatepicker from './MonthYearDatepicker.vue';

export default {
  name: 'TableActionBar',
  components: {
    MonthYearDatepicker
  },
  props: {
    search: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: null
    }
  },
  emits: ['update:search', 'update:date']
}
</script>

<style scoped>
.glass {
  background: rgba(30, 30, 30, 0.7) !important;
  backdrop-filter: blur(10px);
}
</style>
