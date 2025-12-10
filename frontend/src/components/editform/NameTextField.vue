<template>
  <v-text-field
    :value="value"
    @change="$emit('input', $event)"
    :rules="nameRules"
    :counter="20"
    label="Bezeichnung"
    :required="required"
  />
</template>
<script>
export default {
  props: ["value", "required"],
  data() {
    return {
      nameRules: [
        v => !!v || "Bezeichnung darf nicht leer sein",
        v => v.length <= 20 || "Bezeichnung muss weniger als 20 Zeichen haben"
      ]
    };
  }
};
</script>