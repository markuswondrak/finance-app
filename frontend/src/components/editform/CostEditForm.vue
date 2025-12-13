<template>
  <span>
    <v-dialog v-model="dialog" max-width="800" persistent>
      <template v-slot:activator="{ props }">
        <v-btn :icon="!btnText" :variant="!!btnText ? 'text' : undefined" small v-bind="props">
          <v-icon v-if="!btnText" size="small">{{ btnIcon }}</v-icon>
          <span v-if="!!btnText">{{ btnText }}</span>
        </v-btn>
      </template>
      <v-card v-if="dialog">
        <v-card-title>
          <span>{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <slot />
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false" :disabled="saving">Abbrechen</v-btn>
          <v-btn
            variant="text"
            @click="$emit('save'); saving = true"
            :disabled="!valid || !changed"
            :loading="saving"
          >Speichern</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" location="bottom" color="success" :timeout="7000">{{ successMsg(name) }}</v-snackbar>
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
      snackbar: false
    };
  },
  computed: {
    btnIcon() {
      return this.icon || "fa-edit";
    }
  },
  methods: {
    success() {
      this.dialog = false;
      this.saving = false;
      this.snackbar = true;
    }
  }
};
</script>