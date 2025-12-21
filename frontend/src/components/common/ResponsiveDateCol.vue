<template>
  <td align="right">
    <v-dialog v-model="dialog" width="500" v-if="visible">
      <template v-slot:activator="{ props }">
        <v-icon size="small" v-bind="props">fa-calendar-days</v-icon>
      </template>
      <v-card>
        <v-card-title>{{ entry.name }}</v-card-title>

        <v-card-text>
          <div v-if="entry.from">
            Ab
            <strong>{{ formatMonth(entry.from) }}</strong>
          </div>
          <div v-if="entry.to">
            Bis
            <strong>{{ formatMonth(entry.to) }}</strong>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </td>
</template>
<script>
import { displayMonth } from "./Utils";

export default {
  props: ["entry"],
  computed: {
    visible() {
      return !!(this.entry.from || this.entry.to);
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    formatMonth(yearMonth) {
      return displayMonth(yearMonth, false);
    }
  }
};
</script>