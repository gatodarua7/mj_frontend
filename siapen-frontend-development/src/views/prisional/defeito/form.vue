<template>
  <v-container fluid>
    <v-main>
      <barra-superior
        :titulo="$t('defeito.top.title')"
        :subtitulo="$t('defeito.top.subtitle')"
        :breadcrumbs="$t('defeito.top.breadcrumbsAlterar')"
      />

      <v-card>
        <v-form
          ref="form"
          v-model="valid"
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
                  v-model="defeito.descricao"
                  label="Descrição"
                  :counter="100"
                  :rules="descricaoRules"
                  required
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
              :disabled="!valid "
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
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: true,
    defeito: {},
    descricaoRules: [
      v => !!v || 'Descrição Obrigatória',
      v => (v && v.length <= 100) || 'descrição com até 100 caracteres'
    ]
  }),
  async mounted() {
    const response = await this.$api.get({
      resource: this.$endpoints.DEFEITO,
      id: this.$route.params.id
    })
    Object.assign(this.defeito, response.data)
  },
  methods: {
    salvar() {
      const response = this.defeito.id
        ? this.$api.update({ resource: this.$endpoints.DEFEITO, id: this.defeito.id, data: this.defeito })
        : this.$api.create({ resource: this.$endpoints.DEFEITO, data: this.defeito })
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
          this.displayErrors(error)
        })
    },
  }
}
</script>
