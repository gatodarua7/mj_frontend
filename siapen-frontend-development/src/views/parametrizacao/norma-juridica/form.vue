<template>
  <v-main>
    <barra-superior
      :titulo="$t('norma_juridica.top.title')"
      :subtitulo="$t('norma_juridica.top.subtitle')"
      :breadcrumbs="$t('norma_juridica.top.breadcrumbsAlterar')"
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
                  v-model="normaJuridica.norma_juridica"
                  :items="normas"
                  hide-no-data
                  hide-selected
                  label="Normas Jurídicas"
                  item-value="value"
                  item-text="text"
                  clearable
                  :error-messages="errors.norma_juridica"
                  @change="getTitulos"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-autocomplete
                  v-model="normaJuridica.titulo"
                  :items="titulos"
                  hide-no-data
                  hide-selected
                  label="Título"
                  item-value="id"
                  item-text="nome"
                  clearable
                  :error-messages="errors.titulo"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-textarea
                  v-model="normaJuridica.descricao"
                  label="Descrição"
                  rows="3"
                  filled
                  :error-messages="errors.descricao"
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
import * as tituloService from '@/services/TituloService'

export default {
  data: () => ({
    normaJuridica: {},
    normas: [
      {value: 'EMENDA_CONSTITUICAO', text: 'Emenda à Constituição'},
      {value: 'LEI_COMPLEMENTAR', text: 'Lei Complementar'},
      {value: 'LEI_ORDINARIA', text: 'Lei Ordinária'},
      {value: 'LEI_DELEGADA', text: 'Lei Delegada'},
      {value: 'MEDIDA_PROVISORIA', text: 'Medida Provisória'},
      {value: 'DECRETO_LEGISLATIVO', text: 'Decreto Legislativo'},
      {value: 'RESOLUCAO', text: 'Resolução'}
    ],
    titulos: [],
    errors: {}
  }),
  async mounted() {
    const response = await this.$api.get({resource: this.$endpoints.NORMA_JURIDICA, id: this.$route.params.id})
    this.normaJuridica = response.data
    tituloService
      .getByNormaEdit(response.data.norma_juridica, response.data.titulo)
      .then(res => {
        this.titulos = res.data.results
      })
  },
  methods: {
    getTitulos(norma_juridica) {
      this.normaJuridica.titulo = null
      this.normaJuridica.titulo_nome = null
      norma_juridica &&
        tituloService
          .getByNorma(norma_juridica)
          .then(res => {
            this.titulos = res.data.results
          })
    },
    salvar() {      
      this.normaJuridica.ativo = true
      const response = this.normaJuridica.id
        ? this.$api.update({resource: this.$endpoints.NORMA_JURIDICA, id: this.normaJuridica.id, data: this.normaJuridica})
        : this.$api.create({resource: this.$endpoints.NORMA_JURIDICA, data: this.normaJuridica})
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
    }
  }
}
</script>
