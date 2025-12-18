# Quickstart: Month Year Datepicker

## Usage

The `MonthYearDatepicker` is a global component replacing standard `v-date-picker` or text inputs for forecasting.

```vue
<template>
  <MonthYearDatepicker
    v-model="selectedDate"
    label="Forecast Start"
    :min="minDate"
    :max="maxDate"
  />
</template>

<script setup>
import { ref } from 'vue'

// Model is a standard JS Date object (1st of Month)
const selectedDate = ref(new Date()) 
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date` | `null` | The selected date (Day is ignored/reset) |
| `label` | `String` | `"Select Date"` | Input field label |
| `min` | `Date` | `undefined` | Minimum selectable month |
| `max` | `Date` | `undefined` | Maximum selectable month |
| `readonly` | `Boolean` | `false` | If true, picker cannot be opened |

## Integration Guide

1. **Import**: The component is globally registered (or import from `@/components/common/MonthYearDatepicker.vue`).
2. **Data**: Ensure your component logic handles the `Date` object. If sending to backend, use the `formatYearMonth(date)` utility.
