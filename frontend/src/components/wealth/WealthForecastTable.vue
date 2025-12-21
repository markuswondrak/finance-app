<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="glass border card-accent-primary"
      type="table-tbody"
      height="400"
    ></v-skeleton-loader>

    <div v-else-if="!forecast || !forecast.points || forecast.points.length === 0" class="glass border card-accent-primary pa-4 text-center text-medium-emphasis">
      No data available
    </div>

    <BaseTable v-else>
      <thead>
        <tr>
          <th class="text-left">Year</th>
          <th class="text-right">Total Invested</th>
          <th class="text-right text-error">Worst Case</th>
          <th class="text-right text-white">Average Case</th>
          <th class="text-right text-success">Best Case</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in tableData"
          :key="item.year"
          @mouseenter="$emit('row-hover', item.year)"
          @mouseleave="$emit('row-leave')"
          class="forecast-row"
        >
          <td class="text-left font-weight-bold">{{ item.year }}</td>
          <td class="text-right">{{ toCurrency(item.invested) }}</td>
          <td class="text-right text-error">{{ toCurrency(item.worst) }}</td>
          <td class="text-right text-white text-h6">{{ toCurrency(item.average) }}</td>
          <td class="text-right text-success">{{ toCurrency(item.best) }}</td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>

<script>
import { computed } from 'vue';
import BaseTable from '@/components/common/BaseTable.vue';
import { toCurrency } from '@/components/Utils';

export default {
  name: "WealthForecastTable",
  components: {
    BaseTable
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    forecast: {
      type: Object,
      default: null
    }
  },
  emits: ['row-hover', 'row-leave'],
  setup(props) {
    const tableData = computed(() => {
      if (!props.forecast || !props.forecast.points) return [];
      return props.forecast.points;
    });

    return {
      tableData,
      toCurrency
    };
  }
};
</script>

<style scoped>
.forecast-row {
  transition: background-color 0.2s;
  cursor: default;
}
</style>