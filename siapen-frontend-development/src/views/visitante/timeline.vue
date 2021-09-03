<template>
  <v-main>
    <barra-superior
      titulo="Cadastro do Visitante"
      subtitulo="Linha do Tempo"
      :breadcrumbs="breadcrumbs"
    />
    <v-container fluid>
      <v-card flat>
        <v-card-text>
          <v-timeline>
            <v-timeline-item
              v-for="item, i in items"
              :key="item.id"
              large
            >
              <template v-slot:icon>
                <div class="white--text">
                  {{ total-i }}
                </div>
              </template>
              <v-card class="elevation-2">
                <v-card-text>
                  <div class="py-2">
                    {{ formatDateTimeWithoutSeconds(item.created_at) }} - {{ item.usuario }}
                  </div>
                  <v-alert
                    :color="getFase(item.fase).cor"
                    dense
                    outlined
                    border="left"
                    icon="mdi-alert-outline"
                  >
                    {{ getFase(item.fase).nome }}
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
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
import * as visitanteMovimentacaoService from '@/services/VisitanteMovimentacaoService'
import visitanteMixin from '@/mixins/visitante'

export default {
  mixins: [visitanteMixin],
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        to: '/',
        exact: true
      },
      {
        text: 'Assistência Social',
        to: '/visitante/assistencia',
        exact: true
      },
      {
        text: 'Linha do tempo',
        disabled: true
      }
    ],
    items: [],
    total: 0
  }),
  mounted() {    
    let id = this.$route.params.id
    this.getDataFromApi(id)
  },
  methods: {
    getDataFromApi(id) {
      visitanteMovimentacaoService
        .getMovimentacoes(id)
        .then(response => {
          this.items = response.data.results
          this.total = response.data.count
        })
        .catch(error => {
          this.displayErrors(error)
        })
    }
  }
}
</script>
