<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="object.oabs"
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
                  post_add
                </v-icon>Incluir
                OAB
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
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                    >
                      <v-text-field
                        v-model="oab.numero"
                        label="OAB"
                        :error-messages="errors.numero"                        
                        :rules="[v => !!v || 'O campo OAB é de preenchimento obrigatório']"
                        :disabled="readonly"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                    >
                      <v-autocomplete
                        v-model="oab.estado"
                        :items="ufs_oab"
                        hide-no-data
                        hide-selected
                        item-text="nome"
                        item-value="id"
                        label="UF"
                        clearable
                        :error-messages="errors.estado"
                        :rules="[v => !!v || 'O campo UF é de preenchimento obrigatório']"
                        :disabled="readonly"
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

      <template v-slot:[`item.action`]="{ item }">
        <v-toolbar-items>
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
        Nenhuma OAB encontrada
      </template>
    </v-data-table>
    <SimpleDialog ref="simple" />
    <ConfirmDialog ref="confirm" />
  </v-card>
</template>

<script>
export default {
  components: {
    SimpleDialog: () => import('./SimpleDialog'),
    ConfirmDialog: () => import('./ConfirmDialog')
  },
  props: ['object', 'readonly'],
  data: () => ({
    valid: false,
    dialog: false,
    disabled: false,
    oabIndex: -1,
    oab: {},
    errors: {},
    headers: [],
    ufs_oab: [],
  }),
  computed: {
    formTitle() {
      return this.oabIndex === -1 ? 'Incluir OAB' : 'Editar OAB'
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  mounted() {
    this.getUfs()
    if (this.readonly) {
      this.headers = [
        { text: 'OAB', value: 'numero' },
        { text: 'UF', value: 'estado_nome' }
      ]
    } else {
      this.headers = [
        { text: 'OAB', value: 'numero' },
        { text: 'UF', value: 'estado_nome' },
        { text: 'Ações', value: 'action', sortable: false }
      ]
    }
  },
  methods: {
    close() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.form.reset()
        this.disabled = false
        this.oab = {}
        this.oabIndex = -1
        this.errors = {}
      }, 300)
    },

    async editarItem(item) {
      this.oabIndex = this.object.oabs.indexOf(item)
      this.oab = Object.assign({}, item)
      this.dialog = true
    },

    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir OAB',
          'Você tem certeza que deseja excluir esta OAB ?'
        )
      ) {
        const response = this.$api.destroy({resource: this.$endpoints.OAB, id: item.id})
        response
          .then(() =>{
            const index = this.object.oabs.indexOf(item)
            this.object.oabs.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },

    salvar() {
      this.object.id && (this.oab.advogado = this.object.id)
      const response = this.oab.id 
        ? this.$api.update({resource: this.$endpoints.OAB, id: this.oab.id, data: this.oab})
        : this.$api.create({resource: this.$endpoints.OAB, data: this.oab})
      response
        .then(result => {
          this.oabIndex > -1
            ? Object.assign(this.object.oabs[this.oabIndex], result.data)
            : this.object.oabs.push(result.data)
          this.close()
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },

    async getUfs() {
      const response = await this.$api.list({
        resource: this.$endpoints.ESTADO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.ufs_oab = response.data.results
    },
  }
}
</script>
