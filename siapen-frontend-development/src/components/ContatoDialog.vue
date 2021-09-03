<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="object.contatos"
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
            max-width="1200px"
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
                <span> Incluir contato</span>
              </v-btn>
            </template>
            <v-form ref="form">
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        md="4"
                        sm="12"
                      >
                        <v-autocomplete
                          v-model="contato.tipo_vinculo"
                          :items="vinculos"
                          hide-no-data
                          hide-selected
                          item-text="nome"
                          item-value="id"
                          label="Vínculo"
                          clearable
                          :error-messages="errors.tipo_vinculo"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="8"
                        sm="12"
                      >
                        <v-text-field
                          v-model="contato.nome"
                          label="Nome"
                          :error-messages="errors.nome"
                          :disabled="disabled"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        <endereco-pessoa-dialog
                          :object="contato"
                          :readonly="disabled"
                          :cant-delete="disabled"
                        />
                        <telefone-pessoa-dialog
                          :object="contato"
                          :readonly="disabled"
                          :cant-delete="disabled"
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
        v-slot:[`item.total_enderecos`]="{ item }"
      >
        <v-btn
          text
          @click="visualizarItem(item)"
        >
          {{ item.total_enderecos }}
          <v-icon
            color="primary"
            dark
          >
            mdi-information
          </v-icon>
        </v-btn>
      </template>
      <template
        v-slot:[`item.total_telefones`]="{ item }"
      >
        <v-btn
          text
          @click="visualizarItem(item)"
        >
          {{ item.total_telefones }}
          <v-icon
            color="primary"
            dark
          >
            mdi-information
          </v-icon>
        </v-btn>
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
    <ConfirmDialog ref="confirm" />
  </v-card>
</template>
<script>
import ConfirmDialog from '@/components/ConfirmDialog'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog'
import mensagens from '@/shared/mensagens'

export default {
  components: { ConfirmDialog, TelefonePessoaDialog, EnderecoPessoaDialog},
  props: {
    object: Object,
    readonly: Boolean
  },
  data: () => ({
    search: '',
    dialog: false,
    disabled: false,
    vinculos: [],
    headers: [
      { text: 'Nome', value: 'nome' },
      { text: 'Vínculo', value: 'tipo_vinculo_nome' },
      { text: 'Qntd Endereço', value: 'total_enderecos', sortable: false },
      { text: 'Qntd Telefone', value: 'total_telefones', sortable: false },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    contato: {
      enderecos: [],
      telefones: []
    },
    contatoIndex: -1,
    errors: {}
  }),
  computed: {
    formTitle() {
      let title = ''
      if (this.disabled) {
        title = 'Visualizar contato'
      } else {
        this.contatoIndex === -1
          ? (title = 'Novo contato')
          : (title = 'Editar contato')
      }
      return title
    }
  },
  watch: {
    dialog(val) {
      val || this.fechar()
    }
  },
  mounted() {
    this.getTipoVinculos()
  },
  methods: {
    async getDataFromApi() {
      const response = await this.$api.list({
        resource: this.$endpoints.CONTATO_INTERNO,
        query: {
          page_size: 10000,
          ativo: true,
          search: this.search,
          interno: this.object.id
        }
      })
      this.object.contatos = response.data.results
    },
    fechar() {
      this.dialog = false
      setTimeout(() => {
        this.disabled = false
        this.contato = {
          enderecos: [],
          telefones: []
        }
        this.contatoIndex = -1
        this.errors = {}
      }, 300)
    },
    visualizarItem(item) {
      this.contatoIndex = this.object.contatos.indexOf(item)
      this.contato = item
      this.disabled = true
      this.dialog = true
    },
    editarItem(item) {
      this.contatoIndex = this.object.contatos.indexOf(item)
      this.contato = item
      this.dialog = true
    },
    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir contato',
          'Você tem certeza que deseja excluir este contato ?'
        )
      ) {
        const response = await this.$api.destroy({
          resource: this.$endpoints.CONTATO_INTERNO,
          id: item.id
        })
        response
          .then(() =>{
            const index = this.object.contatos.indexOf(item)
            this.object.contatos.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },
    salvar() {
      this.object.id && (this.contato.interno = this.object.id)
      const response = this.contato.id 
        ? this.$api.update({ resource: this.$endpoints.CONTATO_INTERNO, id: this.contato.id, data: this.contato })
        : this.$api.create({ resource: this.$endpoints.CONTATO_INTERNO, data: this.contato })
      response
        .then(result => {
          this.contatoIndex > -1
            ? Object.assign(
                this.object.contatos[this.contatoIndex],
                result.data
              )
            : this.object.contatos.push(result.data)
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
          this.fechar()
          this.object.id && this.$emit('update')
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
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
    }
  }
}
</script>
