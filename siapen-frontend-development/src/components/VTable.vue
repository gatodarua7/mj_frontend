<template>
  <div>
    <div
      v-if="actions.includes('create')"
      class="d-flex justify-end mb-3"
    >
      <v-btn
        color="blue darken-2"
        text
        @click="cadastrarItem"
      >
        <v-icon>add</v-icon>
        <span>Incluir</span>
      </v-btn>
    </div>
    <v-card>
      <v-card-title>
        {{ subtitle }}
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
        :must-sort="true"
        :footer-props="{
          'items-per-page-options': [5, 10, 15]
        }"
        @click:row="rowClick"
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
        <template v-slot:[`item.numero`]="{ item }">
          {{ convertPhoneNumber(item.numero) }}
        </template>
        <template v-slot:[`item.titulo_nome`]="{ item }">
          {{ item.titulo_nome.length >= 200 ? `${item.titulo_nome.substring(0, 200)}...` : item.titulo_nome }}
        </template>
        <template v-slot:[`item.data_nascimento`]="{ item }">
          {{ formatDate(item.data_nascimento) }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>
        <template v-slot:[`item.data_movimentacao`]="{ item }">
          {{ formatDateTime(item.data_movimentacao) }}
        </template>
        <template v-slot:[`item.data_validade`]="{ item }">
          {{ formatDate(item.data_validade) }}
        </template>
        <template v-slot:[`item.descricao`]="{ item }">
          {{ item.descricao.length >= 200 ? `${item.descricao.substring(0, 200)}...` : item.descricao }}
        </template>
        <template v-slot:[`item.cpf`]="{ item }">
          {{ item.cpf && convertCPF(item.cpf) }}
        </template>
        <template v-slot:[`item.oabs_list`]="{ item }">
          {{ item.oabs_list[0] }}{{ item.oabs_list.length > 1 ? '...' : '' }}
        </template>
        <template v-slot:[`item.observacao`]="{ item }">
          <v-btn
            v-if="item.observacao"
            text
            @click="exibirObservacoes(item)"
          >
            <v-icon
              color="primary"
              dark
            >
              mdi-information
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:[`item.situacao`]="{ item }">
          <div v-if="router=='visitante'">
            <v-chip
              v-if="item.situacao"
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
          </div>
          <div v-else>
            <v-chip
              v-if="item.situacao"
              class="ma-2"
              color="light-green darken-2"
              text-color="white"
            >
              Completo
            </v-chip>
            <v-chip
              v-else
              class="ma-2"
              color="red darken-2"
              text-color="white"
            >
              Incompleto
            </v-chip>
          </div>
        </template>
        <template v-slot:[`item.ativo`]="{ item }">
          <v-switch
            v-model="item.ativo"
            @mousedown="ativarItem(item)"
          />
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-toolbar-items>
            <v-tooltip
              v-if="actions.includes('hierarchy')"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  @click="getHierarchyItem(item)"
                  v-on="on"
                >
                  <v-icon>account_tree</v-icon>
                </v-btn>
              </template>
              <span>Hierarquia</span>
            </v-tooltip>
            <v-tooltip
              v-if="actions.includes('detail')"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="actions.includes('detail')"
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
              v-if="actions.includes('edit')"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="actions.includes('edit')"
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
              v-if="actions.includes('delete')"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="actions.includes('delete')"
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
    </v-card>
  </div>
</template>
<script>
import ConfirmDialog from '@/components/ConfirmDialog'
import SimpleDialog from '@/components/SimpleDialog'
import PromptDialog from '@/components/PromptDialog'
import mensagens from '@/shared/mensagens'

export default {
  components: { ConfirmDialog, SimpleDialog, PromptDialog },
  props: {
    subtitle: String,
    headers: Array,
    endpoint: String,
    router: String,
    actions: Array,
    prompt: Boolean,
    promptDelete: Boolean,
    params: Array,
    sort: Array
  },
  data() {
    return {
      search: '',
      totalItems: 0,
      items: [],
      options: {}
    }
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
    }
  },
  methods: {
    async getDataFromApi() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      let sortParam = this.sort && this.sort.find(element => element.text == sortBy)
      const query = {
          page: page,
          page_size: itemsPerPage,
          ordering: `${sortDesc[0] ? '-' : ''}${sortParam ? sortParam.value : sortBy}`,
          search: this.search
      }
      // Verifica se existe parâmetros adicionais
      this.params && this.params.map(item => {
        query[item.key] = item.value
      })
      const response = await this.$api.list({
        resource: this.endpoint,
        query: query
      })
      this.items = response.data.results
      this.totalItems = response.data.count
    },
    cadastrarItem() {
      this.$router.push(`/${this.router}/cadastro`)
    },
    editarItem(obj) {
      this.$router.push(`/${this.router}/cadastro/${obj.id}`)
    },
    visualizarItem(obj) {
      this.$router.push(`/${this.router}/cadastro/detalhes/${obj.id}`)
    },
    excluirItem(obj) {
      this.promptDelete ? this.promptExcluir(obj) : this.confirmExcluir(obj)
    },
    async promptExcluir(obj) {
      const res = await this.$refs.prompt.open(
        'Excluir registro',
        'Você tem certeza que deseja excluir esse registro ?'
      )
      if (res) {
        const response = this.$api.destroy({
          resource: this.endpoint,
          id: obj.id, 
          data: {
            excluido: true,
            motivo_exclusao: res
          }
        })
        response
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
    },
    async confirmExcluir(obj) {
      if (
        await this.$refs.confirm.open(
          'Excluir registro',
          'Você tem certeza que deseja excluir esse registro ?'
        )
      ) {
        const response = this.$api.destroy({
          resource: this.endpoint,
          id: obj.id
        })
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
    ativar(obj) {
      const response = this.$api.update({
        resource: this.endpoint,
        id: obj.id, 
        data: obj
      })
      response
        .then(() => {
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })          
          this.getDataFromApi()
        })
        .catch(error => {
          this.displayErrors(error)
          this.getDataFromApi()
        })
    },
    async ativarItem(obj) {
      this.prompt ? this.promptAtivar(obj) : this.confirmAtivar(obj)
    },
    async promptAtivar(obj) {
      const res = await this.$refs.prompt.open(
        obj.ativo ? 'Desativar registro' : 'Ativar registro',
        obj.ativo ? `${mensagens('MSG18')}` : `${mensagens('MSG17')}`
      )
      if (res) {
        obj.ativo = !obj.ativo
        obj.ativo
          ? (obj.motivo_ativacao = res)
          : (obj.motivo_inativacao = res)
        this.ativar({
          id: obj.id,
          ativo: obj.ativo,
          motivo_ativacao: obj.motivo_ativacao,
          motivo_inativacao: obj.motivo_inativacao
        })
      }
    },
    async confirmAtivar(obj) {
      const res = await this.$refs.confirm.open(
        obj.ativo ? 'Desativar registro' : 'Ativar registro',
        obj.ativo ? `${mensagens('MSG18')}` : `${mensagens('MSG17')}`
      )
      if (res) {
        obj.ativo = !obj.ativo
        this.ativar({
          id: obj.id,
          ativo: obj.ativo
        })
      }
    },
    getHierarchyItem(obj) {
      this.$emit('getHierarchy', obj)
    },
    rowClick: function(item, row) {
      row.select(true)
    },
    exibirObservacoes(obj) {
      this.$refs.dialog.open(obj.observacao)
    },
    convertPhoneNumber(numero) {
      numero.replace(/[^\d]/g, '')
      return numero.replace(/^([0-9]{2})([0-9]{4,5})([0-9]{4})$/, '($1) $2-$3')
    },
    convertCPF(cpf) {
      cpf.replace(/[^\d]/g, '')
      return cpf.replace(
        /^([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})-?([0-9]{2})$/,
        '$1.$2.$3-$4'
      )
    }
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
