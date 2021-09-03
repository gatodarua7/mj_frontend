<template>
  <v-footer
    :inset="true"
    color="grey lighten-4 elevation-1"
    class="text-right"
    app
  >
    <div class="flex-grow-1" />
    <div>
      <span>
        Versões: F: {{ frontVersion }} / B: {{ backVersion }} - &copy;
        {{ new Date().getFullYear() }} - Departamento Penitenciário Nacional
      </span>
    </div>
  </v-footer>
</template>

<script>
import { getBackVersion } from '@/services/auth.service'

export default {
  computed: {
    frontVersion() {
      return process.env.VUE_APP_VERSION
    },
    backVersion() {
      return getBackVersion()
    }
  },
}
</script>
