<template>
  <v-card elevation="0">
    <v-data-table
      :headers="headers"
      :items="object.enderecos"
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
          <v-spacer />
          <v-dialog
            v-model="dialog"
            persistent
            max-width="700px"
          >
            <template
              v-slot:activator="{ on }"
            >
              <v-btn
                v-show="!readonly"
                color="primary"
                class="mb-2"
                text
                :disabled="readonly"
                v-on="on"
              >
                <v-icon class="mb-1 mr-1">
                  mdi-map-marker-plus
                </v-icon>Incluir
                endereço
              </v-btn>
            </template>
            <v-card>
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-progress-linear
                  indeterminate
                  :active="carregando"
                />
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-text-field
                        v-model="editedItem.cep"
                        v-mask="['##.###-###']"
                        label="Cep"
                        counter="10"
                        clearable
                        prepend-inner-icon="mdi-map-marker"
                        :disabled="disabled"
                        :error-messages="errors.cep"
                        @blur="localizarEndereco"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="8"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.logradouro"
                        label="Logradouro"
                        clearable
                        counter="100"
                        :rules="[
                          v =>
                            v.length <= 100 ||
                            'O campo deve possuir até 100 caracteres'
                        ]"
                        :disabled="disabled"
                        :error-messages="errors.logradouro"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.numero"
                        label="Número"
                        counter="10"
                        clearable
                        :disabled="disabled"
                        :rules="[
                          v =>
                            v.length <= 10 ||
                            'O campo deve possuir até 10 caracteres'
                        ]"
                        :error-messages="errors.numero"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.bairro"
                        label="Bairro"
                        counter="150"
                        clearable
                        :disabled="disabled"
                        :rules="[
                          v =>
                            v.length <= 150 ||
                            'O campo deve possuir até 150 caracteres'
                        ]"
                        :error-messages="errors.bairro"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      sm="12"
                    >
                      <v-autocomplete
                        v-model="editedItem.estado"
                        label="Estados"
                        :items="estados"
                        item-value="id"
                        item-text="sigla"
                        clearable
                        :disabled="disabled"
                        :error-messages="errors.estado"
                        :loading="loadingEstados"
                        @change="carregarCidades"
                        @blur="getEstadoById"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-autocomplete
                        v-model="editedItem.cidade"
                        label="Cidade"
                        :items="cidades"
                        item-value="id"
                        item-text="nome"
                        :disabled="editedItem.estado == null || disabled"
                        clearable
                        :error-messages="errors.cidade"
                        :loading="loadingCidades"
                        @blur="getCidadeById"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.complemento"
                        label="Complemento"
                        counter="100"
                        clearable
                        :disabled="disabled"
                        :rules="[
                          v =>
                            v.length <= 100 ||
                            'O campo deve possuir até 100 caracteres'
                        ]"
                        :error-messages="errors.complemento"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.andar"
                        label="Andar"
                        counter="20"
                        clearable
                        :disabled="disabled"
                        :rules="[
                          v =>
                            v.length <= 20 ||
                            'O campo deve possuir até 20 caracteres'
                        ]"
                        :error-messages="errors.andar"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      sm="12"
                    >
                      <v-text-field
                        v-model="editedItem.sala"
                        label="Sala"
                        counter="20"
                        clearable
                        :disabled="disabled"
                        :rules="[
                          v =>
                            v.length <= 20 ||
                            'O campo deve possuir até 20 caracteres'
                        ]"
                        :error-messages="errors.sala"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-textarea
                        v-model="editedItem.observacao"
                        label="Observação"
                        counter="200"
                        filled
                        clearable
                        :disabled="disabled"
                        :error-messages="errors.observacao"
                        :rules="[
                          v =>
                            v.length <= 200 ||
                            'O campo deve possuir até 200 caracteres'
                        ]"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-3"
                    text
                    @click="close"
                  >
                    {{
                      !disabled ? "Cancelar" : "Fechar"
                    }}
                  </v-btn>
                  <v-btn
                    v-if="!disabled"
                    color="blue darken-3"
                    text
                    @click="salvar"
                  >
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.observacao`]="{ item }">
        <v-btn
          v-if="item.observacao"
          text
          @click="exibirObservacoes(item)"
        >
          <v-icon
            color="primary"
            dark
          >
            mdi-information
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.action`]="{ item }">
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
            v-if="(!object.id && !readonly) || !cantDelete"
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
        Nenhum endereço encontrado
      </template>
    </v-data-table>
    <SimpleDialog ref="simple" />
    <ConfirmDialog ref="confirm" />
  </v-card>
</template>

<script>
import * as estadosService from '@/services/EstadosService'
import * as enderecoService from '@/services/EnderecoService'
import * as viaCepService from '@/services/ViaCepService'
import mensagens from '@/shared/mensagens'

export default {
  components: {
    SimpleDialog: () => import('./SimpleDialog'),
    ConfirmDialog: () => import('./ConfirmDialog')
  },
  props: ['object', 'readonly', 'cantDelete'],
  data: () => ({
    valid: false,
    dialog: false,
    disabled: false,
    loadingEstados: false,
    loadingCidades: false,
    headers: [
      { text: 'CEP', value: 'cep' },
      { text: 'Logradouro', value: 'logradouro' },
      { text: 'Bairro', value: 'bairro' },
      { text: 'Cidade', value: 'cidade_nome' },
      { text: 'UF', value: 'estado_nome' },
      { text: 'Observacao', value: 'observacao' },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    carregando: false,
    cidades: [],
    estados: [],
    editedIndex: -1,
    editedItem: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      observacao: '',
      andar: '',
      sala: ''
    },
    defaultItem: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      observacao: '',
      andar: '',
      sala: ''
    },
    errors: {}
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo endereço' : 'Editar endereço'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  mounted() {
    this.carregarEstados()
  },

  methods: {
    async visualizarItem(item) {
      await this.carregarCidades(item.estado)
      this.editedIndex = this.object.enderecos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.disabled = true
      this.dialog = true
    },

    async editarItem(item) {
      await this.carregarCidades(item.estado)
      this.editedIndex = this.object.enderecos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.disabled = false
      this.dialog = true
    },

    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir endereço',
          'Você tem certeza que deseja excluir este endereço ?'
        )
      ) {
        const index = this.object.enderecos.indexOf(item)
        this.object.enderecos.splice(index, 1)
      }
    },

    close() {
      this.dialog = false
      this.disabled = false
      this.errors = {}
      setTimeout(() => {
        this.$refs.form.resetValidation()
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    salvar() {
      const response = this.editedItem.id ? enderecoService.alterar(this.editedItem) : enderecoService.inserir(this.editedItem)
      response
        .then(res => {
          this.editedIndex > -1
            ? Object.assign(this.object.enderecos[this.editedIndex], res.data)
            : this.object.enderecos.push(res.data)
          this.close()
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

    carregarEstados() {
      this.loadingEstados = true
      estadosService.listAll().then(res => {
        this.estados = res.data.results
        this.loadingEstados = false
      })
    },

    async carregarCidades(val) {
      this.loadingCidades = true
      const res = await this.$api.list({
        resource: this.$endpoints.CIDADE,
        query: {
          page_size: 10000,
          estado: val
        }
      })
      this.cidades = res.data.results
      this.loadingCidades = false
    },

    localizarEndereco() {
      this.editedItem.logradouro = ''
      this.editedItem.complemento = ''
      this.editedItem.bairro = ''
      this.editedItem.estado = ''
      this.editedItem.cidade = ''
      if (this.editedItem.cep != null) {
        this.carregando = true
        viaCepService.buscarEndereco(this.editedItem.cep).then(res => {
          this.getEstadoByUf(res.data.uf)
          this.getCidadeByNomeAndUf(res.data.localidade, res.data.uf)
          this.editedItem.logradouro = res.data.logradouro
          this.editedItem.complemento = res.data.complemento
          this.editedItem.bairro = res.data.bairro
        })
        this.carregando = false
      }
    },

    getEstadoByUf(uf) {
      estadosService.getEstadoPorSigla(uf).then(response => {
        response.data.results.map(item => {
          this.editedItem.estado = item.id
          this.editedItem.estado_nome = item.nome
        })
        this.carregarCidades(this.editedItem.estado)
      })
    },

    async getCidadeByNomeAndUf(nome, uf) {
      const res = await this.$api.list({
        resource: this.$endpoints.CIDADE,
        query: {
          estado__sigla: uf,
          nome: nome
        }
      })
      res.data.results.map(item => {
        this.editedItem.cidade = item.id
        this.editedItem.cidade_nome = item.nome
      })
    },

    getEstadoById() {
      estadosService.getId(this.editedItem.estado).then(res => {
        this.editedItem.estado_nome = res.data.nome
      })
    },

    async getCidadeById() {
      const res = await this.$api.get({
        resource: this.$endpoints.CIDADE,
        id: this.editedItem.cidade
      })
      this.editedItem.cidade_nome = res.data.nome
    },

    exibirObservacoes(obj) {
      this.$refs.simple.open(obj.observacao)
    }
  }
}
</script>
