<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsPessoas')"
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
        <v-card-text>
          <v-form ref="form">
            <v-card
              flat
              class="mb-2"
            >
              <v-card-text>                
                <div class="my-2">
                  Verfique se já existe uma pessoa cadastrada
                </div>
                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="search.cpf"
                      label="CPF"
                      @keyup.enter="getDataFromApi"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="search.nome"
                      label="Nome"
                      @keyup.enter="getDataFromApi"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="search.nome_mae"
                      label="Nome da Mãe"
                      @keyup.enter="getDataFromApi"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="getDataFromApi"
                >
                  Pesquisar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="limpar"
                >
                  Limpar
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="sair"
                >
                  Voltar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :must-sort="true"
            item-key="id"
            :footer-props="{
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
            <template
              v-slot:[`item.data_nascimento`]="{ item }"
            >
              {{ formatDate(item.data_nascimento) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-tooltip top>
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
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    @click="adicionarItem(item)"
                    v-on="on"
                  >
                    <v-icon>person_add</v-icon>
                  </v-btn>
                </template>
                <span>Adicionar pessoa</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'

export default {
  data: () => ({
    headers: [
      { text: '', value: 'foto' },
      { text: 'Tipo Pessoa', value: 'tipo' },
      { text: 'Nome', value: 'nome' },
      { text: 'CPF', value: 'cpf' },
      { text: 'Nome da Mãe', value: 'nome_mae' },
      { text: 'Data de Nascimento', value: 'data_nascimento' },
      { text: 'Naturalidade', value: 'naturalidade' },
      { text: 'Ações', value: 'action', sortable: false },
    ],
    items: [],    
    search: {},
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
      this.$router.push('/pedido-inclusao/cadastro')
    },
    getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      pedidoInclusaoService
        .searchPessoa(sortBy, sortDesc, page, itemsPerPage, this.search)
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
      switch (item.tipo) {
        case 'INTERNO':
          this.$router.push(`/interno/cadastro/detalhes/${item.id}`)
          break  
        case 'SERVIDOR':
          this.$router.push(`/servidor/cadastro/detalhes/${item.id}`)
          break
        case 'ADVOGADO':
          this.$router.push(`/advogado/cadastro/detalhes/${item.id}`)
          break
        case 'VISITANTE':
          this.$router.push(`/visitante/cadastro/detalhes/${item.id}`)
          break
        default:
          break
      }
    },
    adicionarItem(item) {
      let tipo = item.tipo.toLowerCase()
      this.$router.push(`/pedido-inclusao/cadastro/${tipo}/${item.id}`)
    }
  }
}
</script>
