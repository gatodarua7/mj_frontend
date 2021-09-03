<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="30%"
  >
    <v-card>
      <v-card-title>
        Movimentar para a fase: {{ getFase(movimentacaoVisitante.fase).nome }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <div
            v-for="fase in fases"
            :key="fase.id"
            class="my-2"
          >
            <v-btn
              outlined
              block
              :color="getFase(fase).cor"
              class="d-block"
              @click="setFase(fase)"
            >
              <span style="white-space: normal;">
                {{ getFase(fase).nome }}
              </span>
            </v-btn>
          </div>
          <v-textarea
            v-model="movimentacaoVisitante.motivo"
            label="Motivo"
            class="pt-4"
            filled
            :error-messages="errors.motivo"
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
          @click.native="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as visitanteMovimentacaoService from '@/services/VisitanteMovimentacaoService'
import visitanteMixin from '@/mixins/visitante'
import mensagens from '@/shared/mensagens'

export default {
  mixins: [visitanteMixin],
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    fases: [],
    movimentacaoVisitante: {
      fase: '',
      fase_nome: '',
      motivo: '',
      data_contato: '',
      visitante: ''
    },
    errors: {}
  }),
  methods: {
    open(item) {
      this.errors = {}
      visitanteMovimentacaoService
        .getFases(item.fase)
        .then(res => {
          this.fases = res.data.fases
          this.dialog = true
        })
      this.movimentacaoVisitante.visitante = item.id
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    setFase(fase) {
      this.movimentacaoVisitante.fase = fase
    },
    cancelar(){      
      this.resolve(false)
      this.fechar()
    },
    salvar() {
      let data = {
        motivo: this.movimentacaoVisitante.motivo,
        fase: this.movimentacaoVisitante.fase,
        visitante: this.movimentacaoVisitante.visitante,
        usuario_cadastro: this.user.user_id
      }
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_MOVIMENTACAO, data: data})
      response
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
      this.movimentacaoVisitante = {
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