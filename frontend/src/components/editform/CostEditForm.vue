<template>
  <span>
    <v-dialog v-model="dialog" max-width="800" persistent @after-enter="triggerFocus">
      <template v-slot:activator="{ props }">
        <v-btn :icon="!btnText" :variant="!!btnText ? 'text' : undefined" small v-bind="props">
          <v-icon v-if="!btnText" size="small">{{ btnIcon }}</v-icon>
          <span v-if="!!btnText">{{ btnText }}</span>
        </v-btn>
      </template>
      <v-card v-if="dialog" rounded="xl">
        <v-form ref="form" v-model="valid" @submit.prevent="save">
          <v-card-title>
            <span>{{ title }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <slot />
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false" :disabled="saving">Abbrechen</v-btn>
            <v-btn
              variant="text"
              type="submit"
              :disabled="!valid || !changed"
              :loading="saving"
            >Speichern</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" location="bottom" color="success" :timeout="7000">{{ successMsg(name) }}</v-snackbar>
    <v-snackbar v-model="errorSnackbar" location="bottom" color="error" :timeout="7000">{{ errorMsg }}</v-snackbar>
  </span>
</template>
<script>
export default {
  props: ["title", "changed", "btnText", "icon", "successMsg", "name"],
  data() {
    return {
      valid: false,
      dialog: false,
      saving: false,
      snackbar: false,
      errorSnackbar: false,
      errorMsg: ""
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.$emit('open');
      }
    }
  },
  computed: {
    btnIcon() {
      return this.icon || "fa-edit";
    }
  },
  methods: {
    triggerFocus() {
      if (this.$refs.form) {
        const input = this.$refs.form.$el.querySelector('input:not([type="hidden"]), textarea, select');
        if (input) {
          input.focus();
        }
      }
    },
    save() {
      if (this.valid && this.changed && !this.saving) {
        this.$emit('save');
        this.saving = true;
      }
    },
    success() {
      this.dialog = false;
      this.saving = false;
      this.snackbar = true;
    },
    error(msg) {
      this.saving = false;
      this.errorMsg = msg || "Ein Fehler ist aufgetreten.";
      this.errorSnackbar = true;
    }
  }
};
</script>