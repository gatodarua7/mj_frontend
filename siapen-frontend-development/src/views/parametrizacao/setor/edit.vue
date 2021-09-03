<template>
  <v-main>
    <barra-superior
      :titulo="$t('setor.top.title')"
      :subtitulo="$t('setor.top.subtitle')"
      :breadcrumbs="$t('setor.top.breadcrumbsAlterar')"
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
              <v-treeview
                v-if="carregado"
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
import TelefoneSetorDialog from '@/components/TelefoneSetorDialog.vue'
import EnderecoSetorDialog from '@/components/EnderecoSetorDialog.vue'
import * as setorService from '@/services/SetorService'
import mensagens from '@/shared/mensagens'

export default {
  components: { TelefoneSetorDialog, EnderecoSetorDialog },
  data: () => ({
    carregado: false,
    items: [],
    setor: {
      sistema: null,
      sistema_nome: null,
      unidade: null,
      unidade_nome: null,
      setor_pai: null,
      setor_pai_nome: null,
      telefones: [],
      enderecos: []
    },
    errors: {}
  }),
  mounted() {
    this.montaArvore()
  },
  methods: {
    limpar() {
      this.$refs.form.reset()
      Object.assign(this.setor, {
        telefones: [],
        enderecos: []
      })
    },
    salvar() {
      setorService
        .alterar(this.setor)
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
    montaArvore() {
      let id = this.$route.params.id
      setorService.getId(id).then(response => {
        this.setor = response.data
      })
      setorService.getArvoreById(id).then(response => {
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
