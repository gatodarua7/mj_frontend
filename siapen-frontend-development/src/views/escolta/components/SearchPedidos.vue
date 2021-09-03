<template>
  <v-card flat>
    <v-card-title v-if="!readonly">
      Agendar escolta de inclusão
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-if="!readonly"
          cols="12"
          md="5"
          sm="12"
        >
          <v-combobox
            v-model="pedidoSelecionado"
            prepend-icon="group_add"
            :items="pedidosAguardandoEscolta"
            :search-input.sync="search"
            clearable
            item-text="nome"
            item-value="id"
            :filter="checkResult"
            return-object
            label="Adicionar preso"
            :disabled="readonly"
            @change="adicionaPedido"
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                v-if="item.thumbnail"
                class="my-2"
              >
                <v-img :src="item.thumbnail" />
              </v-list-item-avatar>
              <v-list-item-avatar
                v-else
                class="my-2"
              >
                <v-icon
                  color="grey darken-4"
                  size="64"
                >
                  account_circle
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.nome" />
                <v-list-item-subtitle v-text="item.estado_solicitante_nome" />
              </v-list-item-content>
            </template>
            <template
              v-slot:no-data
            >
              <div class="px-4 py-2">
                Nenhum preso encontrado
              </div>
            </template>
          </v-combobox>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <div class="black--text text-subtitle-1">
            Preso(s) vinculado(s) a escolta
          </div>
          <v-data-table
            :headers="headers"
            :items="object.pedidos_inclusao"
            item-key="id"
            :footer-props="{
              'items-per-page-text': 'Registros por página:',
              'items-per-page-options': [5, 10, 15]
            }"
          >
            <template v-slot:[`item.foto`]="{ item }">
              <v-avatar
                v-if="item.foto"
                class="my-2"
              >
                <v-img :src="item.foto" />
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
            <template v-slot:[`item.action`]="{ item }">
              <v-toolbar-items>
                <v-tooltip
                  v-if="!readonly"
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="desvincularPedido(item)"
                      v-on="on"
                    >
                      <v-icon>link_off</v-icon>
                    </v-btn>
                  </template>
                  <span>Desvincular</span>
                </v-tooltip>
              </v-toolbar-items>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import * as escoltaService from '@/services/EscoltaService'

export default {
  props: {
    object: Object,
    update: Boolean,
    readonly: Boolean
  },
  data: () => ({
    headers: [
      { text: '', value: 'foto' },
      { text: 'Preso', value: 'nome' },
      { text: 'CPF', value: 'cpf' },
      { text: 'Penitenciária Destino', value: 'unidade_nome' },
      { text: 'Solicitante da Vaga', value: 'estado_solicitante_nome' },
      { text: 'Emergencial', value: 'tipo_inclusao' },
      { text: 'Ações', value: 'action', sortable: false },
      { text: '', value: 'data-table-expand', sortable: false }
    ],
    options: {},
    pedidoSelecionado: null,
    pedidosAguardandoEscolta: [],
    search: null
  }),
  watch: {
    search(val) {
      if(val && val.length >= 3){
        this.getAllEscolta(val)
      }
      if(!val) {
        this.getAllEscolta(null)
      }
    }
  },
  async created() {
    !this.update && this.carregarPedidos()
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.getAllEscolta(null)
  },
  methods: {
    getAllEscolta(val) {
      pedidoInclusaoService
        .searchAllEscolta(val, this.object.pedidos_inclusao)
        .then(res => {
          this.pedidosAguardandoEscolta = res.data.results
        })
    },
    checkResult(item, queryText) {
      return (item.nome && item.nome.toLowerCase().includes(queryText.toLowerCase()) || item.cpf && item.cpf.toLowerCase().includes(queryText.toLowerCase()) || item.unidade_nome && item.unidade_nome.toLowerCase().includes(queryText.toLowerCase()) || item.estado_solicitante_nome && item.estado_solicitante_nome.toLowerCase().includes(queryText.toLowerCase()))
    },
    async carregarPedidos() {
      await new Promise(resolve => setTimeout(resolve, 500))
      escoltaService
        .carregarPedidos(this.object.pedidos_inclusao)
        .then(res=>{
          this.object.pedidos_inclusao = res.data.results
        })
    },
    async adicionaPedido() {
      this.object.pedidos_inclusao.push(this.pedidoSelecionado)
      this.carregarPedidos()
      this.getAllEscolta(null)
      await new Promise(resolve => setTimeout(resolve, 500))
      this.pedidoSelecionado = null
    },
    desvincularPedido(item) {
      if (this.object.pedidos_inclusao.length <= 1){
        this.$store.dispatch('snackbar/setSnackbar', {
          text: 'É preciso ter ao menos um preso vinculado a escolta',
          color: 'error',
          timeout: 3000
        })
      } else {
        const index = this.object.pedidos_inclusao.indexOf(item)
        this.object.pedidos_inclusao.splice(index, 1)
        this.carregarPedidos()
        this.getAllEscolta(null)
        this.$emit('desvincularPedido')
      }
    }
  }
}
</script>