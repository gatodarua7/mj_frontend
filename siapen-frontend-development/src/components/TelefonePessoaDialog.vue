<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="object.telefones"
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
            max-width="500px"
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
                  mdi-phone-plus
                </v-icon>
                <span> Incluir telefone</span>
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
                        sm="2"
                        md="4"
                      >
                        <v-autocomplete
                          v-model="telefone.tipo"
                          label="Tipo"
                          :items="tipoTelefones"
                          :rules="[v => !!v || 'Campo obrigatório']"
                          clearable
                          @change="checkTypePhone"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="10"
                        md="8"
                      >
                        <v-text-field
                          v-model="telefone.numero"
                          v-mask="['(##) ####-####', '(##) #####-####']"
                          label="Telefone"
                          prepend-inner-icon="mdi-phone"
                          :rules="[v => !!v || 'Campo obrigatório']"
                          @blur="getItem"
                        />
                      </v-col>
                      <v-col
                        v-if="ramal"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="telefone.andar"
                          label="Andar"
                        />
                      </v-col>
                      <v-col
                        v-if="ramal"
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="telefone.sala"
                          label="Sala"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-textarea
                          v-model="telefone.observacao"
                          label="Observação"
                          :counter="200"
                          :rules="observacaoRules"
                          filled
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
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-3"
                    text
                    :disabled="!valid"
                    @click="adicionar"
                  >
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.numero`]="{ item }">
        {{ addPhoneMask(item.numero) }}
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
      <template
        v-if="!readonly"
        v-slot:[`item.action`]="{ item }"
      >
        <v-toolbar-items>
          <v-tooltip top>
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
            v-if="!cantDelete"
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
        Nenhum telefone encontrado
      </template>
    </v-data-table>
    <SimpleDialog ref="simpleDialog" />
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import * as telefoneService from '@/services/TelefoneService'
import mensagens from '@/shared/mensagens'

export default {
  components: {
    SimpleDialog: () => import('./SimpleDialog'),
    ConfirmDialog: () => import('./ConfirmDialog')
  },
  props: {
    object: Object,
    readonly: Boolean,
    cantDelete: Boolean
  },
  data: () => ({
    dialog: false,
    valid: false,
    ramal: false,
    tipoTelefones: ['CELULAR', 'RESIDENCIAL'],
    headers: [
      { text: 'Número', value: 'numero' },
      { text: 'Tipo', value: 'tipo' },
      { text: 'Obs.', value: 'observacao' },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    telefone: {
      id: null,
      tipo: '',
      numero: '',
      andar: '',
      sala: '',
      observacao: ''
    },
    observacaoRules: [
      v => v.length <= 200 || 'O campo excedeu o limite de 200 caracteres'
    ],
    telefoneIndex: -1
  }),
  computed: {
    formTitle() {
      return this.telefoneIndex === -1 ? 'Novo telefone' : 'Editar telefone'
    },
    phoneNumber() {
      return this.telefone.numero && this.telefone.numero.replace(/[\s+)(+-]/g, '')
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  mounted() {
    this.checkTypePhone()
  },
  methods: {
    exibirObservacoes(observacao) {
      this.$refs.simpleDialog.open(observacao)
    },
    addPhoneMask(numero) {
      numero && numero.replace(/[^\d]/g, '')
      return numero.replace(/^([0-9]{2})([0-9]{4,5})([0-9]{4})$/, '($1) $2-$3')
    },
    checkTypePhone() {
      this.telefone.tipo == 'RAMAL'
        ? (this.ramal = true)
        : (this.ramal = false)
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.form.resetValidation()
        this.ramal = false
        this.telefone = {
          id: null,
          tipo: '',
          numero: '',
          andar: '',
          sala: '',
          observacao: ''
        }
        this.telefoneIndex = -1
      }, 300)
    },
    editarItem(item) {
      this.telefoneIndex = this.object.telefones.indexOf(item)
      this.telefone = Object.assign({}, item)
      this.checkTypePhone()
      this.dialog = true
    },
    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir telefone',
          'Você tem certeza que deseja excluir este telefone ?'
        )
      ) {
        const index = this.object.telefones.indexOf(item)
        this.object.telefones.splice(index, 1)
      }
    },
    getItem() {
      if (this.phoneNumber) {
        telefoneService.searchByPhone(this.phoneNumber, true).then(response => {
          this.clearItem()
          if(response.data.results && response.data.results.length){
            this.telefone.id = response.data.results[0].id
            this.telefone.tipo = response.data.results[0].tipo
            this.telefone.andar = response.data.results[0].andar
            this.telefone.sala = response.data.results[0].sala
            this.telefone.observacao = response.data.results[0].observacao
          }
        })
      }
    },
    clearItem() {
      this.telefone.id = null
      this.telefone.andar = ''
      this.telefone.sala = ''
      this.telefone.observacao = ''
    },
    checkPhoneUse() {
      telefoneService.getPhoneUse(this.phoneNumber).then(response => {
        const list = response.data.nome
        const list_names = list.join(', ')
        if (list.length) {
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `Esse telefone já está cadastrado para a(s) pessoa(s): ${list_names}`,
            color: 'warning',
            timeout: 3000
          })
        }
      })
    },
    adicionar() {
      this.checkPhoneUse()
      this.salvar()
    },
    salvar() {
      const index = this.object.telefones.findIndex(item => item.numero === this.phoneNumber)
      this.telefone.numero = this.phoneNumber
      this.telefone.privado = true
      const response = this.telefone.id ? telefoneService.alterar(this.telefone) : telefoneService.inserir(this.telefone)
      response
        .then(res => {
          let itemIndex = (index > -1) ? index : this.telefoneIndex
          this.telefoneIndex > -1
            ? Object.assign(this.object.telefones[itemIndex], res.data)
            : this.object.telefones.push(res.data)
          index > -1 && this.object.telefones.splice(this.telefoneIndex, 1)
          this.close()
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
  }
}
</script>
