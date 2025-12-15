<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400">
    <v-card rounded="xl">
      <v-card-title class="text-h5">
        Edit Current Balance
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model.number="localAmount"
          label="Amount"
          type="number"
          variant="outlined"
          prefix="€"
          autofocus
          @keyup.enter="save"
          :error-messages="error"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="cancel"
          class="cancel-btn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          variant="flat"
          @click="save"
          :loading="loading"
          class="save-btn"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { userService } from '@/services/user';

export default {
  name: 'BalanceEditModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'saved'],
  data() {
    return {
      localAmount: 0,
      loading: false,
      error: '',
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        if (val) {
          this.localAmount = this.currentAmount;
          this.error = '';
        }
      },
      immediate: true
    },
  },
  methods: {
    cancel() {
      this.$emit('update:modelValue', false);
    },
    async save() {
        if (this.localAmount === '' || this.localAmount === null) {
             this.error = 'Amount is required';
             return;
        }

      this.loading = true;
      this.error = '';
      try {
        await userService.updateCurrentAmount(this.localAmount);
        this.$emit('saved');
        this.$emit('update:modelValue', false);
      } catch (e) {
        this.error = 'Failed to save amount. Please try again.';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
