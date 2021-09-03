<template>
  <v-snackbar
    v-model="snack.exibe"
    :top="true"
    color="success"
    :right="true"
    :timeout="3000"
  >
    {{ snack.mensagem }}
    <v-btn
      dark
      text
      @click="fechar"
    >
      Fechar
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: ['snack'],
  methods: {
    fechar() {
      this.snack.exibe = false
    }
  }
}
</script>
