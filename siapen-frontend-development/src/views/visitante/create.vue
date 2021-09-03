<template>
  <v-main>
    <barra-superior
      :titulo="$t('visitante.top.title')"
      :subtitulo="$t('visitante.top.subtitle')"
      :breadcrumbs="$t('visitante.top.breadcrumbsCadastrar')"
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
            Documentos Pessoais
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
            :complete="completeStep4()"
          >
            Anuência
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <aba-dados-basicos
                ref="AbaDadosBasicos"
                :visitante="visitante"
                :errors="errors"
                :rules="rules"
                @desvincularFoto="salvar"
              />
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
                <aba-documentos
                  :object="visitante" 
                  tipo-pessoa="visitante"
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
              <v-card-title>Contatos</v-card-title>
              <v-card-text>
                <div class="text-subtitle-1 black--text">
                  Endereços
                </div>
                <endereco-pessoa-dialog :object="visitante" />
                <div class="text-subtitle-1 black--text">
                  Telefones
                </div>
                <telefone-pessoa-dialog :object="visitante" />
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
              <v-card-title>Anuência</v-card-title>
              <aba-anuencia
                :object="visitante"
                :errors="errors"
              />
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
                  @click="salvar"
                >
                  Salvar e continuar depois
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="salvar"
                >
                  Salvar
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
import * as visitanteService from '@/services/VisitanteService'
import AbaDadosBasicos from './abas/AbaDadosBasicos.vue'
import AbaDocumentos from './abas/AbaDocumentos.vue'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import AbaAnuencia from '@/views/visitante/abas/AbaAnuencia.vue'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    AbaDadosBasicos,
    AbaDocumentos,
    AbaAnuencia
  },
  data: () => ({
    stepper: null,
    visitante: {
      rgs: [],
      documentos: [],
      telefones: [],
      enderecos: [],
      anuencias: []
    },
    errors: {},
    rules: {
      stepForm1: false,
      stepForm2: true,
    }
  }),
  methods: {
    completeStep1() {
      return !!(this.visitante.nome && this.visitante.data_nascimento && this.visitante.numero_sei)
    },
    completeStep2() {
      return !!(this.visitante.documentos.length)
    },
    completeStep3() {
      return !!(this.visitante.telefones.length && this.visitante.enderecos.length)
    },
    completeStep4() {
      return !!(this.visitante.anuencias.length)
    },
    limparDadosBasicos() {
      this.$refs.AbaDadosBasicos.limpar()
    },
    async salvar(next) {
      this.visitante.ativo = true
      this.visitante.cpf =
        this.visitante.cpf && this.visitante.cpf.replace(/[\s+.+-]/g, '')
      visitanteService
        .inserir(this.visitante)
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
}
</style>
