<template>
  <v-menu  
    v-model="showMenu"
    :position-x="positionX"
    :position-y="positionY"
    offset-overflow
  >
    <v-card>
      <v-card-text>
        {{ sigla }}: {{ total }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    showMenu: false,
    positionX: 0,
    positionY: 0,
    sigla: null,
    total: 0
  }),
  methods: {
    open(sigla, total, x, y) {
      this.sigla = sigla
      this.total = total ? total : 0
      this.positionX = x
      this.positionY = y
      this.showMenu = true
    },
    close() {      
      this.showMenu = false
    }
  }
}
</script>