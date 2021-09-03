<template>
  <v-container fluid>
    <v-main>
      <barra-superior
        :titulo="$t('faccao_pessoa.top.title')"
        :subtitulo="$t('faccao_pessoa.top.subtitle')"
        :breadcrumbs="$t('faccao_pessoa.top.breadcrumbsCadastrar')"
      />

      <v-card>
        <Snack :snack="snack" />

        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-text>
            <v-alert
              type="error"
              :value="serverHasErrors"
              transition="scroll-y-transition"
              class="mb-8"
              text
            >
              {{ serverErrorMessages }}
            </v-alert>

            <v-row dense>
              <v-col
                cols="12"
                lg="5"
                xs="12"
                class="mb-8"
              >
                <v-autocomplete
                  v-model="faccionado.faccao"
                  :items="faccoes"
                  :loading="carregandofaccao"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Facções"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Facção é obrigatória']"
                  required
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="5"
                xs="12"
                class="mb-8"
              >
                <v-autocomplete
                  v-model="faccionado.pessoa"
                  :items="pessoas"
                  :loading="carregandoPessoas"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Interno(a)"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Interno é obrigatório']"
                  required
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="4"
                xs="12"
              >
                <v-menu
                  v-model="dtFiliacao"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="faccionado.data_filiacao_faccao"
                      label="Data de filiação"
                      prepend-icon="event"
                      append-outer-icon="close"
                      readonly
                      @click:append-outer="limparDataFiliacao"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="faccionado.data_filiacao_faccao"
                  />
                </v-menu>
              </v-col>
              <v-col />
            </v-row>

            <v-row
              dense
              class="mt-5"
            >
              <v-col
                cols="12"
                lg="4"
                xs="12"
              >
                <v-menu
                  v-model="dtDesfiliacao"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="faccionado.data_desfiliacao_faccao"
                      label="Data de desfiliação"
                      prepend-icon="event"
                      append-outer-icon="close"
                      readonly
                      @click:append-outer="limparDataDesfiliacao"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="faccionado.data_desfiliacao_faccao"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="4"
                md="12"
              >
                <v-switch
                  v-model="faccionado.ativo"
                  inset
                  :label="
                    `${faccionado.ativo}` == 'true'
                      ? 'Vínculo ativo: Sim'
                      : 'Vínculo ativo: Não'
                  "
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                sm="6"
              >
                <v-textarea
                  v-model="faccionado.observacao"
                  filled
                  auto-grow
                  label="Observações"
                  rows="4"
                  row-height="30"
                  shaped
                />
              </v-col>
            </v-row>
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
        </v-form>
      </v-card>
    </v-main>
  </v-container>
</template>

<script>
import Snack from '@/components/Snack'
import * as pessoasService from '@/services/PessoasService'

export default {
  components: { Snack },
  data: () => ({
    valid: true,

    snack: {
      exibe: false,
      mensagem: ''
    },

    serverHasErrors: false,
    serverErrorMessages: '',

    carregandofaccao: false,
    carregandoPessoas: false,

    faccoes: [],
    pessoas: [],

    faccionado: {
      id: '',
      faccao: '',
      pessoa: '',
      data_filiacao_faccao: null,
      data_desfiliacao_faccao: null,
      ativo: true,
      observacao: '',
      usuario_cadastro: ''
    },
    errors: {},

    dtFiliacao: false,
    dtDesfiliacao: false
  }),

  computed: {},
  watch: {},
  async mounted() {
    this.getFaccao()
    this.getInternos()
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.FACCAO_PESSOA, id: id})
      this.faccionado = response.data
    },
    async getFaccao() {
      this.carregandofaccao = true
      const response = await this.$api.list({
        resource: this.$endpoints.FACCAO,
        query: {
          page_size: 10000,
          ativo: true,
        }
      })
      this.faccoes = response.data.results
      this.carregandofaccao = false
    },

    getInternos() {
      this.carregandoPessoas = true
      pessoasService.listarInternosAtivos().then(res => {
        let lista = res.data.results
        this.pessoas = lista
      })
      this.carregandoPessoas = false
    },

    salvar() {
      const response = this.faccionado.id
        ? this.$api.update({ resource: this.$endpoints.FACCAO_PESSOA, id: this.faccionado.id, data: this.faccionado })
        : this.$api.create({ resource: this.$endpoints.FACCAO_PESSOA, data: this.faccionado })
      response
        .then(() => {
          this.serverErrorMessages = ''
          this.serverHasErrors = false

          this.$refs.form.reset()
          this.exibeSnack(true, 'Faccionado salvo com sucesso')

          if (this.faccionado.id !== '') {
            this.$router.push('/faccao-pessoa/')
          }
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    limparDataFiliacao() {
      this.faccionado.data_filiacao_faccao = ''
    },
    limparDataDesfiliacao() {
      this.faccionado.data_desfiliacao_faccao = ''
    },
    exibeSnack(mensagem) {
      this.snack.exibe = true
      this.snack.mensagem = mensagem
    }
  }
}
</script>
