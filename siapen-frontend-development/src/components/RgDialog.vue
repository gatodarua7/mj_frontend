<template>
  <v-card elevation="0">
    <v-data-table
      :headers="headers"
      :items="object.rgs"
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
                  mdi-map-marker-plus
                </v-icon>Incluir
                RG
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
                        v-model="rg.numero"
                        label="RG"
                        :error-messages="errors.numero"                        
                        :rules="[v => !!v || 'O campo RG é de preenchimento obrigatório']"
                        :disabled="readonly"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                    >
                      <v-autocomplete
                        v-model="rg.uf_rg"
                        :items="ufs_rg"
                        hide-no-data
                        hide-selected
                        item-text="nome"
                        item-value="id"
                        label="UF -RG"
                        clearable
                        :error-messages="errors.uf_rg"
                        :rules="[v => !!v || 'O campo UF-RG é de preenchimento obrigatório']"
                        :disabled="readonly"
                        @change="getOrgaosPorEstado(rg.uf_rg)"
                        @click:clear="onUfRgClear"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                    >
                      <v-autocomplete
                        v-model="rg.orgao_expedidor"
                        :items="orgaoExpedidor"
                        hide-no-data
                        hide-selected
                        item-text="nome"
                        item-value="id"
                        label="Órgão Expedidor"
                        clearable
                        :error-messages="errors.orgao_expedidor"
                        :rules="[v => !!v || 'O campo Órgão Expedidor é de preenchimento obrigatório']"
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
      <template v-slot:loading>
        Carregando...
      </template>
      <template v-slot:no-data>
        Nenhum RG encontrado
      </template>
    </v-data-table>
    <SimpleDialog ref="simple" />
    <ConfirmDialog ref="confirm" />
  </v-card>
</template>

<script>
import * as orgaoExpedidorService from '@/services/OrgaoExpedidorService'
import mensagens from '@/shared/mensagens'

export default {
  components: {
    SimpleDialog: () => import('@/components/SimpleDialog'),
    ConfirmDialog: () => import('@/components/ConfirmDialog')
  },
  props: {
    object: Object,
    readonly: Boolean,
    endpoint: String
  },
  data: () => ({
    valid: false,
    dialog: false,
    disabled: false,
    rgIndex: -1,
    rg: {},
    errors: {},
    headers: [],
    ufs_rg: [],
    orgaoExpedidor: []
  }),

  computed: {
    formTitle() {
      return this.rgIndex === -1 ? 'Novo RG' : 'Editar RG'
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
        { text: 'RG', value: 'numero' },
        { text: 'UF-RG', value: 'uf_rg_nome' },
        { text: 'Órgão Expedidor', value: 'orgao_expedidor_nome' }
      ]
    } else {
      this.headers = [
        { text: 'RG', value: 'numero' },
        { text: 'UF-RG', value: 'uf_rg_nome' },
        { text: 'Órgão Expedidor', value: 'orgao_expedidor_nome' },
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
        this.rg = {}
        this.rgIndex = -1
        this.errors = {}
      }, 300)
    },

    async editarItem(item) {
      this.rgIndex = this.object.rgs.indexOf(item)
      this.rg = Object.assign({}, item)
      this.getOrgaosPorEstado(this.rg.uf_rg)
      this.dialog = true
    },

    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir RG',
          'Você tem certeza que deseja excluir este RG ?'
        )
      ) {
        const response = this.$api.destroy({
          resource: this.endpoint,
          id: item.id
        })
        response
          .then(() =>{
            const index = this.object.rgs.indexOf(item)
            this.object.rgs.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },

    salvar() {
      this.object.id && (this.rg.interno = this.object.id)
      const response = this.rg.id 
        ? this.$api.update({ resource: this.endpoint, id: this.rg.id, data: this.rg })
        : this.$api.create({ resource: this.endpoint, data: this.rg })
      response
        .then(result => {
          this.rgIndex > -1
            ? Object.assign(this.object.rgs[this.rgIndex], result.data)
            : this.object.rgs.push(result.data)
          this.close()            
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
          if(this.errors.orgao_expedidor && !this.rg.uf_rg){
            this.errors.uf_rg = 'O campo UF-RG é de preenchimento obrigatório'
          }
        })
    },

    getOrgaosPorEstado(uf) {
      orgaoExpedidorService.searchByUf(uf).then(res => {
        this.orgaoExpedidor = res.data.results
      })
    },

    onUfRgClear() {
      this.rg.orgao_expedidor = null
      this.orgaoExpedidor = []
    },

    getUfs() {
      orgaoExpedidorService.getUfs().then(response => {
        this.ufs_rg = response.data.results
      })
    }
  }
}
</script>
