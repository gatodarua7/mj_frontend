<template>
  <v-main>
    <barra-superior
      :titulo="$t('advogado.top.title')"
      :subtitulo="$t('advogado.top.subtitle')"
      :breadcrumbs="$t('advogado.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-card>
        <v-card-text>
          <aba-1
            v-if="carregado"
            ref="aba1"
            :advogado="advogado"
            :errors="errors"
            :rules="rules"
            :readonly="true"
          />
          <endereco-pessoa-dialog
            v-if="carregado"
            :object="advogado"
            :readonly="true"
            :cant-delete="true"
          />
          <telefone-pessoa-dialog
            v-if="carregado"
            :object="advogado"
            :readonly="true"
            :cant-delete="true"
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
import EnderecoPessoaDialog from '@/components/EnderecoPessoaDialog.vue'
import TelefonePessoaDialog from '@/components/TelefonePessoaDialog.vue'
import Aba1 from './abas/aba1.vue'

export default {
  components: {
    EnderecoPessoaDialog,
    TelefonePessoaDialog,
    Aba1
  },
  data: () => ({
    carregado: false,
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
  mounted() {    
    let id = this.$route.params.id
    this.getAdvogado(id)
  },
  methods: {
    async getAdvogado(id) {
      const response = await this.$api.get({resource: this.$endpoints.ADVOGADO, id: id})
      Object.assign(this.advogado, response.data)
      this.carregado = true
    }
  }
}
</script>
