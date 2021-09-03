<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsTimeline')"
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
                    {{ formatDateTime(item.created_at) }} - {{ item.usuario }}
                  </div>
                  <v-alert
                    :color="item.fase_cor"
                    dense
                    outlined
                    border="left"
                  >
                    {{ item.fase_nome }}
                  </v-alert>

                  <div v-if="item.motivo">
                    Motivo: 
                    <v-menu
                      :close-on-content-click="false"
                      offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          text
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon
                            color="primary"
                            dark
                          >
                            mdi-information
                          </v-icon>
                        </v-btn>
                      </template>

                      <v-card>
                        <v-card-text>
                          {{ item.motivo }}
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </div>
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
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'

export default {
  data: () => ({
    items: [],
    total: 0
  }),
  mounted() {    
    let id = this.$route.params.id
    this.getDataFromApi(id)
  },
  methods: {
    getDataFromApi(id) {
      pedidoInclusaoService
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
