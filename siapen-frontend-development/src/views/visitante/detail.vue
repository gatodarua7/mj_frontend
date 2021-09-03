<template>
  <v-main>
    <barra-superior
      :titulo="$t('visitante.top.title')"
      :subtitulo="$t('visitante.top.subtitle')"
      :breadcrumbs="$t('visitante.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-card flat>
        <v-card-title />
        <aba-dados-basicos
          v-if="carregado"
          ref="AbaDadosBasicos"
          :visitante="visitante"
          :errors="errors"
          :rules="rules"
          :readonly="true"
        />
      </v-card>
      <v-card flat>
        <v-card-title />
        <aba-documentos
          :object="visitante"
          :readonly="true"
          tipo-pessoa="visitante"
        />
      </v-card>
      <v-card flat>
        <v-card-title>
          Contatos
        </v-card-title>
        <v-card-text>
          <div class="text-subtitle-1 black--text">
            Endereços
          </div>
          <endereco-pessoa-dialog
            :object="visitante"
            :cant-delete="true"
            :readonly="true"
          />
          <div class="text-subtitle-1 black--text">
            Telefones
          </div>
          <telefone-pessoa-dialog
            :object="visitante"
            :readonly="true"
          />
        </v-card-text>
      </v-card>
      <v-card flat>
        <v-card-title />
        <aba-anuencia
          v-if="visitante.id"
          :object="visitante"
          :errors="errors"
          :readonly="true"
        />
      </v-card>
      <v-card flat>
        <v-card-title />
        <aba-recurso
          v-if="visitante.recurso && (visitante.fase=='RECURSO' || visitante.fase=='RECURSO_EM_ANALISE') "
          :object="visitante"
          :readonly="true"
        />
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
import * as visitanteService from '@/services/VisitanteService'
import AbaDadosBasicos from './abas/AbaDadosBasicos.vue'
import AbaDocumentos from './abas/AbaDocumentos.vue'
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import AbaAnuencia from '@/views/visitante/abas/AbaAnuencia.vue'
import AbaRecurso from '@/views/visitante/abas/AbaRecurso.vue'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    AbaDadosBasicos,
    AbaDocumentos,
    AbaAnuencia,
    AbaRecurso
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
    getVisitante(id) {
      visitanteService
        .getId(id)
        .then(res => {
          Object.assign(this.visitante, res.data)
          this.carregado = true
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
