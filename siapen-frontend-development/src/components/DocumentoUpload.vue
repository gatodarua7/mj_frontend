<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="object.documentos"
      :footer-props="{
        'items-per-page-text': 'Registros por página:',
        'items-per-page-options': [5, 10, 15]
      }"
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-text-field
            v-show="object.id"
            v-model="search"
            type="text"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            @click:append="getDataFromApi"
            @keyup.enter="getDataFromApi"
          />
          <v-spacer />
          <v-dialog
            v-model="dialog"
            persistent
            max-width="700px"
          >
            <template
              v-if="!readonly"
              v-slot:activator="{ on }"
            >
              <v-btn
                color="primary"
                class="mb-2"
                text
                :disabled="readonly"
                v-on="on"
              >
                <v-icon class="mb-1 mr-1">
                  mdi-file-plus
                </v-icon>
                <span> Incluir documento</span>
              </v-btn>
            </template>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-autocomplete
                          v-model="documento.tipo"
                          label="Tipo"
                          :items="tipoDocumentos"
                          clearable
                          hide-no-data
                          hide-selected
                          item-text="nome"
                          item-value="id"
                          :disabled="disabled"
                          :error-messages="errors.tipo"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="documento.num_cod"
                          label="Número/Código"
                          :disabled="disabled"
                          :counter="30"
                          :error-messages="errors.num_cod"
                        />
                      </v-col>
                      <v-col
                        cols="12"
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
                              label="Data de Validade"
                              hint="DD/MM/AAAA"
                              persistent-hint
                              prepend-icon="mdi-calendar"
                              :disabled="disabled"
                              v-bind="attrs"
                              :error-messages="errors.data_validade"
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
                        <v-file-input
                          v-model="arquivo"
                          label="Arquivo"
                          accept="image/png, image/jpeg,.pdf"
                          show-size
                          :disabled="disabled"
                          :error-messages="errors.arquivo_temp"
                          clearable
                          @change="verificarArquivo"
                          @click:clear="limparArquivo"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <v-textarea
                          v-model="documento.observacao"
                          label="Observação"
                          :counter="100"
                          filled
                          :disabled="disabled"
                          :error-messages="errors.observacao"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-3"
                    text
                    @click="fechar"
                  >
                    {{
                      !disabled ? "Cancelar" : "Fechar"
                    }}
                  </v-btn>
                  <v-btn
                    v-if="!disabled"
                    color="blue darken-3"
                    text
                    :disabled="disableSubmit"
                    @click="salvar"
                  >
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.observacao`]="{ item }">
        <v-btn
          v-if="item.observacao"
          text
          @click="exibirObservacoes(item.observacao)"
        >
          <v-icon
            color="primary"
            dark
          >
            mdi-information
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.arquivo`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="baixarArquivo(item.id)"
            >
              <v-icon>file_download</v-icon>
            </v-btn>
          </template>
          <span>Baixar arquivo</span>
        </v-tooltip>
      </template>
      <template
        v-slot:[`item.data_validade`]="{ item }"
      >
        {{ item.data_validade ? formatDate(item.data_validade) : '---' }}
      </template>
      <template
        v-slot:[`item.created_at`]="{ item }"
      >
        {{ formatDateTime(item.created_at) }}
      </template>
      <template
        v-slot:[`item.updated_at`]="{ item }"
      >
        {{ item.updated_at ? formatDateTime(item.updated_at) : '---' }}
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
            v-if="!readonly"
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
      <template v-slot:loading>
        Carregando...
      </template>
      <template v-slot:no-data>
        {{
          search.length
            ? "Nenhum resultado foi encontrado para sua pesquisa"
            : "Ainda não há registro cadastrado"
        }}
      </template>
    </v-data-table>
    <SimpleDialog ref="simpleDialog" />
    <ConfirmDialog ref="confirm" />
  </v-card>
</template>
<script>
import documentoMixin from '@/mixins/documento'

export default {
  components: {
    SimpleDialog: () => import('./SimpleDialog'),
    ConfirmDialog: () => import('./ConfirmDialog')
  },
  mixins: [documentoMixin],
  props: {
    object: Object,
    readonly: Boolean,
    tipoPessoa: String,
  },
  data: () => ({
    disableSubmit: false,
    search: '',    
    dialog: false,
    disabled: false,
    valid: false,
    ramal: false,
    date: null,
    dateFormatted: null,
    menu1: false,
    tipoDocumentos: [],
    arquivo: null,
    headers: [
      { text: 'Número/Código', value: 'num_cod' },
      { text: 'Tipo', value: 'tipo_nome' },
      { text: 'Validade', value: 'data_validade' },
      { text: 'Data de Cadastro', value: 'created_at' },
      { text: 'Data de Atualização', value: 'updated_at' },
      { text: 'Arquivo', value: 'arquivo', sortable: false },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    documento: {},
    numeroRules: [
      v => !!v || 'Campo obrigatório',
      v => v.length <= 30 || 'O campo excedeu o limite de 30 caracteres'
    ],
    observacaoRules: [
      v => v.length <= 100 || 'O campo excedeu o limite de 100 caracteres'
    ],
    documentoIndex: -1,
    errors: {}
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
    formTitle() {
      let title = ''
      if (this.disabled) {
        title = 'Visualizar documento'
      } else {
        title = this.documentoIndex === -1
          ? 'Novo documento'
          : 'Editar documento'
      }
      return title
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
    dialog(val) {
      val || this.fechar()
    },
    search(val){
      !val && this.getDataFromApi()
    }
  },
  mounted() {
    this.getTipoDocumento()
  }
}
</script>
