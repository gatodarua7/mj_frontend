<template>
  <v-card>
    <v-card-title>
      {{ title }}
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
        @click:append="getVisitantes"
        @keyup.enter="getVisitantes"
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      item-key="id"
      single-select
      :must-sort="true"
      :footer-props="{
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

      <template v-slot:[`item.data_nascimento`]="{ item }">
        {{ formatDate(item.data_nascimento) }}
      </template>

      <template v-slot:[`item.solicitante_informado`]="{ item }">
        <v-tooltip
          v-if="item.fase=='DEFERIDO' || item.fase=='INDEFERIDO' || item.fase=='RECURSO_DEFERIDO' || item.fase=='RECURSO_INDEFERIDO'"
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs" 
              v-on="on"
            >
              <v-switch
                v-model="item.solicitante_informado"
                :disabled="item.solicitante_informado"
                @mousedown="openDialogSolicitanteInformado(item)"
              />
            </div>
          </template>
          <span>{{ item.solicitante_informado ? 'Solicitante Informado' : 'Solicitante não informado' }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.fase`]="{ item }">
        <v-tooltip
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <v-alert
              v-bind="attrs"
              dense
              outlined
              border="left"
              :color="getFase(item.fase).cor"
              class="my-2 text-center"
              v-on="on"
            >
              {{ getFase(item.fase).nome }}
            </v-alert>
          </template>
          <span>{{ getFase(item.fase).nome }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-toolbar-items>
          <v-tooltip
            v-if="podeCadastrarRecurso(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="cadastrarRecurso(item)"
              >
                <v-icon>post_add</v-icon>
              </v-btn>
            </template>
            <span>Recurso</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeMovimentarVisitante(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="movimentarVisitante(item)"
              >
                <v-icon>sync_alt</v-icon>
              </v-btn>
            </template>
            <span>Movimentar Fase</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeVisualizarLinhaDoTempo(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="visualizarLinhaDoTempo(item.id)"
              >
                <v-icon>timeline</v-icon>
              </v-btn>
            </template>
            <span>Linha do Tempo</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeCadastrarAnaliseInteligencia(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                @click="cadastrarAnaliseInteligencia(item.id)"
                v-on="on"
              >
                <v-icon>fact_check</v-icon>
              </v-btn>
            </template>
            <span>Manifestar</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeCadastrarAnaliseDiretoria(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                @click="cadastrarAnaliseDiretoria(item.id)"
                v-on="on"
              >
                <v-icon>fact_check</v-icon>
              </v-btn>
            </template>
            <span>Manifestar</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeVisualizarAnaliseDaInteligencia(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="visualizarAnaliseInteligencia(item.id)"
              >
                <v-icon>mdi-owl</v-icon>
              </v-btn>
            </template>
            <span>Visualizar Análise da Inteligência</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeVisualizarAnaliseDaDiretoria(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="visualizarAnaliseDiretoria(item.id)"
              >
                <v-icon>mdi-account-tie</v-icon>
              </v-btn>
            </template>
            <span>Visualizar Análise da Diretoria</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeVisualizarVisitante(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="visualizarVisitante(item.id)"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
            </template>
            <span>Visualizar</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeEditarVisitante(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="editarVisitante(item.id)"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip
            v-if="podeExcluirVisitante(item)"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="exluirVisitante(item.id)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <span>Excluir</span>
          </v-tooltip>
        </v-toolbar-items>
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

    <prompt-dialog ref="dialogPrompt" />
    <dialog-cadastrar-recurso ref="dialogCadastrarRecurso" />
    <dialog-movimentar-visitante ref="dialogMovimentarVisitante" />
    <dialog-solicitante-informado ref="dialogSolicitanteInformado" />
  </v-card>
</template>

<script>
import mensagens from '@/shared/mensagens'
import visitanteMixin from '@/mixins/visitante'
import PromptDialog from '@/components/PromptDialog.vue'
import DialogCadastrarRecurso from './DialogCadastrarRecurso.vue'
import DialogMovimentarVisitante from './DialogMovimentarVisitante.vue'
import DialogSolicitanteInformado from './DialogSolicitanteInformado.vue'

export default {
  components: { 
    PromptDialog,
    DialogCadastrarRecurso,
    DialogMovimentarVisitante,
    DialogSolicitanteInformado
  },
  mixins: [visitanteMixin],
  props: {
    title: String,
    headers: Array,
    fase: String,
    actions: Array
  },
  data: () => ({
    search: '',
    totalItems: 0,
    items: [],
    options: {}
  }),
  watch: {
    options: {
      handler() {
        this.getVisitantes()
      },
      deep: true
    },
    search(val){
      !val && this.getVisitantes()
    }
  },
  methods: {
    async getVisitantes() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const response = await this.$api.list({
        resource: this.$endpoints.VISITANTE,
        query: {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc[0] ? '-' : ''}${sortBy}`,
          search: this.search,
          fase: this.fase,
          fields: 'id,thumbnail,nome,data_nascimento,cpf,atendimento,fase,solicitante_informado'
        }
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },

    async cadastrarRecurso(item) {
      const res = await this.$refs.dialogCadastrarRecurso.abrir(item)
      if (res) {
        this.$router.go()
        this.$store.dispatch('snackbar/setSnackbar', {
          text: `${mensagens('MSG1')}`,
          color: 'success',
          timeout: 3000
        })
      }
    },

    async openDialogSolicitanteInformado(item) {
      const res = await this.$refs.dialogSolicitanteInformado.open(item)
      res && this.getVisitantes()
    },

    async movimentarVisitante(item) {
      const res = await this.$refs.dialogMovimentarVisitante.open(item)
      res && this.getVisitantes()
    },

    visualizarAnaliseInteligencia(id) {
      this.$router.push(`/visitante/inteligencia/detalhes/${id}`)
    },

    visualizarAnaliseDiretoria(id) {
      this.$router.push(`/visitante/diretoria/detalhes/${id}`)
    },

    editarVisitante(id) {
      this.$router.push(`/visitante/cadastro/${id}`)
    },

    visualizarVisitante(id) {
      this.$router.push(`/visitante/cadastro/detalhes/${id}`)
    },

    visualizarLinhaDoTempo(id) {
      this.$router.push(`/visitante/timeline/${id}`)
    },
    
    cadastrarAnaliseInteligencia(id) {
      this.$router.push(`/visitante/inteligencia/${id}`)
    },

    cadastrarAnaliseDiretoria(id) {
      this.$router.push(`/visitante/diretoria/${id}`)
    },

    async exluirVisitante(id) {      
      const res = await this.$refs.dialogPrompt.open(
        'Excluir',
        'Você tem certeza que deseja excluir esse registro ?'
      )
      if (res) {
        const response = this.$api.destroy({
          resource: this.$endpoints.VISITANTE,
          id: id, 
          data: {
            excluido: true,
            motivo_exclusao: res
          }
        })
        response
          .then(()=> {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: mensagens('MSG5'),
              color: 'success',
              timeout: 3000
            })
            this.getVisitantes()
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },

    podeCadastrarRecurso(item){
      return item.permite_recurso && item.fase=='INDEFERIDO'
    },

    podeMovimentarVisitante(item){
      return this.fase=='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' || this.fase=='ANALISE_INTELIGENCIA' || (item.fase == 'INICIADO' || item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='RECURSO')
    },

    podeVisualizarLinhaDoTempo(item){
      return this.fase=='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' || this.fase=='ANALISE_INTELIGENCIA' || (item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='ANALISE_INTELIGENCIA' || item.fase=='ANALISE_DIRETORIA' || item.fase=='DEFERIDO' || item.fase=='INDEFERIDO' || item.fase=='RECURSO' || item.fase=='RECURSO_EM_ANALISE' || item.fase=='RECURSO_DEFERIDO' || item.fase=='RECURSO_INDEFERIDO')
    },

    podeVisualizarAnaliseDaInteligencia(item){
      if(this.fase=='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' || (this.fase!='ANALISE_INTELIGENCIA' && (item.fase=='ANALISE_INTELIGENCIA' || item.fase=='ANALISE_DIRETORIA'))){
        return item.analise_inteligencia
      } else {
        return this.fase!='ANALISE_INTELIGENCIA' && (item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='DEFERIDO' || item.fase=='INDEFERIDO' || item.fase=='RECURSO' || item.fase=='RECURSO_EM_ANALISE' || item.fase=='RECURSO_DEFERIDO' || item.fase=='RECURSO_INDEFERIDO')
      }
    },

    podeVisualizarAnaliseDaDiretoria(item){
      if(this.fase=='ANALISE_INTELIGENCIA' || (this.fase!='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' && (item.fase=='ANALISE_INTELIGENCIA' || item.fase=='ANALISE_DIRETORIA'))){
        return item.recurso_diretoria
      } else {
        return this.fase!='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' && (item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='DEFERIDO' || item.fase=='INDEFERIDO' || item.fase=='RECURSO' || item.fase=='RECURSO_EM_ANALISE' || item.fase=='RECURSO_DEFERIDO' || item.fase=='RECURSO_INDEFERIDO')
      }
    },

    podeCadastrarAnaliseInteligencia(){
      return this.fase=='ANALISE_INTELIGENCIA'
    },

    podeCadastrarAnaliseDiretoria(item){
      return this.fase=='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' && ((item.analise_diretoria && item.usuario_permissao) || !item.recurso_diretoria)
    },

    podeVisualizarVisitante(item){
      return !this.fase && (item.fase == 'INICIADO' || item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='ANALISE_INTELIGENCIA' || item.fase=='ANALISE_DIRETORIA' || item.fase=='DEFERIDO' || item.fase=='INDEFERIDO' || item.fase=='RECURSO' || item.fase=='RECURSO_EM_ANALISE' || item.fase=='RECURSO_DEFERIDO' || item.fase=='RECURSO_INDEFERIDO')
    },

    podeEditarVisitante(item){
      return item.fase == 'INICIADO' || item.fase=='ASSISTENCIA_SOCIAL' || item.fase=='RECURSO'
    },

    podeExcluirVisitante(item){
      return item.fase == 'INICIADO'
    }
  }
}
</script>