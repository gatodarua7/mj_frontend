<template>
  <v-main>
    <barra-superior
      :titulo="$t('regime_prisional.top.title')"
      :subtitulo="$t('regime_prisional.top.subtitle')"
      :breadcrumbs="regimePrisional.id ? $t('regime_prisional.top.breadcrumbsAlterar') : $t('regime_prisional.top.breadcrumbsCadastrar')"
    />
    <v-container fluid>
      <v-card>
        <v-form
          ref="form"
          @submit.prevent="salvar"
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
                <v-text-field
                  v-model="regimePrisional.nome"
                  label="Informe a regime prisional que deseja cadastrar"
                  :counter="150"
                  :error-messages="errors.nome"
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
    regimePrisional: {},
    errors: {}
  }),
  async mounted() {
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.REGIME_PRISIONAL, id: id})
      this.regimePrisional = response.data
    },
    salvar() {
      const response = this.regimePrisional.id
        ? this.$api.update({resource: this.$endpoints.REGIME_PRISIONAL, id: this.regimePrisional.id, data: this.regimePrisional})
        : this.$api.create({resource: this.$endpoints.REGIME_PRISIONAL, data: this.regimePrisional})
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
