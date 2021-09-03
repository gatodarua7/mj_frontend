<template>
  <v-main>
    <barra-superior
      :titulo="$t('advogado.top.title')"
      :subtitulo="$t('advogado.top.subtitle')"
      :breadcrumbs="$t('advogado.top.breadcrumbsCadastrar')"
    />
    <v-container fluid>
      <v-stepper
        v-model="stepper"
        non-linear
      >
        <v-stepper-header>
          <v-stepper-step
            step="1"
            editable
            edit-icon="check"
            :rules="[() => rules.stepForm1]"
            :complete="completeStep1()"
          >
            Dados Gerais
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="2"
            editable
            edit-icon="check"
            :complete="completeStep2()"
          >
            Telefones / Endereços
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-text>
                <aba-1
                  ref="aba1"
                  :advogado="advogado"
                  :errors="errors"
                  :rules="rules"
                  @desvincularFoto="salvar"
                />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="sair()"
                >
                  Voltar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="limparAba1()"
                >
                  Limpar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="salvar"
                >
                  Salvar e continuar depois
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 2"
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card>
              <v-card-text>
                <endereco-pessoa-dialog :object="advogado" />
                <telefone-pessoa-dialog :object="advogado" />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 1"
                >
                  Voltar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="limparAba2()"
                >
                  Limpar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="salvar"
                >
                  Finalizar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </v-main>
</template>

<script>
import mensagens from '@/shared/mensagens'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import Aba1 from './abas/aba1.vue'
import advogadoMixin from '@/mixins/advogado'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    Aba1
  },
  mixins: [advogadoMixin],
  data: () => ({
    stepper: null,
    advogado: {
      rgs: [],
      oabs: [],
      telefones: [],
      enderecos: []
    },
    errors: {},
    rules: {
      stepForm1: false,
      stepForm2: true,
    }
  }),
  methods: {
    async salvar(next) {
      this.advogado.ativo = true
      this.advogado.cpf =
        this.advogado.cpf && this.advogado.cpf.replace(/[\s+.+-]/g, '')
      const response = this.$api.create({resource: this.$endpoints.ADVOGADO, data: this.advogado})
      response
        .then(() => {
          next && this.sair()
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

<style scoped>
.v-stepper__header {
  box-shadow: none;
  justify-content: left!important;
  height: 72px;
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
}
.v-divider {
  flex: 1;
  max-width: 10%;
}
</style>
