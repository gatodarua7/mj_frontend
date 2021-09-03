<template>
  <v-row>
    <v-col
      cols="12"
      md="3"
      sm="12"
    >
      <foto-upload
        ref="foto"
        :photo-id="pedidoInclusao.foto"
        :readonly="disabled"
        @updatePhotoId="getFotoId"
        @deletePhoto="desvincularFoto"
      />
    </v-col>
    <v-col
      cols="12"
      md="9"
      sm="12"
    >
      <v-row>
        <v-col
          cols="12"
          md="8"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.nome"
            :error-messages="errors.nome"
            label="Nome"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            :disabled="disabled"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                v-mask="['##/##/####']"
                label="Data de Nascimento"
                hint="DD/MM/AAAA"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                :error-messages="errors.data_nascimento"
                :disabled="disabled"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              />
            </template>
            <v-date-picker
              ref="picker"
              v-model="date"
              :active-picker.sync="activePicker"
              no-title
              locale="pt-br"
              :max="maxDate()"
              @input="menu1 = false"
            />
          </v-menu>
        </v-col><v-col
          cols="12"
          md="6"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.nome_social"
            label="Nome Social"
            :counter="150"
            :error-messages="errors.nome_social"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          sm="12"
        >
          <v-autocomplete
            v-model="pedidoInclusao.genero"
            :items="genero"
            hide-no-data
            hide-selected
            item-text="descricao"
            item-value="id"
            label="Gênero"
            clearable
            :error-messages="errors.genero"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.cpf"
            v-mask="['###.###.###-##']"
            label="CPF"
            :error-messages="errors.cpf"
            :disabled="disabled"
          />
        </v-col><v-col
          cols="12"
          sm="12"
        >
          <v-combobox
            v-model="pedidoInclusao.outros_nomes"
            :items="outros_nomes"
            small-chips
            clearable
            deletable-chips
            label="Outros nomes"
            multiple
            :error-messages="errors.outros_nomes"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <v-combobox
            v-model="pedidoInclusao.vulgo"
            :items="vulgos"
            small-chips
            clearable
            deletable-chips
            label="Vulgo"
            multiple
            :error-messages="errors.vulgo"
            :disabled="disabled"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col
      cols="12"
      sm="12"
    >
      <v-row>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-autocomplete
            v-model="pedidoInclusao.nacionalidade"
            :items="paises"
            chips
            small-chips
            multiple
            hide-no-data
            item-text="nome"
            item-value="id"
            color="blue"
            item-color="primary"
            label="Nacionalidade"
            clearable
            :error-messages="errors.nacionalidade"
            :disabled="disabled"
            @change="exibeEstados"
          >
            <template #selection="{ item }">
              <v-chip
                color="primary"
                small
              >
                {{
                  item.nome
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
          <v-autocomplete
            v-if="validaEstados"
            v-model="pedidoInclusao.estado"
            :items="estados"
            hide-no-data
            hide-selected
            item-text="nome"
            item-value="id"
            label="UF"
            clearable
            :error-messages="errors.estado"
            :disabled="disabled"
            @change="getCidadesPorEstado"
            @click:clear="onEstadoClear"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-autocomplete
            v-if="validaEstados"
            v-model="pedidoInclusao.naturalidade"
            :items="cidades"
            hide-no-data
            hide-selected
            item-text="nome_uf"
            item-value="id"
            label="Naturalidade"
            clearable
            :error-messages="errors.naturalidade"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.nome_mae"
            label="Nome da mãe"
            :counter="150"
            :error-messages="errors.nome_mae"
            :disabled="pedidoInclusao.mae_nao_declarado == true || disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
          sm="12"
        >
          <v-checkbox
            v-model="pedidoInclusao.mae_nao_declarado"
            label="Não declarado"
            :error-messages="errors.mae_nao_declarado"
            :disabled="disabled"
            @change="checkMaeDeclarado"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
          sm="12"
        >
          <v-checkbox
            v-model="pedidoInclusao.mae_falecido"
            label="Falecido"
            :error-messages="errors.mae_falecido"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.nome_pai"
            label="Nome do pai"
            :counter="150"
            :error-messages="errors.nome_pai"
            :disabled="pedidoInclusao.pai_nao_declarado == true || disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
          sm="12"
        >
          <v-checkbox
            v-model="pedidoInclusao.pai_nao_declarado"
            label="Não declarado"
            :error-messages="errors.pai_nao_declarado"
            :disabled="disabled"
            @change="checkPaiDeclarado"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
          sm="12"
        >
          <v-checkbox
            v-model="pedidoInclusao.pai_falecido"
            label="Falecido"
            :error-messages="errors.pai_falecido"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-autocomplete
            v-model="pedidoInclusao.necessidade_especial"
            :items="necessidadeEspecial"
            chips
            small-chips
            multiple
            color="blue"
            item-color="primary"
            hide-no-data
            item-text="nome"
            item-value="id"
            label="Necessidades Especiais"
            :error-messages="errors.necessidade_especial"
            :disabled="disabled"
          >
            <template #selection="{ item }">
              <v-chip
                color="primary"
                small
              >
                {{
                  item.nome
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
          <v-autocomplete
            v-model="pedidoInclusao.regime_prisional"
            :items="regimesPrisionais"
            hide-no-data
            hide-selected
            item-text="nome"
            item-value="id"
            label="Regime Prisional"
            clearable
            :error-messages="errors.regime_prisional"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-autocomplete
            v-model="pedidoInclusao.interesse"
            :items="interesses"
            hide-no-data
            hide-selected
            item-text="text"
            item-value="value"
            label="Interesse"
            clearable
            :error-messages="errors.interesse"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-text-field
            v-model="pedidoInclusao.numero_sei"
            v-mask="['#####.######/####-##']"
            label="Nº SEI"
            :error-messages="errors.numero_sei"
            :disabled="disabled"
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
            :disabled="disabled"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted2"
                v-mask="['##/##/####']"
                label="Data do Pedido SEI"
                hint="DD/MM/AAAA"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                :error-messages="errors.data_pedido_sei"
                :disabled="disabled"
                @blur="date2 = parseDate(dateFormatted2)"
                v-on="on"
              />
            </template>
            <v-date-picker
              ref="picker"
              v-model="date2"
              no-title
              locale="pt-br"
              :disabled="disabled"
              @input="menu2 = false"
            />
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="12"
        >
          <v-autocomplete
            v-model="pedidoInclusao.estado_solicitante"
            :items="estados"
            hide-no-data
            hide-selected
            item-text="nome"
            item-value="id"
            label="Solicitante da vaga"
            clearable
            :error-messages="errors.estado_solicitante"
            :disabled="disabled"
          />
        </v-col>
        
        <v-col
          cols="12"
          md="6"
          sm="12"
        >
          <v-switch
            v-model="tipoInclusao"                      
            :label="
              tipoInclusao ? 'Inclusão definitivo ou emergencial: EMERGENCIAL' : 'Inclusão definitivo ou emergencial: DEFINITIVO'
            "
            color="red"
            hide-details
            inset                      
            :error-messages="errors.tipo_inclusao"
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="12"
        >
          <v-switch
            v-model="presoExtraditando"
            :label="
              presoExtraditando ? 'Preso Extraditando: SIM' : 'Preso Extraditando: NÃO'
            "
            inset
            hide-details
            :disabled="disabled"
          />
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <norma-juridica-dialog
            :object="pedidoInclusao"
            :readonly="disabled"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { ID_BRASIL } from '@/shared/valoresAvulsos'
import FotoUpload from '@/components/FotoUpload.vue'
import NormaJuridicaDialog from './NormaJuridicaDialog.vue'

export default {
  components: {FotoUpload, NormaJuridicaDialog},
  props: {
    pedidoInclusao: Object,
    errors: Object,
    disabled: Boolean
  },
  data: () => ({
    activePicker: null,
    date: null,
    dateFormatted: null,
    menu1: false,
    date2: null,
    dateFormatted2: null,
    menu2: false,
    genero: [],
    outros_nomes: [],
    vulgos: [],
    cidades: [],
    validaEstados: false,
    estados: [],
    paises: [],
    necessidadeEspecial: [],
    regimesPrisionais: [],
    interesses: [
      {value: 'PRESO', text: 'Preso'},
      {value: 'SEGURANCA_PUBLICA', text: 'Segurança Pública'}
    ],
    presoExtraditando: false,
    tipoInclusao: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
    computedDateFormatted2() {
      return this.formatDate(this.date2)
    }
  },
  watch: {
    menu1 (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    date() {
      this.pedidoInclusao.data_nascimento = this.formatDate(this.date)
      this.dateFormatted = this.formatDate(this.date)
    },
    date2() {
      this.pedidoInclusao.data_pedido_sei = this.formatDate(this.date2)
      this.dateFormatted2 = this.formatDate(this.date2)
    }
  },
  mounted() {
    this.getEstados()
    this.getPaises()
    this.getGeneros()
    this.getNecessidadeEspecial()
    this.getRegimesPrisionais()
    this.exibeEstados()
    this.pedidoInclusao.estado && this.getCidadesPorEstado(this.pedidoInclusao.estado)
    this.presoExtraditando = this.pedidoInclusao.preso_extraditando
    this.date = this.pedidoInclusao.data_nascimento
    this.date2 = this.pedidoInclusao.data_pedido_sei    
    if (this.pedidoInclusao.tipo_inclusao == 'DEFINITIVO') {
      this.tipoInclusao = false
    }
    if (this.pedidoInclusao.tipo_inclusao == 'EMERGENCIAL') {
      this.tipoInclusao = true
    }
  },
  methods: {
    maxDate() {
      var date = new Date()
      date.setFullYear(date.getFullYear() - 18)
      return date.toISOString().slice(0,10)
    },
    onEstadoClear() {
      this.pedidoInclusao.naturalidade = null
      this.cidades = []
    }, 
    exibeEstados() {
      if (
        this.pedidoInclusao.nacionalidade &&
        this.pedidoInclusao.nacionalidade.indexOf(ID_BRASIL) > -1
      ) {
        this.validaEstados = true
      } else {
        this.validaEstados = false
        this.pedidoInclusao.estado = null
        this.pedidoInclusao.naturalidade = null
      }
    },

    async getRegimesPrisionais() {
      const response = await this.$api.list({
        resource: this.$endpoints.REGIME_PRISIONAL,
        query: {
          page_size: 10000,
          ativo: true
        }
      })
      this.regimesPrisionais = response.data.results
    },
    checkMaeDeclarado() {
      if (this.pedidoInclusao.mae_nao_declarado) {
        this.pedidoInclusao.nome_mae = null
      }
    },
    checkPaiDeclarado() {
      if (this.pedidoInclusao.pai_nao_declarado) {
        this.pedidoInclusao.nome_pai = null
      }
    },
    getFotoId(id) {
      this.pedidoInclusao.foto = id
    },
    desvincularFoto() {
      this.pedidoInclusao.foto = null
    },
  }
}
</script>