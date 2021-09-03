<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsCadastrar')"
    />
    <v-container fluid>
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
            @click="limparPedido"
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
      nome_pai: null,
      nome_mae: null,
      pai_nao_declarado: false,
      mae_nao_declarado: false,
      motivos_inclusao: []
    },
    errors: {},
  }),
  mounted() {
    let id = this.$route.params.id
    let tipoPessoa = this.$route.params.tipo
    id ? this.carregarDados(id, tipoPessoa) : (this.carregado = true)
  },
  methods: {
    limparPedido(){      
      this.pedidoInclusao = {
        nome_pai: null,
        nome_mae: null,
        pai_nao_declarado: false,
        mae_nao_declarado: false,
        motivos_inclusao: []
      }
    },
    carregarDados(id, tipoPessoa) {
      let response = null
      switch (tipoPessoa) {
        case 'interno':
          response = this.$api.get({resource: this.$endpoints.INTERNO, id: id})
          break        
        case 'servidor':
          response = this.$api.get({resource: this.$endpoints.SERVIDOR, id: id})
          break
        default:
          break
      }
      response &&
        response
          .then(res => {
            this.pedidoInclusao = Object.assign(this.pedidoInclusao, res.data)
            this.carregado =  true
          })
          .catch(error => {
            this.displayErrors(error)
          })
    },
    salvar() {
      this.pedidoInclusao.cpf =
        this.pedidoInclusao.cpf && this.pedidoInclusao.cpf.replace(/[\s+.+-]/g, '')
      this.pedidoInclusao.preso_extraditando = this.$refs.formPedidoInclusao.presoExtraditando      
      this.pedidoInclusao.tipo_inclusao = this.$refs.formPedidoInclusao.tipoInclusao ? 'EMERGENCIAL' : 'DEFINITIVO'
      pedidoInclusaoService
        .inserir(this.pedidoInclusao)
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
