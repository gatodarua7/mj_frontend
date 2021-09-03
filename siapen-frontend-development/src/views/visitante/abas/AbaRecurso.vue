<template>
  <v-card flat>
    <v-card-title>Recurso</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-if="!readonly"
          cols="12"
          md="6"
          sm="12"
        >
          <v-file-input
            v-model="arquivo"
            label="Arquivo"
            :error-messages="errors.arquivo_temp"
            :disabled="readonly"
            @change="verificarArquivoVisitante"
          />
        </v-col>
        <v-col
          v-if="!readonly"
          cols="12"
          md="2"
          sm="12"
        >
          <v-btn
            color="primary"
            :disabled="disableSubmit || readonly"
            block
            class="mt-3"
            @click="adicionarArquivoRecurso"
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
                :disabled="readonly"
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
        :readonly="readonly"
        :cant-delete="object.fase && object.fase!='INICIADO'"
      />
      <v-textarea
        v-model="recurso.observacao"
        label="Observação"
        :error-messages="errors.observacao"
        :disabled="readonly"
        filled
      />
    </v-card-text>
    <confirm-dialog ref="confirm" />
  </v-card>
</template>

<script>
import * as visitanteRecursoService from '@/services/VisitanteRecursoService'
import visitanteMixin from '@/mixins/visitante'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import DataTableArquivos from '../components/DataTableArquivos.vue'
import mensagens from '@/shared/mensagens'

export default {
  components: { ConfirmDialog, DataTableArquivos },
  mixins: [visitanteMixin],
  props: {
    object: Object,
    readonly: Boolean
  },
  data: () => ({
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
    errors: {}
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
    }
  },
  mounted() {
    visitanteRecursoService
      .getId(this.object.recurso)
      .then(res => {
        this.recurso = res.data
        this.recurso.documentos_list = this.recurso.documentos
        this.date = this.recurso.data_recurso
      })
      .catch(error => {
        this.displayErrors(error)
      })
  },
  methods: {
    adicionarArquivoRecurso() {
      let formData = this.getFormData({arquivo_temp: this.arquivo})
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_DOCUMENTO, data: formData})
      response
        .then(res => {
          this.recurso.documentos.push(res.data)
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
      delete this.recurso.documentos
      await visitanteRecursoService
        .alterar(this.recurso)
        .then(res => {
          this.object.recurso = res.data.id
          this.$emit('atualizarVisitante')
        })
        .catch(err => {
          this.errors = this.displayErrors(err)
        })
    }
  }
}
</script>