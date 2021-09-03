<template>
  <div>
    <v-form v-model="rules.stepForm2">
      <v-row>
        <v-col
          cols="12"
          md="6"
          sm="12"
        >
          <v-autocomplete
            v-model="servidor.cargos"
            :items="cargos"
            hide-no-data
            hide-selected
            item-text="cargo"
            item-value="id"
            label="Cargo Efetivo"
            clearable
            :disabled="readonly"
            :error-messages="errors.cargos"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="12"
        >
          <v-autocomplete
            v-model="servidor.funcao"
            :items="funcoes"
            chips
            small-chips
            multiple
            hide-no-data
            item-text="descricao"
            item-value="id"
            color="blue"
            item-color="primary"
            label="Função"
            clearable
            :disabled="readonly"
            :error-messages="errors.funcao"
          >
            <template #selection="{ item }">
              <v-chip
                color="primary"
                small
              >
                {{
                  item.descricao
                }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-text-field
            v-model="servidor.matricula"
            v-mask="['########']"
            label="Matrícula/SIAPE"
            :disabled="readonly"
            :error-messages="errors.matricula"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted2"
                v-mask="['##/##/####']"
                label="Data de entrada em exercício"
                hint="DD/MM/AAAA"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                :disabled="readonly"
                :error-messages="errors.data_admissao"
                @blur="date2 = parseDate(dateFormatted2)"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date2"
              no-title
              locale="pt-br"
              @input="menu2 = false"
            />
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-menu
            ref="menu3"
            v-model="menu3"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted3"
                v-mask="['##/##/####']"
                label="Data de desligamento"
                hint="DD/MM/AAAA"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                :disabled="readonly"
                :error-messages="errors.data_desligamento"
                @blur="date3 = parseDate(dateFormatted3)"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date3"
              no-title
              locale="pt-br"
              @input="menu3 = false"
            />
          </v-menu>
        </v-col>
        <v-col
          v-if="dateFormatted3"
          cols="12"
          md="12"
          sm="12"
        >
          <v-textarea
            v-model="servidor.motivo_desligamento"
            label="Motivo do desligamento"
            :counter="200"
            :rules="[
              () =>
                servidor.motivo_desligamento.length <= 200 ||
                'O campo excedeu o limite de 200 caracteres'
            ]"
            filled
            :disabled="readonly"
            :error-messages="errors.motivo_desligamento"
          />
        </v-col>
        <v-col
          cols="12"
          md="12"
          sm="12"
        >
          <v-text-field
            v-model="servidor.email_profissional"
            type="email"
            prepend-icon="mail"
            label="E-mail Profissional"
            :disabled="readonly"
            :error-messages="errors.email_profissional"
          />
        </v-col>
        <v-col
          cols="12"
          md="12"
          sm="12"
        >
          <v-text-field
            v-model="servidor.lotacao_nome"
            readonly
            label="Lotação Principal"
            :disabled="readonly"
            :error-messages="errors.lotacao"
            append-icon="search"
            clearable
            @click="carregado && (dialogLotacao = true)"
            @click:append="carregado && (dialogLotacao = true)"
            @click:clear="onLotacaoClear"
          />
        </v-col>
        <v-col
          cols="12"
          md="12"
          sm="12"
        >
          <v-text-field
            v-model="servidor.lotacao_temporaria_nome"
            readonly
            label="Lotação Temporária"
            :disabled="readonly"
            :error-messages="errors.lotacao_temporaria"
            append-icon="search"
            clearable
            @click="
              carregado && (dialogLotacaoTemporaria = true)
            "
            @click:append="
              carregado && (dialogLotacaoTemporaria = true)
            "
            @click:clear="onLotacaoTemporariaClear"
          />
        </v-col>
        <v-col
          cols="12"
          md="12"
          sm="12"
        >
          <telefone-funcional-pessoa-dialog
            :object="servidor"
            :readonly="readonly"
          />
        </v-col>
      </v-row>
    </v-form>
  
    <v-dialog
      v-model="dialogLotacao"
      max-width="700"
    >
      <v-card>
        <v-card-title />
        <v-card-text>
          <v-treeview
            activatable
            item-key="key"
            :items="setores"
            @update:active="setLotacao"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogLotacaoTemporaria"
      max-width="700"
    >
      <v-card>
        <v-card-title />
        <v-card-text>
          <v-treeview
            activatable
            item-key="key"
            :items="setores"
            @update:active="setLotacaoTemporaria"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TelefoneFuncionalPessoaDialog from '@/components/TelefoneFuncionalPessoaDialog.vue'
import * as setorService from '@/services/SetorService'

export default {
  components: {
    TelefoneFuncionalPessoaDialog
  },
  props: {
    servidor: Object,
    errors: Object,
    rules: Object,
    readonly: Boolean
  },
  data: () => ({
    date2: null,
    dateFormatted2: null,
    menu2: false,
    date3: null,
    dateFormatted3: null,
    menu3: false,
    dialogLotacao: false,
    dialogLotacaoTemporaria: false,
    cargos: [],
    funcoes: [],
    setores: []
  }),
  computed: {
    computedDateFormatted2() {
      return this.formatDate(this.date2)
    },
    computedDateFormatted3() {
      return this.formatDate(this.date3)
    }
  },
  watch: {
    date2() {
      this.dateFormatted2 = this.formatDate(this.date2)
      this.servidor.data_admissao = this.dateFormatted2
    },
    date3() {
      this.dateFormatted3 = this.formatDate(this.date3)
      this.servidor.data_desligamento = this.dateFormatted3
    }
  },
  mounted() {
    this.montaArvoreSetor()
    this.getCargos()
    this.getFuncoes()
    this.date2 = this.servidor.data_admissao
    this.date3 = this.servidor.data_desligamento
    this.servidor.lotacao &&
      setorService.getArvoreById(this.servidor.lotacao).then(res => {
        const list = this.getFlat(res.data[0])
        const list_names = list.join(' / ')
        this.servidor.lotacao_nome = list_names
      })
    this.servidor.lotacao_temporaria &&
      setorService
        .getArvoreById(this.servidor.lotacao_temporaria)
        .then(res => {
          const list = this.getFlat(res.data[0])
          const list_names = list.join(' / ')
          this.servidor.lotacao_temporaria_nome = list_names
        })
  },
  methods: {  
    async getCargos() {
      const response = await this.$api.list({
        resource: this.$endpoints.CARGO,
        query: {
          page_size: 10000,
          ativo: true
        }
      })
      this.cargos = response.data.results
    },
    
    async getFuncoes() {
      const response = await this.$api.list({
        resource: this.$endpoints.FUNCAO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.funcoes = response.data.results
    },

    getFlat({ name, children = [] }) {
      return children.reduce((r, o) => [...r, ...this.getFlat(o)], [name])
    },
    setLotacao(item) {
      let obj = item.toString()
      let id = obj.substring(2)
      if (obj.startsWith('SE')) {
        setorService.getId(id).then(response => {
          this.servidor.lotacao = response.data.id
          setorService.getArvoreById(this.servidor.lotacao).then(res => {
            const list = this.getFlat(res.data[0])
            const list_names = list.join(' / ')
            this.servidor.lotacao_nome = list_names
            this.dialogLotacao = false
          })
        })
      }
    },
    setLotacaoTemporaria(item) {
      let obj = item.toString()
      let id = obj.substring(2)
      if (obj.startsWith('SE')) {
        setorService.getId(id).then(response => {
          this.servidor.lotacao_temporaria = response.data.id
          setorService
            .getArvoreById(this.servidor.lotacao_temporaria)
            .then(res => {
              const list = this.getFlat(res.data[0])
              const list_names = list.join(' / ')
              this.servidor.lotacao_temporaria_nome = list_names
              this.dialogLotacaoTemporaria = false
            })
        })
      }
    },
    onLotacaoClear() {
      this.servidor.lotacao = null
      this.servidor.lotacao_nome = null
    },
    onLotacaoTemporariaClear() {
      this.servidor.lotacao_temporaria = null
      this.servidor.lotacao_temporaria_nome = null
    },
    montaArvoreSetor() {
      setorService.getArvore().then(response => {
        this.setores = response.data
        this.carregado = true
      })
    },
  }
}
</script>