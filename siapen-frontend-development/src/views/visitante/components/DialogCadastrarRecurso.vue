<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1200"
  >
    <v-card>
      <v-card-title>
        Recurso
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-file-input
              v-model="arquivo"
              label="Arquivo"
              :error-messages="errors.arquivo_temp"
              @change="verificarArquivoVisitante"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-btn
              color="primary"
              :disabled="disableSubmit"
              block
              class="mt-3"
              @click="adicionarArquivoRecursoDialog"
            >
              Anexar
            </v-btn>  
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >  
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFormatted"
                  v-mask="['##/##/####']"
                  label="Data do Recurso"
                  readonly
                  clearable
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  :error-messages="errors.data_recurso"
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="date"
                no-title
                locale="pt-br"
                @input="menu1 = false"
              />
            </v-menu>
          </v-col>
        </v-row>
        <data-table-arquivos
          :items="recurso.documentos_list"
        />
        <v-textarea
          v-model="recurso.observacao"
          label="Observação"
          :error-messages="errors.observacao"
          filled
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="cancelar"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
    <confirm-dialog ref="confirm" />
  </v-dialog>
</template>

<script>
import * as visitanteRecursoService from '@/services/VisitanteRecursoService'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import DataTableArquivos from './DataTableArquivos.vue'
import visitanteMixin from '@/mixins/visitante'
import mensagens from '@/shared/mensagens'

export default {
  components: { ConfirmDialog, DataTableArquivos },
  mixins: [visitanteMixin],
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    date: null,
    dateFormatted: null,
    menu1: false,
    arquivo: null,
    disableSubmit: null,
    headers: [
      {text: 'Nome do arquivo', value: 'arquivo_temp', sortable: false},
      {text: 'Arquivo', value: 'arquivo', sortable: false},
      {text: 'Ações', value: 'action', sortable: false},
    ],
    recurso: {
      documentos_list: []
    },
    errors: {},
    visitante: null
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
      this.recurso.data_recurso = this.dateFormatted
    },
    dialog(val) {
      val || this.fechar()
    }
  },
  methods: {    
    fechar() {
      this.dialog = false
      setTimeout(() => {
        this.recurso = {
          documentos_list: []
        }
        this.arquivo = null
        this.visitante = null
        this.errors = {}
        this.date = null
      }, 300)
    },
    abrir(visitante){
      visitante.recurso && (this.recurso = visitante.recurso)
      this.dialog = true
      this.visitante = visitante.id
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    adicionarArquivoRecursoDialog() {
      let formData = this.getFormData({arquivo_temp: this.arquivo})
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_DOCUMENTO, data: formData})
      response
        .then(res => {
          this.recurso.documentos_list.push(res.data)
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
          this.arquivo = null
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    async salvar() {
      this.recurso.usuario_cadastro = this.user.user_id
      await visitanteRecursoService
        .inserir(this.recurso)
        .then(res => {
          this.atualizarRecurso(res.data.id)
        })
        .catch(err => {
          this.errors = this.displayErrors(err)
        })
    },
    atualizarRecurso(recursoId){
      const response = this.$api.create({
        resource: this.$endpoints.VISITANTE_MOVIMENTACAO,
        data: {
          visitante: this.visitante, 
          fase: 'RECURSO', 
          recurso: recursoId, 
          usuario_cadastro: this.user.user_id
        }
      })
      response
        .then(() => {
          this.resolve(true)
          this.fechar()
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
    cancelar() {
      this.reject(false)
      this.fechar()
    }
  }
}
</script>