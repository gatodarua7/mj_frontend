<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-form
      ref="formSolicitanteInformado"
      v-model="valid"
    >
      <v-card>
        <v-card-title class="headline">
          Visitante Informado da Decisão
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="solicitanteInformado.comunicado"
            label="Confirmo que comuniquei o resultado do cadastro ao solicitante"
            :rules="[v => !!v || 'O campo motivo é de preenchimento obrigatório']"
            :error-messages="errors.motivo"
          />        
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted2"
                v-mask="['##/##/####']"
                label="Data do Contato"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                clearable
                readonly
                :error-messages="errors.data_contato"
                :rules="[v => !!v || 'O campo data do contato é de preenchimento obrigatório']"
                @blur="date2 = parseDate(dateFormatted2)"
                v-on="on"
              />
            </template>
            <v-date-picker
              ref="picker"
              v-model="date2"
              no-title
              locale="pt-br"
              @input="menu2 = false"
            />
          </v-menu>
        </v-card-text>
        <v-card-actions class="pt-3">
          <v-spacer />
          <v-btn
            v-if="!options.noconfirm"
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click.native="fechar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            class="body-2 font-weight-bold"
            text
            :disabled="!valid"
            @click.native="salvar"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import mensagens from '@/shared/mensagens'

export default {
  name: 'ConfirmDlg',
  data() {
    return {
      valid: false,
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      solicitanteInformado: {
        fase: 'SOLICITANTE_INFORMADO',
        motivo: '',
        data_contato: null,
        visitante: '',
        usuario_cadastro: null
      },
      title: null,
      options: {
        color: 'grey lighten-3',
        width: 400,
        zIndex: 200,
        noconfirm: false
      },
      errors: {},
      date2: null,
      dateFormatted2: null,
      menu2: false,
    }
  },
  computed: {
    computedDateFormatted2() {
      return this.formatDate(this.date2)
    }
  },
  watch: {
    date2() {
      this.solicitanteInformado.data_contato = this.formatDate(this.date2)
      this.dateFormatted2 = this.formatDate(this.date2)
    }
  },
  methods: {
    open(item) {
      this.dialog = true
      this.solicitanteInformado.visitante = item.id
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    fechar() {      
      this.dialog = false
      setTimeout(() => {
        this.solicitanteInformado = {
          fase: 'SOLICITANTE_INFORMADO',
          motivo: '',
          data_contato: null,
          visitante: '',
          usuario_cadastro: null
        }
        this.date2 = null
        this.dialog = false
        this.errors = {}
        this.$refs.formSolicitanteInformado.reset()
        this.resolve(false)
      }, 300)
    },
    salvar() {
      this.solicitanteInformado.motivo = this.solicitanteInformado.comunicado && 'Solicitante informado'
      this.solicitanteInformado.usuario_cadastro = this.user.user_id
      const response = this.$api.create({resource: this.$endpoints.VISITANTE_MOVIMENTACAO, data: this.solicitanteInformado})
      response
        .then(()=> {
          this.resolve(true)
          this.fechar()
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
  }
}
</script>
