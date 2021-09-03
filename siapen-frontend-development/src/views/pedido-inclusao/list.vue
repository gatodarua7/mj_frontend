<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsPrincipal')"
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
            <v-icon>add</v-icon>
            <span>Incluir</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          {{ $t('pedido_inclusao.top.subtitle') }}
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
                  v-if="item.fase_pedido.fase=='RECEBIDO' || item.fase_pedido.fase=='ULTIMA_FASE'"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      :color="item.fase_pedido.fase=='ULTIMA_FASE' ? 'light-green' : 'yellow accent-4'"
                      @click="item.fase_pedido.fase=='ULTIMA_FASE' ? null : concluirItem(item)"
                      v-on="on"
                    >
                      <v-icon>{{ item.fase_pedido.fase=='ULTIMA_FASE' ? 'lock' : 'lock_open' }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ item.fase_pedido.fase=='ULTIMA_FASE' ? 'Pedido finalizado' : 'Pedido não finalizado' }}</span>
                </v-tooltip>
                <v-tooltip
                  v-if="item.fase_pedido.fase_inicial || item.fase_pedido.fase=='ARQUIVAR' || item.fase_pedido.fase=='DESARQUIVAR' || item.fase_pedido.fase=='REMETIDO' || !item.fase_pedido.fase"
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
                      @click="timelineItem(item)"
                      v-on="on"
                    >
                      <v-icon>timeline</v-icon>
                    </v-btn>
                  </template>
                  <span>Linha do Tempo</span>
                </v-tooltip>
                <v-tooltip
                  v-if="!item.fase_pedido.fase_inicial && item.fase_pedido.fase!='CGIN'"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="viewCginItem(item)"
                      v-on="on"
                    >
                      <v-icon>mdi-owl</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar Análise da CGIN</span>
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
                  v-if="item.fase_pedido.fase_inicial || item.fase_pedido.fase=='ARQUIVAR' || item.fase_pedido.fase=='DESARQUIVAR'"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="editarItem(item)"
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
                <v-tooltip
                  v-if="item.fase_pedido.fase_inicial"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="excluirItem(item)"
                      v-on="on"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
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
        <concluir-pedido-dialog ref="concluirPedido" />
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import PromptDialog from '@/components/PromptDialog.vue'
import MovimentarFasesDialog from './components/MovimentarFasesDialog.vue'
import ConcluirPedidoDialog from './components/ConcluirPedidoDialog.vue'

export default {
  components: { PromptDialog, MovimentarFasesDialog, ConcluirPedidoDialog },
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
    limpar() {
      this.$refs.form.reset()
      this.getDataFromApi()
    },
    cadastrar() {
      this.$router.push('/pedido-inclusao/pessoas')
    },
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      pedidoInclusaoService
        .search(sortBy, sortDesc, page, itemsPerPage, this.search)
        .then(response => {
          let data = response.data
          this.items = data.results
          this.totalItems = data.count
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
    async concluirItem(item){
      const res = await this.$refs.concluirPedido.open(item)
      if (res) {
        this.getDataFromApi()
      }
    },
    async movimentarItem(item) {
      const res = await this.$refs.fases.open(item)
      if (res) {
        this.getDataFromApi()
      }
    },
    visualizarItem(item) {
      this.$router.push(`/pedido-inclusao/detalhes/${item.id}`)
    },
    editarItem(item) {
      this.$router.push(`/pedido-inclusao/cadastro/${item.id}`)
    },
    timelineItem(item) {
      this.$router.push(`/pedido-inclusao/timeline/${item.id}`)
    },
    viewCginItem(item) {
      this.$router.push(`/pedido-inclusao/cgin/detalhes/${item.id}`)
    },
    async excluirItem(item) {
      const res = await this.$refs.prompt.open(
        'Excluir registro',
        'Você tem certeza que deseja excluir esse registro ?'
      )
      if (res) {
        item.excluido = true
        item.motivo_exclusao = res
        pedidoInclusaoService
          .alterar(item)
          .then(()=> {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: 'Registro excluído com sucesso',
              color: 'success',
              timeout: 3000
            })
            this.getDataFromApi()
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    }
  }
}
</script>
