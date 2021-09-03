<template>
  <v-main>
    <barra-superior
      titulo="Gestão Penitenciária"
      subtitulo="Cadastro de Visitante"
      :breadcrumbs="breadcrumbs"
    />
    <v-container fluid>
      <v-stepper
        v-model="stepper"
        non-linear
        alt-labels
      >
        <v-stepper-header>
          <v-stepper-step
            step="1"
            editable
            edit-icon="check"
            :rules="[() => rules.stepForm1]"
            :complete="completeStep1()"
          >
            Dados Básicos
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="2"
            editable
            edit-icon="check"
            :complete="completeStep2()"
          >
            Documentos Pessoais
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="3"
            editable
            edit-icon="check"
            :complete="completeStep3()"
          >
            Contatos
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="4"
            editable
            edit-icon="check"
            :complete="completeStep4()"
          >
            Anuência
          </v-stepper-step>
          <v-divider 
            v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE')"
          />
          <v-stepper-step
            v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE')"
            step="5"
            editable
            edit-icon="check"
            :complete="!!visitante.recurso"
          >
            Recurso
            <div class="text-center">
              <v-icon color="red">
                report_problem
              </v-icon>
            </div>
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <aba-dados-basicos
              v-if="carregado"
              ref="aba1"
              :visitante="visitante"
              :errors="errors"
              :rules="rules"
              :readonly="true"
            />
          </v-stepper-content>
          <v-stepper-content step="2">
            <aba-documentos
              :object="visitante"
              :readonly="true"
              tipo-pessoa="visitante"
            />
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card flat>
              <v-card-title>
                Contatos
              </v-card-title>
              <v-card-text>
                <div class="text-subtitle-1 black--text">
                  Endereços
                </div>
                <endereco-pessoa-dialog
                  :object="visitante"
                  :cant-delete="true"
                  :readonly="true"
                />
                <div class="text-subtitle-1 black--text">
                  Telefones
                </div>
                <telefone-pessoa-dialog
                  :object="visitante"
                  :readonly="true"
                />
              </v-card-text>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="4">
            <aba-anuencia
              v-if="visitante.id"
              :object="visitante"
              :errors="errors"
              :readonly="true"
            />
          </v-stepper-content>
          <v-stepper-content step="5">
            <v-card>
              <v-card-title />
              <aba-recurso
                v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE')"
                ref="AbaRecurso"
                :object="visitante"
                :readonly="true"
              />
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-card
        v-if="items.length"
        class="mt-3"
      >
        <v-card-title>Manifestações</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            single-select
            show-expand
            single-expand
            :footer-props="{
              'items-per-page-options': [5, 10, 15]
            }"
          >
            <template v-slot:[`item.created_at`]="{ item }">
              {{ formatDateTime(item.created_at) }}
            </template>
            <template v-slot:expanded-item="{ item }">
              <td colspan="4">
                <v-row class="my-3">
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    Parecer: {{ item.parecer }}
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    Lista de arquivos:<br>
                    <data-table-arquivos
                      :items="item.documentos"
                      :cant-delete="!isUsuarioCadastro(item.usuario)"
                    />
                  </v-col>
                </v-row>
              </td>
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-toolbar-items>
                <v-tooltip
                  v-if="isUsuarioCadastro(item.usuario)"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="editarManifestacao(item)"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip
                  v-if="isUsuarioCadastro(item.usuario)"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="excluirManifestacao(item.id)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>
              </v-toolbar-items>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <v-form>
        <v-card class="mt-3">
          <v-card-title>Análise do Perfil do Visitante</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="analise.parecer"
              label="Parecer"
              filled
              :error-messages="errorsAnalise.parecer"
            />
            <v-row>
              <v-col
                cols="12"
                md="4"
                sm="12"
              >
                <v-file-input
                  v-model="arquivo"
                  label="Incluir arquivo"
                  :error-messages="errorsArquivos.arquivo_temp"
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
                  class="mt-3"
                  block
                  :disabled="disableSubmitArquivo || !arquivo"
                  @click="adicionarArquivoInteligencia"
                >
                  Incluir
                </v-btn>
              </v-col>
            </v-row>
            <data-table-arquivos :items="arquivos" />
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
      <confirm-dialog ref="confirm" />
    </v-container>
  </v-main>
</template>

<script>
import * as visitanteService from '@/services/VisitanteService'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import AbaDocumentos from '../abas/AbaDocumentos.vue'
import mensagens from '@/shared/mensagens'
import AbaDadosBasicos from '../abas/AbaDadosBasicos.vue'
import AbaAnuencia  from '@/views/visitante/abas/AbaAnuencia.vue'
import DataTableArquivos from '../components/DataTableArquivos.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import AbaRecurso from '../abas/AbaRecurso.vue'
import visitanteMixin from '@/mixins/visitante'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    AbaDadosBasicos,
    AbaAnuencia,
    AbaRecurso,
    AbaDocumentos,
    DataTableArquivos,
    ConfirmDialog
  },
  mixins: [visitanteMixin],
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        to: '/',
        exact: true
      },
      {
        text: 'Inteligência Penitenciária',
        to: '/visitante/inteligencia',
        exact: true
      },
      {
        text: 'Manifestar',
        to: '/visitante/inteligencia',
        disabled: true
      },
    ],
    carregado: false,
    stepper: null,
    visitante: {
      rgs: [],
      documentos: [],
      telefones: [],
      enderecos: [],
      anuencias: []
    },
    errors: {},
    rules: {
      stepForm1: false,
      stepForm2: true,
    },
    headers: [
      { text: 'Data', value: 'created_at' },
      { text: 'Responsável', value: 'usuario' },
      { text: 'Ações', value: 'action', sortable: false },
      { text: '', value: 'data-table-expand' }
    ],
    items: [],
    arquivos: [],
    errorsArquivos: {},
    errorsAnalise: {},
    analise: {},
    arquivo: null,
    disableSubmitArquivo: false
  }),
  mounted() {    
    let id = this.$route.params.id
    this.getVisitante(id)
    this.getHistoricoManifestacao(id)
  },
  methods: {
    completeStep1() {
      return !!(this.visitante.nome && this.visitante.data_nascimento && this.visitante.numero_sei)
    },
    completeStep2() {
      return !!(this.visitante.documentos.length)
    },
    completeStep3() {
      return !!(this.visitante.telefones.length && this.visitante.enderecos.length)
    },
    completeStep4() {
      return !!(this.visitante.anuencias.length)
    },
    isUsuarioCadastro(usuario) {
      return usuario == this.user.login
    },
    getHistoricoManifestacao(visitanteId){
      visitanteService
        .historicoManifestacao(visitanteId)
        .then(res => {
          this.items = res.data.results
        })
        .catch(err => {
          this.displayErrors(err)
        })
    },
    getVisitante(id) {
      visitanteService
        .getId(id)
        .then(res => {
          Object.assign(this.visitante, res.data)
          this.carregado = true
        })
        .catch(err => {
          this.displayErrors(err)
        })
    },
    limpar() {
      this.analise = {}
      this.arquivos = []
      this.arquivo = null
      this.errorsArquivos = {}
      this.errorsAnalise = {}
    },
    adicionarArquivoInteligencia() {
      let formData = this.getFormData({arquivo_temp: this.arquivo})
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_DOCUMENTO, data: formData})
      response
        .then(res => {
          this.arquivos.push(res.data)
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
          this.arquivo = null
        })
        .catch(error => {
          this.errorsArquivos = this.displayErrors(error)
        })
    },
    salvar() {
      this.arquivos && (this.analise.documentos_list = this.arquivos)
      delete this.analise.documentos
      this.analise.visitante = this.visitante.id
      const response = this.analise.id ? visitanteService.alterarManifestacao(this.analise) : visitanteService.inserirManifestacao(this.analise)
      response
        .then(() => {
          this.limpar()
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
          this.getHistoricoManifestacao(this.visitante.id)
        })
        .catch(err => {
          this.errorsAnalise = this.displayErrors(err)
        })
    },
    async excluirManifestacao(id) {
      if (
        await this.$refs.confirm.open(
          'Excluir',
          'Você tem certeza que deseja excluir este registro ?'
        )
      ) {
        visitanteService
          .deletarManifestacao(id)
          .then(() =>{
            this.getHistoricoManifestacao(this.visitante.id)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },
    editarManifestacao(item) {
      this.limpar()
      this.analise = item
      this.arquivos = item.documentos
    },
  }
}
</script>

<style>
.v-application--is-ltr .v-stepper__label {
  text-align: center;
  display: block;
}

.v-stepper__header,
.v-data-table__expanded__content {
  box-shadow: none;
}
</style>
