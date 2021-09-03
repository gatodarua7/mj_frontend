<template>
  <v-main>
    <barra-superior
      :titulo="$t('bloco.top.title')"
      :subtitulo="$t('bloco.top.subtitle')"
      :breadcrumbs="$t('bloco.top.breadcrumbsAlterar')"
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
                v-if="carregado && !bloco.id"
                :items="items"
                :open="open"
                :value.sync="bloco"
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
                <v-text-field
                  v-model="bloco.sistema_nome"
                  label="Sistema Penal"
                  readonly
                  filled
                />
                <v-text-field
                  v-model="bloco.unidade_nome"
                  label="Unidade de Custódia"
                  readonly
                  filled
                  :error-messages="errors.unidade"
                />
                <v-text-field
                  v-model="bloco.bloco_pai_nome"
                  label="Bloco Pai"
                  readonly
                  filled
                />
                <v-form ref="form">
                  <v-text-field
                    v-model="bloco.nome"
                    label="Nome"
                    :error-messages="errors.nome"
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
                    @click="salvar"
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
import * as blocoService from '@/services/BlocoService'
import mensagens from '@/shared/mensagens'
import VTreeView from '@/components/VTreeView.vue'

export default {
  components: { VTreeView },
  data: () => ({
    carregado: false,
    bloco: {
      nome: null,
      sistema: null,
      sistema_nome: null,
      unidade: null,
      unidade_nome: null,
      bloco_pai: null,
      bloco_pai_nome: null
    },
    items: [],
    nomeRules: [
      v => !!v || 'Nome Obrigatório',
      v => (v && v.length <= 100) || 'Nome com até 100 caracteres'
    ],
    errors: {},
    open: []
  }),
  async mounted() {
    let id = this.$route.params.id
    id ? this.montaArvoreBlocoById(id) : this.montaArvoreBloco()
  },
  methods: {
    salvar() {
      this.bloco.usuario_cadastro = this.user.user_id
      const response = this.bloco.id
        ? this.$api.update({resource: this.$endpoints.BLOCO, id: this.bloco.id, data: this.bloco})
        : this.$api.create({resource: this.$endpoints.BLOCO, data: this.bloco})
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
    montaArvoreBloco() {
      blocoService.getArvore().then(response => {
        this.items = response.data
        this.carregado = true
      })
    },
    async montaArvoreBlocoById(id) {
      blocoService.getArvoreById(id).then(res => {
        this.items = res.data
        this.carregado = true
      })
      const response = await this.$api.get({resource: this.$endpoints.BLOCO, id: id})
      this.bloco = response.data
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
