<template>
  <v-main>
    <barra-superior
      :titulo="$t('faccao.top.title')"
      :subtitulo="$t('faccao.top.subtitle')"
      :breadcrumbs="$t('faccao.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
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
                  v-model="faccao.nome"
                  label="Nome"
                  :counter="150"
                  :error-messages="errors.nome"
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="6"
                xs="12"
              >
                <v-text-field
                  v-model="faccao.sigla"
                  label="Sigla"
                  :counter="10"
                  :error-messages="errors.sigla"
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
                  v-model="faccao.pais"
                  :items="paises"
                  :loading="carregandoPaises"
                  chips
                  small-chips
                  multiple
                  color="blue"
                  hide-no-data
                  item-text="nome"
                  item-value="id"
                  item-color="primary"
                  label="Paises"
                  prepend-icon="map"
                  :error-messages="errors.pais"
                  @change="exibeEstados()"
                >
                  <template #selection="{ item }">
                    <v-chip
                      color="primary"
                      small
                    >
                      {{ item.nome }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="5"
                xs="12"
              >
                <v-autocomplete
                  v-if="validaEstados"
                  v-model="faccao.estado"
                  :items="estados"
                  :loading="carregandoEstados"
                  label="Estados"
                  chips
                  small-chips
                  multiple
                  prepend-icon="map"
                  item-text="nome"
                  item-value="id"
                  item-color="primary"
                  :error-messages="errors.estado"
                >
                  <template #selection="{ item }">
                    <v-chip
                      color="primary"
                      small
                    >
                      {{ item.nome }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                lg="5"
                xs="12"
              >
                <v-textarea
                  v-model="faccao.observacao"
                  rows="3"
                  filled
                  :error-messages="errors.observacao"
                  :counter="500"
                  maxlength="500"
                  name="observacao"
                  label="Observação"
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
    </v-container>
  </v-main>
</template>

<script>
import { ID_BRASIL } from '@/shared/valoresAvulsos'
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: true,
    validaEstados: false,    
    carregandoPaises: false,
    carregandoEstados: false,
    paises: [],
    estados: [],
    faccao: {},
    errors: {}
  }),
  async mounted() {
    this.getPaises()
    this.getEstados()
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.FACCAO, id: id})
      if (response.data.estado.length > 0) {
        this.validaEstados = true
      }
      this.faccao = response.data
    },
    salvar() {
      const response = this.faccao.id
        ? this.$api.update({resource: this.$endpoints.FACCAO, id: this.faccao.id, data: this.faccao})
        : this.$api.create({resource: this.$endpoints.FACCAO, data: this.faccao})
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
    exibeEstados() {
      if (this.faccao.pais.indexOf(ID_BRASIL) > -1) {
        this.validaEstados = true
      }
      if (this.faccao.pais.indexOf(ID_BRASIL) === -1) {
        this.validaEstados = false
        this.faccao.estado = []
      }
    }
  }
}
</script>
