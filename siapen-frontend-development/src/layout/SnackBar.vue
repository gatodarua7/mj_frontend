<template>
  <div>
    <v-snackbar
      v-for="(snackbar, index) in snackbars.filter(s => s.showing)"
      :key="snackbar.text + Math.random()"
      v-model="snackbar.showing"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      multi-line
      right
      top
      :style="`padding-top: ${index * 120 + 5}px`"
    >
      {{ snackbar.text }}
      <v-btn
        text
        @click="snackbar.showing = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('snackbar', ['snackbars'])
  }
}
</script>
