<template>
  <v-main>
    <barra-superior
      :titulo="$t('grau_periculosidade.top.title')"
      :subtitulo="$t('grau_periculosidade.top.subtitle')"
      :breadcrumbs="grauPericulosidade.id ? $t('grau_periculosidade.top.breadcrumbsAlterar') : $t('grau_periculosidade.top.breadcrumbsCadastrar')"
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
                  v-model="grauPericulosidade.nome"
                  label="Nome"
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
                  v-model="grauPericulosidade.sigla"
                  label="Sigla"
                  :counter="20"
                  :error-messages="errors.sigla"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-textarea
                  v-model="grauPericulosidade.observacao"
                  label="Observação"
                  :counter="500"
                  :error-messages="errors.observacao"
                  filled
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
    grauPericulosidade: {},
    errors: {}
  }),
  async mounted() {
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.GRAU_PERICULOSIDADE, id: id})
      this.grauPericulosidade = response.data
    },
    salvar() {
      const response = this.grauPericulosidade.id
        ? this.$api.update({resource: this.$endpoints.GRAU_PERICULOSIDADE, id: this.grauPericulosidade.id, data: this.grauPericulosidade})
        : this.$api.create({resource: this.$endpoints.GRAU_PERICULOSIDADE, data: this.grauPericulosidade})
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
