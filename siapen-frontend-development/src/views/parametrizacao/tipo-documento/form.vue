<template>
  <v-main>
    <barra-superior
      :titulo="$t('tipo_documento.top.title')"
      :subtitulo="$t('tipo_documento.top.subtitle')"
      :breadcrumbs="$t('tipo_documento.top.breadcrumbsAlterar')"
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
                  v-model="tipoDocumento.nome"
                  label="Informe o tipo do documento que deseja cadastrar"
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
    tipoDocumento: {},
    errors: {}
  }),
  async mounted() {
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.TIPO_DOCUMENTO, id: id})
      this.tipoDocumento = response.data
    },
    salvar() {
      const response = this.tipoDocumento.id
        ? this.$api.update({resource: this.$endpoints.TIPO_DOCUMENTO, id: this.tipoDocumento.id, data: this.tipoDocumento})
        : this.$api.create({resource: this.$endpoints.TIPO_DOCUMENTO, data: this.tipoDocumento})
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
