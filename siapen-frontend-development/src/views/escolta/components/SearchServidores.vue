<template>
  <v-card flat>
    <v-card-title v-if="!readonly">
      Vincular agentes na missão
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
            v-model="agenteSelecionado"
            prepend-icon="group_add"
            :items="agentes"
            :search-input.sync="search"
            clearable
            item-text="nome"
            item-value="id"
            :filter="checkResult"
            return-object
            label="Adicionar agente"
            :disabled="readonly"
            @change="adicionaAgente"
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
                <v-list-item-subtitle v-text="item.matricula" />
              </v-list-item-content>
            </template>            
            <template
              v-slot:no-data
            >
              <div class="px-4 py-2">
                Nenhum agente encontrado
              </div>
            </template>
          </v-combobox>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <div class="black--text text-subtitle-1">
            Agente(s) vinculado(s) a escolta
          </div>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            :footer-props="{
              'items-per-page-text': 'Registros por página:',
              'items-per-page-options': [5, 10, 15]
            }"
          >
            <template v-slot:[`item.thumbnail`]="{ item }">
              <v-avatar
                v-if="item.thumbnail"
                class="my-2"
              >
                <v-img :src="item.thumbnail" />
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
                      @click="desvincularAgente(item)"
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
import * as servidorService from '@/services/ServidorService'

export default {
  props: {
    items: Array,
    readonly: Boolean
  },
  data: () => ({
    headers: [
      { text: '', value: 'thumbnail' },
      { text: 'Nome', value: 'nome' },
      { text: 'CPF', value: 'cpf' },
      { text: 'SIAPE', value: 'matricula' },
      { text: 'Cargo', value: 'cargo_nome' },
      { text: 'Ações', value: 'action', sortable: false },
    ],
    options: {},
    agenteSelecionado: null,
    agentes: [],
    search: null
  }),
  watch: {
    search(val) {
      if(val && val.length >= 3) {
        this.getAllServidores(val)
      }
      if(!val) {
        this.getAllServidores(null)
      }
    },
  },
  mounted() {
    this.getAllServidores(null)
  },
  methods: {
    checkResult(item, queryText) {
      return (item.nome && item.nome.toLowerCase().includes(queryText.toLowerCase()) || item.cpf && item.cpf.toLowerCase().includes(queryText.toLowerCase()) || item.matricula && item.matricula.toLowerCase().includes(queryText.toLowerCase()) || item.cargo_nome && item.cargo_nome.toLowerCase().includes(queryText.toLowerCase()))
    },
    getAllServidores(val) {      
      servidorService
        .searchAll(val, this.items)
        .then(res => {
          this.agentes = res.data.results
        })
    },
    async adicionaAgente() {
      this.$emit('atualizarServidores', this.agenteSelecionado)
      this.getAllServidores(null)
      await new Promise(resolve => setTimeout(resolve, 500))
      this.agenteSelecionado = null
    },
    desvincularAgente(item) {
      this.$emit('desvincularServidores', item)
      this.getAllServidores(null)
    },
  }
}
</script>