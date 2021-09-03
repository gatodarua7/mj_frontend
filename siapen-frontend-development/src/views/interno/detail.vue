<template>
  <v-main>
    <barra-superior
      :titulo="$t('interno.top.title')"
      :subtitulo="$t('interno.top.subtitle')"
      :breadcrumbs="$t('interno.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-card flat>
        <v-card-title>
          Dados Básicos
        </v-card-title>
        <v-card-text>
          <aba-1
            v-if="carregado"
            :interno="interno"
            :errors="errors"
            :rules="rules"
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
            v-if="carregado"
            :object="interno"
            :readonly="true"
            tipo-pessoa="interno"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Contatos
        </v-card-title>
        <v-card-text>
          <contato-dialog
            v-if="carregado"
            :object="interno"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Características Físicas
        </v-card-title>
        <v-card-text>
          <aba-4
            v-if="carregado"
            :interno="interno"
            :errors="errors"
            :rules="rules"
            :readonly="true"
          />
        </v-card-text>
      </v-card>

      <v-card flat>
        <v-card-title>
          Sinais Particulares
        </v-card-title>
        <v-card-text>
          <aba-5
            v-if="carregado"
            :interno="interno"
            :errors="errors"
            :readonly="true"
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
import Aba1 from './abas/aba1.vue'
import Aba4 from './abas/aba4.vue'
import Aba5 from './abas/aba5.vue'
import DocumentoUpload from '@/components/DocumentoUpload.vue'
import ContatoDialog from '@/components/ContatoDialog.vue'

export default {
  components: {
    Aba1,
    Aba4,
    Aba5,
    DocumentoUpload,
    ContatoDialog
  },
  data: () => ({
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
    },
    carregado: false
  }),
  async beforeMount() {
    const response = await this.$api.get({resource: this.$endpoints.INTERNO, id: this.$route.params.id})
    this.interno = response.data
    this.carregado = true
  }
}
</script>
