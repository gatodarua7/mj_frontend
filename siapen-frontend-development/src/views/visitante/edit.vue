<template>
  <v-main>
    <barra-superior
      :titulo="$t('visitante.top.title')"
      :subtitulo="$t('visitante.top.subtitle')"
      :breadcrumbs="$t('visitante.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-stepper
        v-model="stepper"
        non-linear
        alt-labels
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
          <v-divider 
            v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') "
          />
          <v-stepper-step
            v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') "
            step="5"
            editable
            edit-icon="check"
            :complete="!!visitante.recurso"
          >
            Recurso
            <div class="text-center">
              <v-icon color="red">
                report_problem
              </v-icon>
            </div>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <aba-dados-basicos
                v-if="carregado"
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
                <endereco-pessoa-dialog
                  :object="visitante"
                  :cant-delete="visitante.fase && visitante.fase!='INICIADO'"
                />
                <div class="text-subtitle-1 black--text">
                  Telefones
                </div>
                <telefone-pessoa-dialog
                  :object="visitante"
                  :cant-delete="visitante.fase && visitante.fase!='INICIADO'"
                />
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
                v-if="visitante.id"
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
                  @click="(visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') ) ? (stepper = 5) : salvar()"
                >
                  {{ (visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') ) ? 'Salvar e continuar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="5">
            <v-card>
              <v-card-title />
              <aba-recurso
                v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') "
                ref="AbaRecurso"
                :object="visitante"
                @atualizarVisitante="salvarVisitante"
              />
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
import AbaAnuencia from '@/views/visitante/abas/AbaAnuencia.vue'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import AbaRecurso from './abas/AbaRecurso.vue'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    AbaDadosBasicos,
    AbaAnuencia,
    AbaRecurso,
    AbaDocumentos
  },
  data: () => ({
    carregado: false,
    stepper: null,
    visitante: {
      nome_pai: null,
      nome_mae: null,
      pai_nao_declarado: false,
      mae_nao_declarado: false,
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
  mounted() {    
    let id = this.$route.params.id
    this.getVisitante(id)
  },
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
    getVisitante(id) {
      visitanteService
        .getId(id)
        .then(res => {
          Object.assign(this.visitante, res.data)
          this.carregado = true
        })
    },
    salvar() {
      (this.visitante.recurso && this.visitante.fase=='RECURSO') ? this.$refs.AbaRecurso.salvar() : this.salvarVisitante()
    },
    async salvarVisitante() {
      this.visitante.cpf =
        this.visitante.cpf && this.visitante.cpf.replace(/[\s+.+-]/g, '')
      visitanteService
        .alterar(this.visitante)
        .then(() => {
          this.sair()
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

<style>
.v-stepper__header {
  box-shadow: none;
}
.v-application--is-ltr .v-stepper__label {
  text-align: center;
  display: block;
}
</style>
