<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-form ref="form">
        <v-card>
          <v-card-text>
            <form-pedido-inclusao
              v-if="carregado"
              ref="formPedidoInclusao"
              :pedido-inclusao="pedidoInclusao"
              :errors="errors"
              disabled
            />
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn
              color="blue darken-1"
              text
              @click="sair"
            >
              Voltar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import FormPedidoInclusao from './components/formPedidoInclusao.vue'

export default {
  components: { FormPedidoInclusao },
  data: () => ({
    carregado: false,
    pedidoInclusao: {
      motivos_inclusao: []
    },
    errors: {}
  }),
  mounted() {
    let id = this.$route.params.id
    this.carregarDados(id)
  },
  methods: {
    carregarDados(id) {
      pedidoInclusaoService
        .getId(id)
        .then(res => {
          this.pedidoInclusao = Object.assign(this.pedidoInclusao, res.data)
          this.carregado =  true
        })
        .catch(error => {
          this.displayErrors(error)
        })
    }
  }
}
</script>
