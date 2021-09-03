<template>
  <v-main>
    <barra-superior
      :titulo="$t('servidor.top.title')"
      :subtitulo="$t('servidor.top.subtitle')"
      :breadcrumbs="$t('servidor.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-card flat>
        <v-card-title>
          Dados do Servidor
        </v-card-title>
        <v-card-text>
          <aba-dados-pessoais
            v-if="!!servidor.id"
            :servidor="servidor"
            :errors="errors"
            :rules="rules"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Dados Funcionais
        </v-card-title>
        <v-card-text>
          <aba-dados-funcionais
            v-if="!!servidor.id"
            :servidor="servidor"
            :errors="errors"
            :rules="rules"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Telefones Funcionais
        </v-card-title>
        <v-card-text>
          <telefone-funcional-pessoa-dialog
            v-if="!!servidor.id"
            :object="servidor"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Telefones Pessoais
        </v-card-title>
        <v-card-text>
          <telefone-pessoa-dialog
            v-if="!!servidor.id"
            :object="servidor"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Endereços
        </v-card-title>
        <v-card-text>
          <endereco-pessoa-dialog
            v-if="!!servidor.id"
            :object="servidor"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Documentos
        </v-card-title>
        <v-card-text>
          <documento-upload
            v-if="!!servidor.id"
            :object="servidor"
            :readonly="true"
            tipo-pessoa="servidor"
          />
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
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as servidorService from '@/services/ServidorService'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import TelefoneFuncionalPessoaDialog from '@/components/TelefoneFuncionalPessoaDialog.vue'
import DocumentoUpload from '@/components/DocumentoUpload.vue'
import AbaDadosFuncionais from './abas/AbaDadosFuncionais.vue'
import AbaDadosPessoais from './abas/AbaDadosPessoais.vue'

export default {
  components: {
    TelefonePessoaDialog,
    TelefoneFuncionalPessoaDialog,
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
  }
}
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
