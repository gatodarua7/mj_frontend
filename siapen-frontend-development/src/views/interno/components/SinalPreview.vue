<template>
  <v-menu
    v-model="showMenu"
    :position-x="positionX"
    :position-y="positionY"
    offset-overflow
    :close-on-content-click="false"
  >
    <v-card
      class="mx-auto"
      tile
      flat
    >   
      <v-img
        width="200"
        aspect-ratio="1.5"
        contain
        :src="srcImage"
      />
      <v-card-title>{{ tipo }}</v-card-title>
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="onClick"
        >
          {{ readonly ? 'Visualizar' : 'Editar' }}
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="close"
        >
          Fechar
        </v-btn>
      </v-card-actions>
      <sinal-edit
        ref="edit"
        @updateSinais="updateSinais"
        @deletarSinais="deletarSinais"
      />
    </v-card>
  </v-menu>
</template>

<script>
import SinalEdit from '../components/SinalEdit.vue'

export default {
  components: { SinalEdit },
  props: ['interno'],
  data: () => ({
    showMenu: false,
    srcImage: '',
    positionX: 0,
    positionY: 0,
    tipo: null,
    sinalId: null,
    readonly: false,
  }),
  watch: {
    showMenu(val){
      !val && this.$emit('clearPreview')
    }
  },
  methods: {
    onClick() {
      this.$refs.edit.open(this.sinalId, this.readonly)
      this.showMenu = false
    },
    updateSinais(item) {
      this.$emit('updateSinais', item)
    },
    deletarSinais(item) {
      this.$emit('deletarSinais', item)
    },
    async open(x, y, src, tipo, id, readonly) {
      this.positionX = x
      this.positionY = y
      this.srcImage = src
      this.tipo = tipo
      this.sinalId = id
      this.readonly = readonly
      this.$nextTick(() => {
        this.showMenu = true
      })
    },
    close() {
      this.showMenu = false
      setTimeout(() => {
        this.tipo = null
      }, 300)
    }
  }
}
</script>