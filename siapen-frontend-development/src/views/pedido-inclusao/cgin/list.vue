<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      subtitulo="Aguardando Análise"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsPrincipalCgin')"
    />
    <v-container fluid>
      <v-card>
        <v-card-title>
          Aguardando Análise
          <v-chip
            class="ml-2"
            color="grey lighten-1"
            text-color="white"
            small
          >
            {{ totalItems }}
          </v-chip>
          <v-spacer />
          <v-text-field
            v-model="search"
            type="text"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            @click:append="getDataFromApi"
            @keyup.enter="getDataFromApi"
          />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :must-sort="true"
            item-key="id"            
            show-expand
            single-expand
            :footer-props="{
              'items-per-page-text': 'Registros por página:',
              'items-per-page-options': [5, 10, 15]
            }"
          >
            <template v-slot:[`item.imagem`]="{ item }">
              <v-avatar
                v-if="item.imagem"
                class="my-2"
              >
                <v-img :src="item.imagem" />
              </v-avatar>
              <v-avatar
                v-else
                class="my-2"
              >
                <v-icon
                  color="grey darken-4"
                  size="64"
                >
                  account_circle
                </v-icon>
              </v-avatar>
            </template>
            <template v-slot:[`item.tipo_inclusao`]="{ item }">
              <v-tooltip
                v-if="item.tipo_inclusao == 'EMERGENCIAL'"
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="ma-2"
                    color="red darken-2"
                    text-color="white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    E
                  </v-chip>
                </template>
                <span>Emergencial</span>
              </v-tooltip>
              <v-tooltip
                v-else
                top
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="ma-2"
                    color="blue darken-2"
                    text-color="white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    D
                  </v-chip>
                </template>
                <span>Definitivo</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.fase_pedido`]="{ item }">
              <v-alert
                dense
                outlined
                border="left"
                :color="item.fase_pedido.cor"
                class="my-2 text-center"
              >
                {{ item.fase_pedido.nome }}
              </v-alert>
            </template>
            <template
              v-slot:[`item.created_at`]="{ item }"
            >
              {{ formatDateTime(item.created_at) }}
            </template>
            <template
              v-slot:[`item.data_movimentacao`]="{ item }"
            >
              {{ formatDateTime(item.data_movimentacao) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-toolbar-items>
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="movimentarItem(item)"
                      v-on="on"
                    >
                      <v-icon>sync_alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Movimentar</span>
                </v-tooltip>
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="visualizarItem(item)"
                      v-on="on"
                    >
                      <v-icon>visibility</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar</span>
                </v-tooltip>
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="item.analise_cgin ? editarAnalise(item) : manifestarItem(item)"
                      v-on="on"
                    >
                      <v-icon>fact_check</v-icon>
                    </v-btn>
                  </template>
                  <span>Manifestar</span>
                </v-tooltip>
              </v-toolbar-items>
            </template>            
            <template v-slot:expanded-item="{ item }">
              <td colspan="2">
                <strong>CPF</strong> {{ item.cpf }}
              </td>
              <td colspan="2">
                <strong>Nome da Mãe</strong> {{ item.nome_mae }}
              </td>
              <td colspan="2">
                <strong>Nº SEI</strong> {{ item.numero_sei }}
              </td>
              <td colspan="2">
                <strong>Data do SEI</strong> {{ formatDate(item.data_pedido_sei) }}
              </td>
            </template>
          </v-data-table>
        </v-card-text>
        <prompt-dialog ref="prompt" />
        <movimentar-fases-dialog ref="fases" />
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import PromptDialog from '@/components/PromptDialog.vue'
import MovimentarFasesDialog from '../components/MovimentarFasesDialog.vue'

export default {
  components: { PromptDialog, MovimentarFasesDialog },
  data: () => ({
    headers: [
      { text: '', value: 'imagem' },
      { text: 'Data de Cadastro do Pedido', value: 'created_at' },
      { text: 'Preso', value: 'nome' },
      { text: 'Solicitante', value: 'estado_solicitante_nome' },
      { text: 'Emergencial', value: 'tipo_inclusao' },
      { text: 'Data da Movimentação da Fase', value: 'data_movimentacao' },
      { text: 'Fase', value: 'fase_pedido' },
      { text: 'Ações', value: 'action', sortable: false },
      { text: '', value: 'data-table-expand', sortable: false }
    ],
    items: [],    
    search: null,
    options: {},
    totalItems: 0
  }),
  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    search(val){
      !val && this.getDataFromApi()
    }
  },
  mounted() {
    this.getDataFromApi()
  },
  methods: {
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      pedidoInclusaoService
        .searchCgin(sortBy, sortDesc, page, itemsPerPage, this.search)
        .then(response => {
          let data = response.data
          this.items = data.results
          this.totalItems = data.count
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
    async movimentarItem(item) {
      const res = await this.$refs.fases.open(item)
      if (res) {
        this.getDataFromApi()
      }
    },
    visualizarItem(item) {
      this.$router.push(`/pedido-inclusao/cgin/detalhes/${item.id}`)
    },
    editarAnalise(item) {
      this.$router.push(`/pedido-inclusao/cgin/analise/editar/${item.id}/${item.analise_cgin}`)
    },
    manifestarItem(item) {
      this.$router.push(`/pedido-inclusao/cgin/analise/${item.id}`)
    }
  }
}
</script>
