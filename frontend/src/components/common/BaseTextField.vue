<template>
  <v-text-field
    v-bind="$attrs"
    variant="outlined"
    density="comfortable"
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'BaseTextField',
  inheritAttrs: false,
}
</script>
