<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsAlterar')"
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
            <v-btn
              color="blue darken-1"
              text
              @click="limpar"
            >
              Limpar
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="salvar"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import mensagens from '@/shared/mensagens'
import FormPedidoInclusao from './components/formPedidoInclusao.vue'

export default {
  components: { FormPedidoInclusao },
  data: () => ({
    carregado: false,
    pedidoInclusao: {
      motivos_inclusao: []
    },
    errors: {},
  }),
  async mounted() {
    const response = await this.$api.get({resource: this.$endpoints.PEDIDO_INCLUSAO, id: this.$route.params.id})
    Object.assign(this.pedidoInclusao, response.data)
    this.carregado = true
  },
  methods: {
    salvar() {
      this.pedidoInclusao.cpf =
        this.pedidoInclusao.cpf && this.pedidoInclusao.cpf.replace(/[\s+.+-]/g, '')
      this.pedidoInclusao.preso_extraditando = this.$refs.formPedidoInclusao.presoExtraditando      
      this.pedidoInclusao.tipo_inclusao = this.$refs.formPedidoInclusao.tipoInclusao ? 'EMERGENCIAL' : 'DEFINITIVO'
      pedidoInclusaoService
        .alterar(this.pedidoInclusao)
        .then(() => {
          this.$router.push('/pedido-inclusao/')
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    }
  }
}
</script>
