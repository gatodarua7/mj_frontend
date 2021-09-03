<template>
  <v-main>
    <barra-superior
      :titulo="$t('interno.top.title')"
      :subtitulo="$t('interno.top.subtitle')"
      :breadcrumbs="$t('interno.top.breadcrumbsCadastrar')"
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
            Dados Básicos
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="2"
            editable
            edit-icon="check"
            :complete="completeStep2()"
          >
            Documentos
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="3"
            editable
            edit-icon="check"
            :complete="completeStep3()"
          >
            Contatos
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="4"
            editable
            edit-icon="check"
            :rules="[() => rules.stepForm4]"
            :complete="completeStep4()"
          >
            Características Físicas
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="5"
            editable
            edit-icon="check"
            :complete="completeStep5()"
          >
            Sinais Particulares
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-text>
                <aba-1
                  ref="aba1"
                  :interno="interno"
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
                <documento-upload
                  :object="interno"
                  tipo-pessoa="interno"
                />
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
                  Salvar e continuar depois
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 3"
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-card>
              <v-card-text>
                <contato-dialog :object="interno" />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 2"
                >
                  Voltar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="limparAba3()"
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
                  @click="stepper = 4"
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="4">
            <v-card>
              <v-card-text>
                <aba-4
                  :interno="interno"
                  :errors="errors"
                  :rules="rules"
                />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 3"
                >
                  Voltar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="limparAba4()"
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
                  @click="stepper = 5"
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="5">
            <v-card>
              <v-card-text>
                <aba-5
                  ref="aba5"
                  :interno="interno"
                  :errors="errors"
                />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="stepper = 4"
                >
                  Voltar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="limparAba5()"
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
import DocumentoUpload from '@/components/DocumentoUpload.vue'
import ContatoDialog from '@/components/ContatoDialog.vue'
import Aba1 from './abas/aba1.vue'
import Aba4 from './abas/aba4.vue'
import Aba5 from './abas/aba5.vue'
import internoMixin from '@/mixins/interno'

export default {
  components: {
    DocumentoUpload,
    ContatoDialog,
    Aba1,
    Aba4,
    Aba5
  },
  mixins: [internoMixin],
  data: () => ({
    stepper: null,
    interno: {
      documentos: [],
      rgs: [],
      contatos: [],
      sinais: []
    },
    errors: {},
    rules: {
      stepForm1: false,
      stepForm4: true,
    }
  }),
  methods: {
    async salvar(next) {
      this.interno.ativo = true
      this.interno.cpf =
        this.interno.cpf && this.interno.cpf.replace(/[\s+.+-]/g, '')
      const response = this.$api.create({resource: this.$endpoints.INTERNO, data: this.interno})
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
          this.checkValidStep4()
        })
    }
  }
}
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
