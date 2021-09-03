<template>
  <v-main>
    <barra-superior
      :titulo="$t('penal_system.top.title')"
      :subtitulo="$t('penal_system.top.subtitle')"
      :breadcrumbs="$t('penal_system.top.breadcrumbsAlterar')"
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
                md="8"
              >
                <v-text-field
                  v-model="sistemaPenal.nome"
                  label="Nome"
                  :counter="100"
                  :rules="nomeRules"
                  required
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="sistemaPenal.sigla"
                  :counter="60"
                  label="Sigla"
                  :rules="siglaRules"
                  required
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col
                cols="12"
                md="12"
              >
                <v-autocomplete
                  v-model="sistemaPenal.pais"
                  :items="paises"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="País"
                  prepend-icon="flag"
                  :rules="[v => !!v || 'País é obrigatório']"
                  required
                  clearable
                  @change="showEstados(sistemaPenal.pais)"
                />
              </v-col>

              <v-col
                v-show="estadoControle"
                cols="12"
                sm="6"
                md="12"
              >
                <v-autocomplete
                  v-if="estadoControle"
                  v-model="sistemaPenal.estado"
                  :items="estados"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Estado"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Estado é obrigatório']"
                  clearable
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
import { ID_BRASIL } from '@/shared/valoresAvulsos'
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: true,
    
    estadoControle: false,
    sistemaPenal: {},
    paises: [],
    estados: [],
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
  async mounted() {
    let id = this.$route.params.id
    if (id !== undefined) {
      const response = await this.$api.get({resource: this.$endpoints.SISTEMA_PENAL, id: id})
      this.sistemaPenal = response.data
      this.showEstados(this.sistemaPenal.pais)
    }

    this.getPaises()
    this.getEstados()
  },
  methods: {
    salvar() {
      const response = this.sistemaPenal.id
        ? this.$api.update({ resource: this.$endpoints.DEFEITO, id: this.sistemaPenal.id, data: this.sistemaPenal })
        : this.$api.create({ resource: this.$endpoints.DEFEITO, data: this.sistemaPenal })
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
    limpar() {
      this.estadoControle = false
      this.$refs.form.reset()
    },
    showEstados(id) {
      if (id != ID_BRASIL) {
        this.estadoControle = false
        this.sistemaPenal.estado = ''
      } else {
        this.estadoControle = true
      }
    }
  }
}
</script>
