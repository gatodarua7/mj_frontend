<template>
  <v-main>
    <barra-superior
      titulo="Inteligência"
      subtitulo="Auditoria"
      :breadcrumbs="breadcrumbs"
    />

    <v-container fluid>
      <v-card>
        <v-card-title>
          Auditoria
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
            v-if="!showAdvancedSearch"
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
          <div class="d-flex justify-end mb-3">
            <v-btn
              text
              color="primary"
              @click="toggleAdvancedSearch"
            >
              <v-icon>{{ showAdvancedSearch ? 'remove' : 'add' }}</v-icon> Pesquisa Avançada
            </v-btn>
          </div>
          <div v-if="showAdvancedSearch">
            <v-row>
              <v-col
                cols="12"
                md="4"
                sm="12"
              >
                <v-autocomplete
                  v-model="method"
                  label="Evento"
                  :items="methods"
                  item-value="value"
                  item-text="text"
                  hide-no-data
                  hide-selected
                  clearable
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="3"
                sm="12"
              >
                <v-menu
                  ref="pickerDataInicio"
                  v-model="pickerDataInicio"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dataInicio"
                      v-mask="['##/##/####']"
                      label="Data Início"
                      hint="DD/MM/AAAA"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      readonly
                      clearable
                      @blur="dataInicioPicker = parseDate(dataInicio)"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="dataInicioPicker"
                    no-title
                    locale="pt-br"
                    @input="pickerDataInicio = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
              >
                <v-menu
                  ref="pickerDataFim"
                  v-model="pickerDataFim"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dataFim"
                      v-mask="['##/##/####']"
                      label="Data Fim"
                      hint="DD/MM/AAAA"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      readonly
                      clearable
                      @blur="dataFimPicker = parseDate(dataFim)"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="dataFimPicker"
                    no-title
                    locale="pt-br"
                    @input="pickerDataFim = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
              >
                <v-text-field
                  v-model="hora_inicio"
                  type="time"
                  label="Hora Início"
                  clearable
                  :disabled="!dataInicio"
                />
              </v-col>
              <v-col
                cols="12"
                md="3"
                sm="12"
              >
                <v-text-field
                  v-model="hora_fim"
                  type="time"
                  label="Hora Fim"
                  clearable
                  :disabled="!dataFim"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="6"
                sm="12"
              >
                <v-text-field
                  v-model="username_persistent"
                  label="Usuário"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                sm="12"
              >
                <v-text-field
                  v-model="remote_addr"
                  label="IP"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="6"
                sm="12"
              >
                <v-autocomplete
                  v-model="status_code"
                  label="Status da Requisição"
                  :items="status_codes"
                  item-value="value"
                  item-text="text"
                  hide-no-data
                  hide-selected
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                sm="12"
              >
                <v-text-field
                  v-model="data"
                  label="Conteúdo da Requisição"
                />
              </v-col>
            </v-row>
            <div class="d-flex justify-end mb-3">
              <v-btn
                color="primary"
                @click="getDataFromApi"
              >
                Pesquisar
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          item-key="id"
          :must-sort="true"
          :footer-props="{
            'items-per-page-options': [5, 10, 15]
          }"
        >
          <template v-slot:[`item.requested_at`]="{ item }">
            {{ formatDateTime(item.requested_at) }}
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
                    @click="visualizarItem(item.id)"
                    v-on="on"
                  >
                    <v-icon>visibility</v-icon>
                  </v-btn>
                </template>
                <span>Visualizar</span>
              </v-tooltip>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        to: '/',
        exact: true
      },
      {
        text: 'Auditoria',
        to: '/auditoria',
        disabled: true
      }
    ],
    method: null,
    dataInicioPicker: null,
    dataInicio: null,
    pickerDataInicio: false,
    dataFimPicker: null,
    dataFim: null,
    pickerDataFim: false,
    hora_inicio: null,
    hora_fim: null,
    username_persistent: null,
    remote_addr: null,
    status_code: null,
    data: null,
    search: null,
    headers: [
      { text: 'Data/Hora', value: 'requested_at' },
      { text: 'Usuário', value: 'username_persistent' },
      { text: 'Caminho da Funcionalidade', value: 'path' },
      { text: 'Evento Realizado', value: 'method_nome' },
      { text: 'Mensagem do Sistema', value: 'status_code_nome' },
      { text: 'Ação', value: 'action', sortable: false }
    ],
    items: [],
    options: {},
    totalItems: 0,
    showAdvancedSearch: false,
    methods: [
      { value:"PATCH", text:"Atualizar" },
      { value:"PUT", text:"Atualizar" },
      { value:"POST", text:"Cadastrar" },
      { value:"DELETE", text:"Excluir" },
      { value:"GET", text:"Consultar" }
    ],
    status_codes: [
      { value: 100, text: "Continuar" },
      { value: 101, text: "Mudando Protocolos" },
      { value: 102, text: "Processando" },
      { value: 200, text: "Ok" },
      { value: 201, text: "Criado" },
      { value: 202, text: "Aceito" },
      { value: 203, text: "Não autorizado" },
      { value: 204, text: "Nenhum Conteúdo" },
      { value: 205, text: "Resetar Conteúdo" },
      { value: 206, text: "Conteúdo Parcial" },
      { value: 300, text: "Múltipla Escolha" },
      { value: 301, text: "Movido Permanentemente" },
      { value: 302, text: "Encontrado" },
      { value: 303, text: "Veja outro" },
      { value: 304, text: "Não modificado" },
      { value: 305, text: "Use Proxy" },
      { value: 306, text: "Proxy Trocado" },
      { value: 400, text: "Solicitação Inválida" },
      { value: 401, text: "Não autorizado" },
      { value: 402, text: "Pagamento necessário" },
      { value: 403, text: "Proibido" },
      { value: 404, text: "Não encontrado" },
      { value: 405, text: "Método não permitido" },
      { value: 406, text: "Não aceito" },
      { value: 407, text: "Autenticação de Proxy Necessária" },
      { value: 408, text: "Tempo de solicitação esgotado" },
      { value: 409, text: "Conflito" },
      { value: 410, text: "Perdido" },
      { value: 411, text: "Duração necessária" },
      { value: 412, text: "Falha de pré-condição" },
      { value: 413, text: "Solicitação da entidade muito extensa" },
      { value: 414, text: "Solicitação de URL muito Longa" },
      { value: 415, text: "Tipo de mídia não suportado" },
      { value: 416, text: "Solicitação de faixa não satisfatória" },
      { value: 417, text: "Falha na expectativa" },
      { value: 500, text: "Erro do Servidor Interno" },
      { value: 501, text: "Não implementado" },
      { value: 502, text: "Porta de entrada ruim" },
      { value: 503, text: "Serviço Indisponível" },
      { value: 504, text: "Tempo limite da Porta de Entrada" },
      { value: 505, text: "Versão HTTP não suportada" }
    ]
  }),
  computed: {
    computedDataInicio() {
      return this.formatDate(this.dataInicioAereaDepen)
    },
    computedDataFim() {
      return this.formatDate(this.dataFimAereaDepen)
    },
    computedDataInicioTerrestre() {
      return this.formatDate(this.dataInicioTerrestreDepen)
    },
    computedDataFimTerrestre() {
      return this.formatDate(this.dataFimTerrestreDepen)
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true
    },
    search(val){
      !val && this.getDataFromApi()
    },
    dataInicioPicker() {
      this.dataInicio = this.formatDate(this.dataInicioPicker)
    },
    dataFimPicker() {
      this.dataFim = this.formatDate(this.dataFimPicker)
    },
  },
  methods: {
    async getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const response = await this.$api.list({
        resource: this.$endpoints.AUDITORIA,
        query: {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc[0] ? '-' : ''}${sortBy}`,
          search: this.search,
          method: this.method,
          data_inicio: this.dataInicio,
          data_fim: this.dataFim,
          hora_inicio: this.hora_inicio,
          hora_fim: this.hora_fim,
          usuario: this.username_persistent,
          resposta: this.data,
          ip: this.remote_addr,
          status_code: this.status_code
        }
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    visualizarItem(id){
      this.$router.push(`/auditoria/${id}`)
    },
    toggleAdvancedSearch(){
      this.showAdvancedSearch = !this.showAdvancedSearch
      this.search = null
    }
  }
}
</script>
