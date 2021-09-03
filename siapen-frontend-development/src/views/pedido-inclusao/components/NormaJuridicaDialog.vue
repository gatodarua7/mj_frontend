<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="object.motivos_inclusao"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-dialog
            v-model="dialog"
            persistent
            max-width="1200px"
          >
            <template
              v-slot:activator="{ on }"
            >
              <v-btn
                v-show="!readonly"
                color="primary"
                class="mb-2"
                text
                v-on="on"
              >
                <span> Incluir motivo da inclusão</span>
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
                      >
                        <v-autocomplete
                          v-model="motivoInclusao.norma_juridica"
                          :items="normas"
                          hide-no-data
                          hide-selected
                          label="Normas Jurídicas"
                          item-value="value"
                          item-text="text"
                          clearable
                          :error-messages="errors.norma_juridica"
                          :disabled="disabled"
                          :rules="[v => !!v || 'O campo é de preenchimento obrigatório']"
                          @change="getTitulos"
                          @click:clear="limpar"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <v-autocomplete
                          v-model="motivoInclusao.titulo"
                          :items="titulos"
                          hide-no-data
                          hide-selected
                          label="Título"
                          item-value="id"
                          item-text="nome"
                          clearable
                          :error-messages="errors.titulo"
                          :disabled="disabled"
                          :rules="[v => !!v || 'O campo é de preenchimento obrigatório']"
                          @change="getDescricao"
                          @click:clear="limparTitulo"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <v-autocomplete
                          v-model="motivoInclusao.descricao"
                          :items="descricoes"
                          hide-no-data
                          label="Descrição"
                          item-value="id"
                          item-text="descricao"
                          small-chips
                          clearable
                          multiple
                          :rules="[v => !!v || 'O campo é de preenchimento obrigatório']"
                          :error-messages="errors.descricao"
                          :disabled="disabled"
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
                    {{ disabled ? 'Fechar' : 'Cancelar' }}
                  </v-btn>
                  <v-btn
                    v-if="!disabled"
                    color="blue darken-3"
                    text
                    :disabled="!valid"
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
                @click="desvincularItem(item)"
                v-on="on"
              >
                <v-icon>link_off</v-icon>
              </v-btn>
            </template>
            <span>Desvincular</span>
          </v-tooltip>
        </v-toolbar-items>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import * as tituloService from '@/services/TituloService'

export default {
  props: {
    object: Object,
    readonly: Boolean
  },
  data: () => ({
    dialog: false,
    valid: false,
    disabled: false,
    headers: [
      { text: 'Norma Jurídica', value: 'norma_juridica_nome' },
      { text: 'Título', value: 'titulo_nome' },
      { text: 'Descrição', value: 'descricao_nome' },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    motivoInclusao: {
      descricao: '',
    },
    motivoInclusaoIndex: -1,
    errors: {},
    normas: [
      {value: 'EMENDA_CONSTITUICAO', text: 'Emenda à Constituição'},
      {value: 'LEI_COMPLEMENTAR', text: 'Lei Complementar'},
      {value: 'LEI_ORDINARIA', text: 'Lei Ordinária'},
      {value: 'LEI_DELEGADA', text: 'Lei Delegada'},
      {value: 'MEDIDA_PROVISORIA', text: 'Medida Provisória'},
      {value: 'DECRETO_LEGISLATIVO', text: 'Decreto Legislativo'},
      {value: 'RESOLUCAO', text: 'Resolução'}
    ],
    titulos: [],
    descricoes: [],
  }),
  computed: {
    formTitle() {
      return this.motivoInclusaoIndex === -1 ? 'Incluir motivo' : 'Visualizar motivo'
    }
  },
  watch: {
    dialog(val) {
      val || this.fechar()
    }
  },
  methods: {
    limparTitulo() {
      this.motivoInclusao.titulo = null
      this.motivoInclusao.descricao = ''
    },
    getTitulos(val) {
      val &&
        tituloService
          .getByNorma(val)
          .then(res => {
            this.titulos = res.data.results
          })
    },
    getAllTitulos(norma, titulo) {
      tituloService
        .getByNormaEdit(norma, titulo)
        .then(res => {
          this.titulos = res.data.results
        })
    },
    async getDescricao() {
      const response = await this.$api.list({
        resource: this.$endpoints.NORMA_JURIDICA,
        query: {
          norma_juridica: this.motivoInclusao.norma_juridica,
          titulo: this.motivoInclusao.titulo,
          norma_id: this.motivoInclusao.descricao,
          ativo: true
        }
      })
      this.descricoes = response.data.results
    },
    fechar() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.form.resetValidation()
        this.disabled = false
        this.motivoInclusao = {
          descricao: '',
        }
        this.motivoInclusaoIndex = -1
        this.errors = {}
      }, 300)
    },
    getNormaNome(){
      const index = this.normas.findIndex(res => res.value === this.motivoInclusao.norma_juridica)
      return this.normas[index].text
    },
    getTituloNome(){
      const index = this.titulos.findIndex(res => res.id === this.motivoInclusao.titulo)
      return this.titulos[index].nome
    },
    getDescricoesNome(){
      let lista = []
      this.motivoInclusao.descricao.map(item => {
        const index = this.descricoes.findIndex(res => res.id === item)
        lista.push(this.descricoes[index].descricao)
      })
      return lista
    },
    async salvar() {
      this.motivoInclusao.norma_juridica_nome= this.getNormaNome()
      this.motivoInclusao.titulo_nome = this.getTituloNome()
      this.motivoInclusao.descricao_nome = this.getDescricoesNome()
      this.motivoInclusaoIndex > -1
        ? Object.assign(
            this.object.motivos_inclusao[this.motivoInclusaoIndex],
            this.motivoInclusao
          )
        : this.object.motivos_inclusao.push(this.motivoInclusao)
      this.fechar()
    },
    visualizarItem(item) {
      this.getAllTitulos(item.norma_juridica, item.titulo)
      this.motivoInclusaoIndex = this.object.motivos_inclusao.indexOf(item)
      this.motivoInclusao = item      
      this.getDescricao()
      this.disabled = true
      this.dialog = true
    },
    desvincularItem(item) {
      const index = this.object.motivos_inclusao.indexOf(item)
      this.object.motivos_inclusao.splice(index, 1)
    }
  }
}
</script>