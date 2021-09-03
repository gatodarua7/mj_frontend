<template>
  <v-main>
    <barra-superior
      :titulo="$t('setor.top.title')"
      :subtitulo="$t('setor.top.subtitle')"
      :breadcrumbs="$t('setor.top.breadcrumbsCadastrar')"
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
                v-if="carregado"
                :items="items"
                :open="open"
                :active="active"
                :value.sync="setor"
              />
              <v-alert
                v-if="carregado && !items.length"
                outlined
                type="error"
                border="left"
              >
                Ainda não há setor cadastrado
              </v-alert>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-text-field
                v-if="setor.setor_pai_nome"
                v-model="setor.setor_pai_nome"
                label="Setor Pai"
                readonly
                filled
              />
              <v-form ref="form">
                <v-text-field
                  v-model="setor.nome"
                  label="Nome"
                  required
                  :error-messages="errors.nome"
                />
                <v-text-field
                  v-model="setor.sigla"
                  label="Sigla"
                  :error-messages="errors.sigla"
                />
              </v-form>
              <endereco-setor-dialog :object="setor" />
              <telefone-setor-dialog :object="setor" />
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
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as setorService from '@/services/SetorService'
import mensagens from '@/shared/mensagens'
import TelefoneSetorDialog from '@/components/TelefoneSetorDialog.vue'
import EnderecoSetorDialog from '@/components/EnderecoSetorDialog.vue'
import VTreeView from '@/components/VTreeView.vue'

export default {
  components: {
    TelefoneSetorDialog,
    EnderecoSetorDialog,
    VTreeView
  },
  data: () => ({    
    setor: {
      setor_pai: null,
      setor_pai_nome: null,
      telefones: [],
      enderecos: []
    },
    carregado: false,
    items: [],
    open: [],
    active: [],
    errors: {}
  }),
  mounted() {
    this.montaArvore()
  },
  methods: {
    async salvar() {
      this.setor.ativo = true
      setorService
        .inserir(this.setor)
        .then(() => {          
          this.errors = {}
          this.setor.enderecos = []
          this.setor.telefones = []
          this.$refs.form.reset()
          this.montaArvore()
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.open = this.setor.itemsOpen
      this.active = this.setor.itemActive
    },
    limpar() {
      this.$refs.form.reset()
      this.open = []
      this.active = []
      this.setor = {
        setor_pai: null,
        setor_pai_nome: null,
        telefones: [],
        enderecos: []
      }
    },
    montaArvore() {
      setorService.getArvore().then(response => {
        this.items = response.data
        this.carregado = true
      })
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
