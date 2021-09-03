<template>
  <v-main>
    <barra-superior
      :titulo="$t('interno.top.title')"
      :subtitulo="$t('interno.top.subtitle')"
      :breadcrumbs="$t('interno.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          md="12"
          class="d-flex flex-row-reverse"
        >
          <v-btn
            color="blue darken-2"
            class="mb-2"
            text
            @click="cadastrarInterno"
          >
            <v-icon>add</v-icon>
            <span>Incluir interno</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          {{ $t('interno.top.subtitle') }}
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
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          item-key="id"
          single-select
          show-expand
          single-expand
          :must-sort="true"
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
          <template v-slot:[`item.vulgo`]="{ item }">
            <v-chip
              v-for="vulgo, v in item.vulgo"
              :key="v"
              :vulgo="vulgo"
              small
              class="mr-2"
            >
              {{ vulgo.length >= 30 ? `${vulgo.substring(0, 30)}...` : vulgo }}
            </v-chip>
          </template>
          <template v-slot:[`item.data_nascimento`]="{ item }">
            {{ formatDate(item.data_nascimento) }}
          </template>
          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip
              v-if="item.ativo"
              class="ma-2"
              color="light-green darken-2"
              text-color="white"
            >
              Ativo
            </v-chip>
            <v-chip
              v-else
              class="ma-2"
              color="red darken-2"
              text-color="white"
            >
              Inativo
            </v-chip>
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
              <v-tooltip
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
            </v-toolbar-items>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td colspan="2">
              Unidade de custódia {{ item.unidade_nome }}
            </td>
            <td>Vivência {{ item.vivencia_nome }}</td>
            <td>Ala {{ item.ala_nome }}</td>
            <td>Pavimento {{ item.pavimento_nome }}</td>
            <td>Cela {{ item.cela_nome }}</td>
            <td>Reincidente no SPF {{ item.reincidente }}</td>
          </template>
          <template
            v-slot:no-data
          >
            {{
              search.length
                ? "Nenhum resultado foi encontrado para sua pesquisa"
                : "Ainda não há registro cadastrado"
            }}
          </template>
        </v-data-table>
        <ConfirmDialog ref="confirm" />
        <PromptDialog ref="prompt" />
        <SimpleDialog ref="dialog" />
        <TreeDialog ref="tree" />
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'
import TreeDialog from '@/components/TreeDialog'
import SimpleDialog from '@/components/SimpleDialog'
import PromptDialog from '@/components/PromptDialog'
import mensagens from '@/shared/mensagens'

export default {
  components: { ConfirmDialog, TreeDialog, SimpleDialog, PromptDialog },
  data: () => ({
    headers: [
      { text: '', value: 'thumbnail' },
      { text: 'Nome', value: 'nome' },
      { text: 'Vulgo', value: 'vulgo' },
      { text: 'Data de Nascimento', value: 'data_nascimento' },
      { text: 'Estado Solicitante', value: 'estado_nome' },
      { text: 'Situação', value: 'ativo' },
      { text: 'Ações', value: 'action', sortable: false },
      { text: '', value: 'data-table-expand' }
    ],
    search: '',
    totalItems: 0,
    items: [],
    options: {}
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
    cadastrarInterno() {
      this.$router.push('/interno/cadastro')
    },
    async getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const response = await this.$api.list({
        resource: this.$endpoints.INTERNO,
        query: {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc[0] ? '-' : ''}${sortBy}`,
          fields: 'id,thumbnail,nome,vulgo,data_nascimento,estado_nome,ativo',
          search: this.search
        }
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    editarItem(obj) {
      this.$router.push(`/interno/cadastro/${obj.id}`)
    },
    visualizarItem(obj) {
      this.$router.push(`/interno/cadastro/detalhes/${obj.id}`)
    },
    async excluirItem(obj) {
      if (
        await this.$refs.confirm.open(
          'Excluir registro',
          'Você tem certeza que deseja excluir esse registro ?'
        )
      ) {
        const response = this.$api.destroy({resource: this.$endpoints.INTERNO, id: obj.id})
        response
          .then(() => {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: `${mensagens('MSG5')}`,
              color: 'success',
              timeout: 3000
            })
            this.getDataFromApi()
          })
          .catch(error => {
            this.displayErrors(error)            
            this.getDataFromApi()
          })
      }
    },
  }
}
</script>

<style>
.actions {
  display: flex;
}
.actions > div {
  flex: 1;
}
.v-data-table-header th {
  white-space: nowrap;
}
tr.v-data-table__selected {
  background: #eeeeee !important;
}
</style>
