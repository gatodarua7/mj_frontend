<template>
  <v-main>
    <barra-superior
      :titulo="$t('titulo.top.title')"
      :subtitulo="$t('titulo.top.subtitle')"
      :breadcrumbs="$t('titulo.top.breadcrumbsAlterar')"
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
                  v-model="titulo.norma_juridica"
                  :items="normas"
                  hide-no-data
                  hide-selected
                  label="Normas Jurídicas"
                  item-value="value"
                  item-text="text"
                  clearable
                  :error-messages="errors.norma_juridica"
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="titulo.nome"
                  label="Título"
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
import * as tituloService from '@/services/TituloService'

export default {
  data: () => ({
    titulo: {},
    normas: [
      {value: 'EMENDA_CONSTITUICAO', text: 'Emenda à Constituição'},
      {value: 'LEI_COMPLEMENTAR', text: 'Lei Complementar'},
      {value: 'LEI_ORDINARIA', text: 'Lei Ordinária'},
      {value: 'LEI_DELEGADA', text: 'Lei Delegada'},
      {value: 'MEDIDA_PROVISORIA', text: 'Medida Provisória'},
      {value: 'DECRETO_LEGISLATIVO', text: 'Decreto Legislativo'},
      {value: 'RESOLUCAO', text: 'Resolução'}
    ],
    errors: {}
  }),
  mounted() {
    let id = this.$route.params.id
    tituloService.getId(id).then(response => {
      this.titulo = response.data
    })
  },
  methods: {
    salvar() {
      this.titulo.ativo = true
      const response = this.titulo.id
        ? this.$api.update({resource: this.$endpoints.TITULO, id: this.titulo.id, data: this.titulo})
        : this.$api.create({resource: this.$endpoints.TITULO, data: this.titulo})
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
