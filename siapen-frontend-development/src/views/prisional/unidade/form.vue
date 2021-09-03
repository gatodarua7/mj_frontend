<template>
  <v-main>
    <barra-superior
      :titulo="$t('units.top.title')"
      :subtitulo="$t('units.top.subtitle')"
      :breadcrumbs="$t('units.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                lg="5"
                xs="12"
                class="mb-8"
              >
                <v-autocomplete
                  v-model="unidade.sistema"
                  :items="sistemas"
                  :loading="carregandoPaises"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Sistema Penal"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Sistema penal é obrigatório']"
                  required
                  clearable
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
                  v-model="unidade.estado"
                  :items="estados"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Estado"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Estado é obrigatório']"
                  required
                  clearable
                  @change="getCidadesPorEstado(unidade.estado)"
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
                  v-model="unidade.cidade"
                  :items="cidades"
                  :loading="carregandoCidades"
                  hide-no-data
                  hide-selected
                  item-text="nome_uf"
                  item-value="id"
                  label="Cidade da unidade"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Cidade é obrigatório']"
                  required
                  clearable
                />
              </v-col>
            </v-row>

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
                  v-model="unidade.nome"
                  label="Nome"
                  :counter="100"
                  :rules="nomeRules"
                  required
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
                  v-model="unidade.sigla"
                  label="Sigla"
                  :counter="60"
                  :rules="siglaRules"
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
    </v-container>
  </v-main>
</template>

<script>
import * as unidadeService from '@/services/UnidadeService'
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: true,
    
    unidade: {},
    sistemas: [],
    cidades: [],
    estados: [],
    estado: null,
    carregandoCidades: false,
    carregandoPaises: false,
    nomeRules: [
      v => !!v || 'Nome Obrigatório',
      v => (v && v.length <= 100) || 'Nome com até 100 caracteres'
    ],
    siglaRules: [
      v => !!v || 'Sigla Obrigatória',
      v => (v && v.length <= 60) || 'Sigla com até 60 caracteres'
    ]
  }),

  computed: {},
  watch: {},
  mounted() {
    let id = this.$route.params.id
    if (id !== undefined) {
      unidadeService.getUnidadeId(id).then(response => {
        this.getSistemaPenal()
        let lista = response.data
        this.getEstados()
        this.getCidadesPorEstado(lista.estado)
        this.unidade = Object.assign({}, lista)
      })
    } else {
      this.getEstados()
      this.getSistemaPenal()
    }
  },
  methods: {
    async getSistemaPenal() {
      this.carregandoPaises = true
      const response = await this.$api.list({
        resource: this.$endpoints.SISTEMA_PENAL,
        query: {
          page_size: 10000,
          ativo: true
        }
      })
      this.sistemas = response.data.results
      this.carregandoPaises = false
    },

    salvar() {
      unidadeService
        .alterar(this.unidade)
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
    }
  }
}
</script>


