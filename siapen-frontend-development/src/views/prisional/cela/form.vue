<template>
  <v-main>
    <barra-superior
      :titulo="$t('cela.top.title')"
      :subtitulo="$t('cela.top.subtitle')"
      :breadcrumbs="$t('cela.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-tree-view
                v-if="carregado && !cela.id"
                :items="items"
                :open="open"
                :value.sync="cela"
              />
              <v-treeview
                v-else
                item-key="key"
                :items="items"
                open-all
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <div class="sticky">
                <v-form
                  ref="form"
                  @submit.prevent="salvar()"
                >
                  <v-text-field
                    v-model="cela.sistema_nome"
                    label="Sistema Penal"
                    readonly
                    filled
                  />
                  <v-text-field
                    v-model="cela.unidade_nome"
                    label="Unidade de Custódia"
                    readonly
                    filled
                  />
                  <v-text-field
                    v-model="cela.bloco_nome"
                    label="Bloco/Alocação"
                    readonly
                    filled
                    :error-messages="errors.bloco"
                  />
                  <v-text-field
                    v-model="cela.nome"
                    label="Nome/nº da cela"
                    prepend-icon="person"
                    :error-messages="errors.nome"
                  />
                  <v-text-field
                    v-model="cela.capacidade"
                    label="Capacidade de Internos"
                    prepend-icon="people"
                    :error-messages="errors.capacidade"
                  />
                  <v-textarea
                    v-model="cela.observacao"
                    rows="3"
                    label="Observação"
                    :error-messages="errors.observacao"
                  />
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
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as celaService from '@/services/CelaService'
import mensagens from '@/shared/mensagens'
import VTreeView from '@/components/VTreeView.vue'

export default {
  components: { VTreeView },
  data: () => ({
    carregado: false,
    cela: {
      sistema: null,
      sistema_nome: null,
      unidade: null,
      unidade_nome: null,
      bloco: null,
      bloco_nome: null
    },
    items: [],
    errors: {},
    open: []
  }),
  async mounted() {
    let id = this.$route.params.id
    id ? this.montaArvoreCelaById(id) : this.montaArvoreCela()
  },
  methods: {
    salvar() {
      const response = this.cela.id
        ? this.$api.update({resource: this.$endpoints.CELA, id: this.cela.id, data: this.cela})
        : this.$api.create({resource: this.$endpoints.CELA, data: this.cela})
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
    montaArvoreCela() {
      celaService.getArvore().then(response => {
        this.items = response.data
        this.carregado = true
      })
    },
    async montaArvoreCelaById(id) {
      celaService.getArvoreById(id).then(res => {
        this.items = res.data
        this.carregado = true
      })
      const response = await this.$api.get({resource: this.$endpoints.CELA, id: id})
      this.cela = response.data
    }
  }
}
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 15vh;
}
</style>
