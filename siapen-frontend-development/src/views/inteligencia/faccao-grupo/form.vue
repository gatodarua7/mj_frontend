<template>
  <v-main>
    <barra-superior
      titulo="Inteligência"
      subtitulo="Grupo de Alocação"
      :breadcrumbs="[
        {
          text: 'Dashboard',
          to: '/',
          exact: true
        },
        {
          text: 'Grupo de Alocação',
          to: '/faccao-grupo',
          exact: true
        },
        {
          text: faccao_grupo.id ? 'Editar' : 'Cadastrar',
          disabled: true
        },
      ]"
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
                <v-autocomplete
                  v-model="faccao_grupo.faccao"
                  :items="faccoes"
                  :loading="carregandofaccao"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="Facção"
                  prepend-icon="map"
                  :rules="[v => !!v || 'Facção é obrigatória']"
                  required
                  :error-messages="errors.faccao"
                >
                  <template v-slot:selection="{ item }">
                    {{ item.nome }} - {{ item.sigla }}
                  </template>
                  <template v-slot:item="{ item }">
                    {{ item.nome }} - {{ item.sigla }}
                  </template>
                </v-autocomplete>
                <v-text-field
                  v-model="faccao_grupo.nome"
                  label="Grupo"
                  :counter="150"
                  :rules="nomeRules"
                  required
                  :error-messages="errors.nome"
                />
                <v-textarea
                  v-model="faccao_grupo.observacao"
                  rows="3"
                  label="Observação"
                  :error-messages="errors.observacao"
                  filled
                  counter="200"
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
import mensagens from '@/shared/mensagens'

export default {
  data: () => ({
    valid: true,    
    carregandofaccao: false,
    faccoes: [],
    faccao_grupo: {},
    errors: {},
    nomeRules: [
      v => !!v || 'Nome obrigatório',
      v => (v && v.length <= 150) || 'Nome com até 150 caracteres'
    ]
  }),

  computed: {},
  watch: {},
  async mounted() {
    this.getFaccao()
    this.$route.params.id && this.get(this.$route.params.id)
  },
  methods: {
    async get(id){
      const response = await this.$api.get({resource: this.$endpoints.FACCAO_GRUPO, id: id})
      this.faccao_cargo = response.data
    },
    salvar() {
      const response = this.faccao_grupo.id 
        ? this.$api.update({resource: this.$endpoints.FACCAO_GRUPO, id: this.faccao_grupo.id, data: this.faccao_grupo})
        : this.$api.create({resource: this.$endpoints.FACCAO_GRUPO, data: this.faccao_grupo})
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
    async getFaccao() {
      this.carregandofaccao = true
      const response = await this.$api.list({
        resource: this.$endpoints.FACCAO,
        query: {
          page_size: 10000,
          ativo: true,
        }
      })
      this.faccoes = response.data.results
      this.carregandofaccao = false
    }
  }
}
</script>
