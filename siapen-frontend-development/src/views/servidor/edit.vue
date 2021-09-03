<template>
  <v-main>
    <barra-superior
      :titulo="$t('servidor.top.title')"
      :subtitulo="$t('servidor.top.subtitle')"
      :breadcrumbs="$t('servidor.top.breadcrumbsAlterar')"
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
            :rules="[() => rules.stepForm1]"
            edit-icon="check"
            :complete="completeStep1()"
          >
            Dados Pessoais
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="2"
            editable
            :rules="[() => rules.stepForm2]"
            edit-icon="check"
            :complete="completeStep2()"
          >
            Dados Funcionais
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="3"
            editable
            edit-icon="check"
            :complete="completeStep3()"
          >
            Endereços e Telefones Pessoais
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            step="4"
            editable
            edit-icon="check"
            :complete="completeStep4()"
          >
            Documentos Pessoais
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat>
              <v-card-text>
                <aba-dados-pessoais
                  v-if="!!servidor.id"
                  :servidor="servidor"
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
            <v-card flat>
              <v-card-text>
                <aba-dados-funcionais
                  v-if="!!servidor.id"
                  :servidor="servidor"
                  :errors="errors"
                  :rules="rules"
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
            <v-card flat>
              <v-card-text>
                <endereco-pessoa-dialog
                  v-if="!!servidor.id"
                  :object="servidor"
                />
                <telefone-pessoa-dialog
                  v-if="!!servidor.id"
                  :object="servidor"
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
            <v-card flat>
              <v-card-text>
                <documento-upload
                  v-if="!!servidor.id"
                  :object="servidor"
                  tipo-pessoa="servidor"
                  @update="salvar"
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
                  @click="salvar"
                >
                  Salvar e continuar depois
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
import * as servidorService from '@/services/ServidorService'
import mensagens from '@/shared/mensagens'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import DocumentoUpload from '@/components/DocumentoUpload.vue'
import AbaDadosFuncionais from './abas/AbaDadosFuncionais.vue'
import AbaDadosPessoais from './abas/AbaDadosPessoais.vue'

export default {
  components: {
    TelefonePessoaDialog,
    EnderecoPessoaDialog,
    DocumentoUpload,
    AbaDadosFuncionais,
    AbaDadosPessoais
  },
  data: () => ({
    stepper: null,
    rules: {
      stepForm1: false,
      stepForm2: false,
    },
    servidor: {
      motivo_desligamento: '',
      telefones: [],
      telefones_funcionais: [],
      enderecos: [],
      documentos: []
    },
    errors: {},
  }),
  mounted() {
    let id = this.$route.params.id
    servidorService.getId(id).then(response => {
      this.servidor = response.data
    })
  },
  methods: {
    completeStep1() {
      return !!(this.servidor.nome && this.servidor.cpf)
    },
    completeStep2() {
      return !!(
        this.servidor.cargos &&
        this.servidor.matricula &&
        this.servidor.data_admissao &&
        this.servidor.email_profissional &&
        this.servidor.lotacao_nome
      )
    },
    completeStep3() {
      return !!(
        this.servidor.telefones.length && this.servidor.enderecos.length
      )
    },
    completeStep4() {
      return !!this.servidor.documentos.length
    },
    salvar(next) {
      this.servidor.ativo = true
      this.servidor.cpf =
        this.servidor.cpf && this.servidor.cpf.replace(/[\s+.+-]/g, '')
      !this.servidor.uf_rg && (this.servidor.orgao_expedidor = null)
      servidorService
        .alterar(this.servidor)
        .then(() => {
          next && this.sair()
          servidorService.getId(this.servidor.id).then(response => {
            this.servidor = response.data
            this.$store.dispatch('snackbar/setSnackbar', {
              text: `${mensagens('MSG1')}`,
              color: 'success',
              timeout: 3000
            })
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
  }
}
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
