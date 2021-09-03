<template>
  <v-main>
    <barra-superior
      :titulo="$t('escolta.top.title')"
      :subtitulo="$t('escolta.top.subtitle')"
      :breadcrumbs="$t('escolta.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <v-card>
        <v-card-title>
          {{ $t('escolta.top.subtitle') }}
          <v-chip
            class="ml-2"
            color="grey lighten-1"
            text-color="white"
            small
          >
            {{ totalEscoltas }}
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
            :headers="[
              { text: 'Nº Escolta', value: 'numero_escolta' },
              { text: 'Cadastro da Escolta', value: 'created_at' },
              { text: 'Tipo Escolta', value: 'tipo_escolta' },
              { text: 'Responsável', value: 'responsavel' },
              { text: 'Escolta Aérea', value: 'escolta_aerea' },
              { text: 'Fase da Escolta Aérea', value: 'fase_escolta_aerea' },
              { text: 'Escolta Terrestre', value: 'escolta_terrestre' },
              { text: 'Fase da Escolta Terrestre', value: 'fase_escolta_terrestre' },
              { text: 'Ações', value: 'action', sortable: false },
              { text: '', value: 'data-table-expand', sortable: false }
            ]"
            :items="escoltas"
            :options.sync="options"
            :server-items-length="totalEscoltas"
            :must-sort="true"
            item-key="id"            
            show-expand
            single-expand
            :footer-props="{
              'items-per-page-options': [5, 10, 15]
            }"
          >
            <template
              v-slot:[`item.created_at`]="{ item }"
            >
              {{ formatDateTime(item.created_at) }}
            </template>
            <template
              v-slot:[`item.escolta_aerea`]="{ item }"
            >
              <div v-html="formatDateTimeEscolta(item.escolta_aerea)" />
            </template>
            <template
              v-slot:[`item.escolta_terrestre`]="{ item }"
            >
              <div v-html="formatDateTimeEscolta(item.escolta_terrestre)" />
            </template>
            <template v-slot:[`item.fase_escolta_aerea`]="{ item }">
              <v-alert
                v-if="item.fase_escolta_aerea"
                dense
                outlined
                border="left"
                :color="corFase(item.fase_escolta_aerea)"
                class="my-2 text-center"
              >
                {{ nomeFase(item.fase_escolta_aerea) }}
              </v-alert>
            </template>
            <template v-slot:[`item.fase_escolta_terrestre`]="{ item }">
              <v-alert
                v-if="item.fase_escolta_terrestre"
                dense
                outlined
                border="left"
                :color="corFase(item.fase_escolta_terrestre)"
                class="my-2 text-center"
              >
                {{ nomeFase(item.fase_escolta_terrestre) }}
              </v-alert>
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
                <v-tooltip
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
                <strong>Nº SEI Escolta</strong> {{ item.numero_sei }}
              </td>
              <td colspan="2">
                <strong>Nº Documento SEI</strong> {{ item.numero_documento_sei }}
              </td>
              <td colspan="2">
                <strong>Penitenciária Indicada</strong> <br><span v-html="returnListaDestino(item.unidade_nome)" />
              </td>
              <td colspan="2">
                <strong>Nome da missão</strong> {{ item.nome_missao }}
              </td>
              <td colspan="2">
                <strong>Ordem de missão penitenciária</strong> {{ item.ordem_missao }}
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
      </v-card>
      <PromptDialog ref="prompt" />
    </v-container>
  </v-main>
</template>

<script>
import * as escoltaService from '@/services/EscoltaService'
import PromptDialog from '@/components/PromptDialog'

export default {
  components: { PromptDialog },
  data: () => ({
    escoltas: [],
    search: null,
    options: {},
    totalEscoltas: 0
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
    corFase(fase) {
      let cor = null
      switch (fase) {
        case 'AGENDADA':
          cor = 'orange darken-1' 
          break        
        case 'INICIADA_TERRESTRE':
          cor = 'light-blue darken-4' 
          break
        case 'INICIADA_AEREA':
          cor = 'light-blue darken-4' 
          break
        case 'EM_TRANSITO':
          cor = 'blue-grey darken-3' 
          break
        case 'FINALIZADA':
          cor = 'light-green darken-4' 
          break
        default:
          break
      }
      return cor
    },
    nomeFase(fase) {
      let nome = null
      switch (fase) {
        case 'AGENDADA':
          nome = 'Agendada' 
          break        
        case 'INICIADA_TERRESTRE':
          nome = 'Iniciada Escolta Terrestre' 
          break
        case 'INICIADA_AEREA':
          nome = 'Iniciada Escolta Aérea' 
          break
        case 'EM_TRANSITO':
          nome = 'Em Trânsito' 
          break
        case 'FINALIZADA':
          nome = 'Finalizada' 
          break
        default:
          break
      }
      return nome
    },
    returnListaDestino(unidades){
      return unidades && unidades.join('<br />')
    },
    formatDateTimeEscolta(data) {
      let list_data = data.split(' - ')
      return data ? `${list_data[0]}<br>${list_data[1]}` : null
    },
    limpar() {
      this.$refs.form.reset()
      this.getDataFromApi()
    },
    async getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const response = await this.$api.list({
        resource: this.$endpoints.ESCOLTA,
        query: {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc[0] ? '-' : ''}${sortBy}`,
          search: this.search
        }
      })
      this.escoltas = response.data.results
      this.totalEscoltas = response.data.count
    },
    visualizarItem(item) {
      this.$router.push(`/escolta/cadastro/detalhes/${item.id}`)
    },
    editarItem(item) {
      this.$router.push(`/escolta/cadastro/${item.id}`)
    },
    async excluirItem(item) {
      const res = await this.$refs.prompt.open(
        'Excluir registro',
        'Você tem certeza que deseja excluir esse registro ?'
      )
      if (res) {
        item.excluido = true
        item.motivo_exclusao = res
        escoltaService
          .deletar(item)
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
