<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="30%"
  >
    <v-card>
      <v-card-title>
        Movimentar para a fase: {{ movimentacao.fase_nome }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <div
            v-for="fase in fases"
            :key="fase.id"
            class="my-2"
          >
            <v-btn
              outlined
              block
              :color="fase.cor"
              class="d-block"
              @click="setFase(fase)"
            >
              <span style="white-space: normal;">
                {{ fase.nome }}
              </span>
            </v-btn>
          </div>
          <v-textarea
            v-model="movimentacao.motivo"
            label="Motivo"
            class="pt-4"
            filled
            :error-messages="errors.motivo"
            :rules="[v => !!v || 'O campo é de preenchimento obrigatório']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="cancelar"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          class="body-2 font-weight-bold"
          text
          :disabled="!valid"
          @click.native="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as fasesService from '@/services/FasesService'
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: false,
    dialog: false,
    resolve: null,
    reject: null,
    fases: [],
    movimentacao: {
      fase: '',
      fase_nome: '',
      motivo: '',
      pedido_inclusao: ''
    },
    errors: {}
  }),
  methods: {
    open(item) {
      const grupo = item.tipo_inclusao
      const pedido_inclusao = item.id
      let fase = ''
      if (item.fase_pedido.fase == 'ARQUIVAR') {
        fase = 'DESARQUIVAR'
      }
      if (item.fase_pedido.fase == 'REMETIDO') {
        fase = 'RECEBIDO'
      }
      this.errors = {}
      fasesService
        .getByGrupo(grupo, fase)
        .then(res => {
          this.fases = res.data.results
          this.dialog = true
        })
      this.movimentacao.pedido_inclusao = pedido_inclusao
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setFase(fase) {
      this.movimentacao.fase = fase.id
      this.movimentacao.fase_nome = fase.nome
    },
    cancelar(){      
      this.resolve(false)
      this.fechar()
    },
    salvar() {
      let data = {
        motivo: this.movimentacao.motivo,
        fase_pedido: this.movimentacao.fase,
        pedido_inclusao: this.movimentacao.pedido_inclusao,
        usuario_cadastro: this.user.user_id
      }
      pedidoInclusaoService
        .movimentar(data)
        .then(() => {          
          this.resolve(true)
          this.fechar()
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    fechar() {      
      this.fases = []
      this.movimentacao = {
        fase: '',
        fase_nome: '',
        motivo: ''
      }
      this.errors = {}
      this.dialog = false
    }
  }
}
</script>