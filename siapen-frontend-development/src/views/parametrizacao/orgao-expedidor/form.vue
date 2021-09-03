<template>
  <v-main>
    <barra-superior
      :titulo="$t('orgao_expedidor.top.title')"
      :subtitulo="$t('orgao_expedidor.top.subtitle')"
      :breadcrumbs="$t('orgao_expedidor.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-card>
        <v-form
          ref="form"
          @submit.prevent="salvar()"
        >
          <v-card-text>
            <v-row
              dense
              class="mt-2"
            >
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-autocomplete
                  v-model="orgaoExpedidor.estado"
                  :items="estados"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="UF"
                  clearable
                  :error-messages="errors.estado"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="orgaoExpedidor.nome"
                  label="Informe o nome do órgão expedidor"
                  :counter="100"
                  :error-messages="errors.nome"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="orgaoExpedidor.sigla"
                  label="Sigla"
                  :counter="20"
                  :error-messages="errors.sigla"
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
              type="submit"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    estados: [],
    orgaoExpedidor: {
      estado: '',
      nome: '',
      sigla: ''
    },
    errors: {}
  }),
  async mounted() {
    this.getEstados()
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.ORGAO_EXPEDIDOR, id: id})
      this.orgaoExpedidor = response.data
    },
    salvar() {
      const response = this.orgaoExpedidor.id
        ? this.$api.update({resource: this.$endpoints.ORGAO_EXPEDIDOR, id: this.orgaoExpedidor.id, data: this.orgaoExpedidor})
        : this.$api.create({resource: this.$endpoints.ORGAO_EXPEDIDOR, data: this.orgaoExpedidor})
      response
        .then(() => {
          this.$router.back()
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
