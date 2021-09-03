<template>
  <v-card flat>
    <v-row v-if="!readonly">
      <v-col
        cols="12"
        md="12"
        class="d-flex flex-row-reverse"
      >
        <v-btn
          color="blue darken-2"
          class="mb-2"
          text
          @click="dialog=true"
        >
          <v-icon>add</v-icon>
          <span>Incluir</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-card-title>
      Anuência
      <v-chip
        class="ml-2"
        color="grey lighten-1"
        text-color="white"
        small
      >
        {{ items.length }}
      </v-chip>
      <v-spacer />
      <v-text-field
        v-if="object.id"
        v-model="search"
        type="text"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
        @click:append="pesquisarAnuencia"
        @keyup.enter="pesquisarAnuencia"
      />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
        :must-sort="true"
        :footer-props="{
          'items-per-page-options': [5, 10, 15]
        }"
      >
        <template v-slot:[`item.interno.thumbnail`]="{ item }">
          <v-avatar
            v-if="item.interno.thumbnail"
            class="my-2"
          >
            <v-img :src="item.interno.thumbnail" />
          </v-avatar>
          <v-avatar
            v-else
            class="my-2"
          >
            <v-icon
              color="grey darken-4"
              size="64"
            >
              account_circle
            </v-icon>
          </v-avatar>
        </template>
        <template
          v-slot:[`item.created_at`]="{ item }"
        >
          {{ formatDateTime(item.created_at) }}
        </template>
        <template v-slot:[`item.arquivo`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="baixarArquivoVisitante(item.documento)"
              >
                <v-icon>file_download</v-icon>
              </v-btn>
            </template>
            <span>Baixar arquivo</span>
          </v-tooltip>
        </template>
        <template
          v-slot:[`item.action`]="{ item }"
        >
          <v-toolbar-items>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  @click="visualizarItem(item)"
                  v-on="on"
                >
                  <v-icon>visibility</v-icon>
                </v-btn>
              </template>
              <span>Visualizar</span>
            </v-tooltip>
            <v-tooltip
              v-if="!readonly"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  @click="editarItem(item)"
                  v-on="on"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip
              v-if="(!object.id && !readonly) || object.fase=='INICIADO'"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  @click="excluirItem(item)"
                  v-on="on"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Excluir</span>
            </v-tooltip>
          </v-toolbar-items>
        </template>
        <template
          v-slot:no-data
        >
          {{
            search.length
              ? "Nenhum resultado foi encontrado para sua pesquisa"
              : "Ainda não há registro cadastrado"
          }}
        </template>
      </v-data-table>
      <v-dialog
        v-model="dialog"
        max-width="1200"
      >
        <v-form @submit.prevent="salvar">
          <v-card>
            <v-card-title class="text-h5">
              {{ formTitle }}
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-combobox
                    v-model="internoSelecionado"
                    :items="internos"
                    :search-input.sync="searchInterno"
                    clearable
                    item-text="nome"
                    item-value="id"
                    return-object
                    label="Pesquisar preso"
                    :disabled="disabled"
                    :error-messages="errors.interno"
                    @change="adicionaInterno"
                  >
                    <template v-slot:item="{ item }">
                      <v-list-item-avatar
                        v-if="item.thumbnail"
                        class="my-2"
                      >
                        <v-img :src="item.thumbnail" />
                      </v-list-item-avatar>
                      <v-list-item-avatar
                        v-else
                        class="my-2"
                      >
                        <v-icon
                          color="grey darken-4"
                          size="64"
                        >
                          account_circle
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.nome" />
                        <v-list-item-subtitle v-text="item.cpf" />
                      </v-list-item-content>
                    </template>
                  </v-combobox>
                  <v-card
                    v-if="interno.nome"
                    outlined
                  >
                    <v-card-text>
                      <div class="d-flex align-center">
                        <v-avatar
                          size="96"
                          color="black"
                        >
                          <v-img
                            v-if="interno && interno.thumbnail"
                            :src="interno.thumbnail"
                          />
                          <v-icon
                            v-else
                            dark
                            size="96"
                          >
                            mdi-account-circle
                          </v-icon>
                        </v-avatar>
                        <div class="ml-4">
                          <span class="text-h5">{{ interno.nome }}</span><br>
                          Vulgo: {{ interno.vulgo && interno.vulgo.join(', ') }}<br>
                          Alocação: 
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-autocomplete
                    v-model="anuenciaItem.tipo_vinculo"
                    label="Vínculo com o preso"
                    :items="vinculos"
                    item-text="nome"
                    item-value="id"
                    :error-messages="errors.tipo_vinculo"
                    :disabled="disabled"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                >
                  <v-file-input
                    v-model="arquivo"
                    label="Declaração de Anuência para Visita"
                    clearable
                    :disabled="disabled"
                    :error-messages="errors.arquivo_temp"
                    @change="verificarArquivoAnuencia"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
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
                    :disabled="disabled"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFormatted"
                        v-mask="['##/##/####']"
                        label="Data de Declaração da Anuência"
                        prepend-icon="mdi-calendar"
                        :disabled="disabled"
                        :error-messages="errors.data_declaracao"
                        v-bind="attrs"
                        clearable
                        readonly
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
                <v-col
                  cols="12"
                  sm="12"
                >
                  <v-textarea
                    v-model="anuenciaItem.observacao"
                    label="Observação"
                    filled
                    :error-messages="errors.observacao"
                    :disabled="disabled"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                text
                @click="fecharDialog"
              >
                Voltar
              </v-btn>

              <v-btn
                v-if="!disabled"
                color="primary"
                text
                type="submit"
                :disabled="disableSubmit"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <ConfirmDialog ref="confirm" />
    </v-card-text>
  </v-card>
</template>

<script>
import * as anuenciaService from '@/services/VisitanteAnuenciaService'
import * as documentoVisitanteService from '@/services/DocumentoVisitanteService'
import ConfirmDialog from '@/components/ConfirmDialog'
import visitanteMixin from '@/mixins/visitante'
import mensagens from '@/shared/mensagens'

export default {
  name: 'AbaAnuencia',
  components: { ConfirmDialog},
  mixins: [visitanteMixin],
  props: { 
    object: Object,
    readonly: Boolean
  },
  data: () => ({
    date: null,
    dateFormatted: null,
    menu1: false,
    dialog: false,
    search: '',
    totalItems: 0,
    headers: [
      {text: '', value: 'interno.thumbnail'},
      {text: 'Preso', value: 'interno.nome'},
      {text: 'CPF', value: 'interno.cpf'},
      {text: 'Vínculo', value: 'tipo_vinculo.nome'},
      {text: 'Data do Cadastro', value: 'created_at'},
      {text: 'Declaração de Anuência para Visita', value: 'arquivo', sortable: false},
      {text: 'Ações', value: 'action', sortable: false}
    ],
    items: [],
    errors: {},
    options: {},
    interno: {},
    anuenciaItem: {},
    anuenciaIndex: -1,
    internoSelecionado: '',
    searchInterno: '',
    internos: [],
    vinculos: [],
    arquivo: null,
    disabled: false,
    disableSubmit: false,
  }),
  computed: {
    formTitle() {
      let title = ''
      if (this.disabled) {
        title = 'Visualizar anuência'
      } else {
        this.anuenciaIndex === -1
          ? (title = 'Incluir anuência')
          : (title = 'Editar anuência')
      }
      return title
    },
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
    search(val){
      !val && this.pesquisarAnuencia()
    },
    searchInterno(val){
      this.getInternos(val)
    }
  },
  created() {
    this.object.id && this.pesquisarAnuencia()
    this.getInternos(null)
    this.getTipoVinculos()
  },
  methods: {
    verificarArquivoAnuencia() {
      if(this.arquivo){
        const isImage = ['image/jpeg', 'image/png'].includes(this.arquivo.type)
        const isPdf = ['application/pdf'].includes(this.arquivo.type)

        if (isImage || isPdf) {
          if(isImage && this.arquivo.size > 1*1024*1024){
            this.errors.arquivo_temp = 'Tamanho da imagem não suportado. O arquivo deve ter no máximo 1MB'
            this.disableSubmit = true
          } else if(isPdf && this.arquivo.size > 15*1024*1024){
            this.errors.arquivo_temp = 'Tamanho do arquivo não suportado. O arquivo deve ter no máximo 15MB'
            this.disableSubmit = true
          } else {
            this.enviarArquivo()
          }
        } else {
          this.errors.arquivo_temp = 'Formato de arquivo não suportado'
          this.disableSubmit = true
        }
      } else {
        this.anuenciaItem.documento = null
      }
    },
    async getTipoVinculos() {
      const response = await this.$api.list({
        resource: this.$endpoints.TIPO_VINCULO,
        query: {
          page_size: 10000,
          ativo: true
        }
      })
      this.vinculos = response.data.results
    },
    async getInternos(val) {
      const response = await this.$api.list({
        resource: this.$endpoints.INTERNO,
        query: {
          page_size: 10000,
          ativo: true,
          search: val
        }
      })
      this.internos = response.data.results
    },
    adicionaInterno(item) {
      item && (this.interno = item)
    },
    pesquisarAnuencia() {
      const param = encodeURIComponent(this.search)
      anuenciaService
        .search(param, this.object.id)
        .then(res => {
          this.items = res.data.results
          this.object.anuencias = this.items
        })
        .catch(err => {
          this.displayErrors(err)
        })
    },
    fecharDialog() {
      this.dialog = false
      setTimeout(() => {
        this.disabled = false
        this.internoSelecionado = null
        this.interno = {}
        this.arquivo = null
        this.date = null
        this.anuenciaItem = {}
        this.initialItem = {}
        this.anuenciaIndex = -1
        this.errors = {}
      }, 300)
    },

    enviarArquivo() {
      let formData = this.getFormData({arquivo_temp: this.arquivo})
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_DOCUMENTO, data: formData})
      response
        .then(res => {
          this.anuenciaItem.documento = res.data.id
          this.errors.arquivo_temp = null
          this.disableSubmit = false
        })
        .catch(err => {
          this.errors = this.displayErrors(err)
        })
    },

    async salvar() {
      !this.anuenciaItem.observacao && (this.anuenciaItem.observacao = '')
      this.anuenciaItem.data_declaracao = this.computedDateFormatted ? this.computedDateFormatted : null
      this.anuenciaItem.interno = this.interno && this.interno.id
      this.anuenciaItem.tipo_vinculo && this.anuenciaItem.tipo_vinculo.id && (this.anuenciaItem.tipo_vinculo = this.anuenciaItem.tipo_vinculo.id)
      this.object.id && (this.anuenciaItem.visitante = this.object.id)
      const response = this.anuenciaItem.id ? anuenciaService.alterar(this.anuenciaItem, this.anuenciaItem.id) : anuenciaService.inserir(this.anuenciaItem)
      await response
        .then(res => {
          anuenciaService
            .getId(res.data.id)
            .then(result => {
              this.fecharDialog()
              this.object.id ? this.pesquisarAnuencia() : this.inserirItem(result.data)
              !this.object.id && (this.object.anuencias = this.items)
              this.$store.dispatch('snackbar/setSnackbar', {
                text: `${mensagens('MSG1')}`,
                color: 'success',
                timeout: 3000
              })
            })
        })
        .catch(err => {
          this.errors = this.displayErrors(err)
          this.errors.arquivo_temp = this.errors.documento
        })      
    },
    inserirItem(item) {
      this.anuenciaIndex > -1
        ? Object.assign(
            this.items[this.anuenciaIndex],
            item
          )
        : this.items.push(item)
    },
    visualizarItem(item){
      this.anuenciaIndex = this.items.indexOf(item)
      Object.assign(this.anuenciaItem, item)
      this.interno = this.anuenciaItem.interno
      this.date = this.anuenciaItem.data_declaracao
      this.carregarArquivoAnuencia()
      delete this.anuenciaItem.arquivo_temp
      delete this.anuenciaItem.delete_at
      delete this.anuenciaItem.updated_at
      this.disabled = true
      this.dialog = true
    },
    editarItem(item){
      this.anuenciaIndex = this.items.indexOf(item)
      Object.assign(this.anuenciaItem, item)
      this.interno = this.anuenciaItem.interno
      this.date = this.anuenciaItem.data_declaracao
      this.carregarArquivoAnuencia()
      delete this.anuenciaItem.arquivo_temp
      delete this.anuenciaItem.delete_at
      delete this.anuenciaItem.updated_at
      this.dialog = true
    },
    carregarArquivoAnuencia() {
      documentoVisitanteService.carregarArquivoVisitante(this.anuenciaItem.documento).then(response => {
        let filename = response.headers['content-disposition'].split('=')[1]
        let blob = new Blob([response.data])
        this.arquivo = new File([blob], filename)
      })
    },
    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir registro',
          'Você tem certeza que deseja excluir este registro ?'
        )
      ) {
        anuenciaService
          .deletar(item.id)
          .then(() =>{
            const index = this.items.indexOf(item)
            this.items.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },
  }
}
</script>