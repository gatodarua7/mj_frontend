<template>
  <v-overlay
    :value="overlay"
    z-index="999"
  >
    <v-progress-circular
      indeterminate
      size="64"
    />
  </v-overlay>
</template>

<script>
export default {
  computed: {
    overlay() {
      return this.$store.getters['loading/getLoading']
    }
  }
}
</script>
