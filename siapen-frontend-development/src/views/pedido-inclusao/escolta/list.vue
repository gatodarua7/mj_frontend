<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      subtitulo="Aguardando Escolta"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsPrincipalEscolta')"
    />
    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          sm="12"
          class="d-flex flex-row-reverse"
        >
          <v-btn
            color="blue darken-2"
            class="mb-2"
            text
            @click="cadastrar()"
          >
            <v-icon>event</v-icon>
            <span>Agendar escolta</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          Aguardando Escoltas
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
            v-model="pedidosSelecionados"
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
            <template v-slot:[`item.data_movimentacao`]="{ item }">
              {{ formatDateTimeToDate(item.data_movimentacao) }}
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
                      @click="visualizarItem(item)"
                      v-on="on"
                    >
                      <v-icon>visibility</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar</span>
                </v-tooltip>
              </v-toolbar-items>
            </template>            
            <template v-slot:expanded-item="{ item }">
              <td>
                <strong>CPF</strong><br>{{ convertCPF(item.cpf) }}
              </td>
              <td>
                <strong>Nome da Mãe</strong><br>{{ item.nome_mae }}
              </td>
              <td colspan="2">
                <strong>Penitenciária Indicada</strong><br>{{ item.unidade_nome }}
              </td>
              <td colspan="2">
                <strong>Nº SEI - Pedido de Inclusão</strong><br>{{ item.numero_sei }}
              </td>
              <td>
                <strong>Data do SEI - Pedido de Inclusão</strong><br>{{ formatDate(item.data_pedido_sei) }}
              </td>
            </template>
            <template
              v-slot:no-data
            >
              {{
                search
                  ? "Nenhum resultado foi encontrado para sua pesquisa"
                  : "Ainda não há registro cadastrado"
              }}
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
      { text: 'Nome', value: 'nome' },
      { text: 'Tipo Escolta', value: 'tipo_escolta' },
      { text: 'Solicitante da Vaga', value: 'estado_solicitante_nome' },
      { text: 'Deferimento do Pedido de Inclusão', value: 'data_movimentacao' },
      { text: 'Emergencial', value: 'tipo_inclusao' },
      { text: 'Ações', value: 'action', sortable: false },
      { text: '', value: 'data-table-expand', sortable: false }
    ],
    items: [],    
    search: null,
    options: {},
    totalItems: 0,
    pedidosSelecionados: []
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
  methods: {
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      pedidoInclusaoService
        .searchEscolta(sortBy, sortDesc, page, itemsPerPage, this.search)
        .then(response => {
          let data = response.data
          this.items = data.results
          this.totalItems = data.count
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
    visualizarItem(item) {
      this.$router.push(`/pedido-inclusao/cgin/detalhes/${item.id}`)
    },
    cadastrar() {
      const list = this.pedidosSelecionados.map(item=>item.id)
      this.$router.push(`/escolta/cadastro/pedidos/${list}`)
    }
  }
}
</script>
