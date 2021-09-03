<template>
  <v-form v-model="rules.stepForm1">
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <foto-upload
          ref="foto"
          :photo-id="advogado.foto"
          :readonly="readonly"
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
              v-model="advogado.nome"
              label="Nome"
              :counter="150"
              :error-messages="errors.nome"
              :disabled="readonly"
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
                  :disabled="readonly"
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
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-autocomplete
              v-model="advogado.genero"
              :items="genero"
              hide-no-data
              hide-selected
              item-text="descricao"
              item-value="id"
              label="Gênero"
              clearable
              :error-messages="errors.genero"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="advogado.cpf"
              v-mask="['###.###.###-##']"
              label="CPF"
              :error-messages="errors.cpf"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-combobox
              v-model="advogado.emails"
              :items="emails"
              small-chips
              clearable
              deletable-chips
              label="E-mail"
              multiple
              :disabled="readonly"
              :error-messages="errors.emails"
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
              v-model="advogado.nacionalidade"
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
              :disabled="readonly"
              @change="exibeEstados()"
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
              v-model="advogado.estado"
              :items="estados"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="UF"
              clearable
              :error-messages="errors.estado"
              :disabled="readonly"
              @change="getCidadesPorEstado(advogado.estado)"
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
              v-model="advogado.naturalidade"
              :items="cidades"
              hide-no-data
              hide-selected
              item-text="nome_uf"
              item-value="id"
              label="Naturalidade"
              clearable
              :error-messages="errors.naturalidade"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="12"
            sm="12"
          >
            <v-autocomplete
              v-model="advogado.necessidade_especial"
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
              :disabled="readonly"
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
            sm="12"
          >
            <oab-dialog
              :object="advogado"
              :readonly="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <rg-dialog
              :object="advogado"
              :readonly="readonly"
              :endpoint="$endpoints.RG_ADVOGADO"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>
<script>
import { ID_BRASIL } from '@/shared/valoresAvulsos'
import FotoUpload from '@/components/FotoUpload.vue'
import RgDialog from '@/components/RgDialog.vue'
import OabDialog from '@/components/OabDialog.vue'

export default {
  components: {
    FotoUpload,
    RgDialog,
    OabDialog
  },
  props: ['advogado', 'errors', 'readonly', 'rules'],
  data: () => ({
    validaEstados: false,
    activePicker: null,
    date: null,
    dateFormatted: null,
    menu1: false,
    genero: [],
    raca: [],
    estadoCivil: [],
    grauInstrucao: [],
    profissao: [],
    orientacaoSexual: [],
    religiao: [],
    necessidadeEspecial: [],
    cidades: [],
    estados: [],
    paises: [],
    outros_nomes: [],
    vulgo: [],
    emails: []
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    }
  },
  watch: {
    menu1 (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    date() {
      this.advogado.data_nascimento = this.formatDate(this.date)
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  async mounted() {
    this.getEstados()
    this.getPaises()
    this.getGeneros()
    this.getRacas()
    this.getEstadoCivil()
    this.getGrauInstrucao()
    this.getOrientacaoSexual()
    this.getReligiao()
    this.getProfissao()
    this.getNecessidadeEspecial()
    this.exibeEstados()
    this.advogado.estado && this.getCidadesPorEstado(this.advogado.estado)
    this.date = this.advogado.data_nascimento
  },
  methods: {
    maxDate() {
      var date = new Date()
      date.setFullYear(date.getFullYear() - 18)
      return date.toISOString().slice(0,10)
    },
    
    onEstadoClear() {
      this.advogado.naturalidade = null
      this.cidades = []
    },
    exibeEstados() {
      if (
        this.advogado.nacionalidade &&
        this.advogado.nacionalidade.indexOf(ID_BRASIL) > -1
      ) {
        this.validaEstados = true
      } else {
        this.validaEstados = false
        this.advogado.estado = null
        this.advogado.naturalidade = null
      }
    },
    checkMaeDeclarado() {
      if (this.advogado.mae_nao_declarado) {
        this.advogado.nome_mae = null
      }
    },
    checkPaiDeclarado() {
      if (this.advogado.pai_nao_declarado) {
        this.advogado.nome_pai = null
      }
    },
    async getFotoId(id) {
      this.advogado.foto = id
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    async desvincularFoto() {
      this.advogado.foto = null
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.advogado.id && this.$emit('desvincularFoto')
    },
    clearFoto() {
      this.$refs.foto.forcarRemocaoArquivo()
    }
  }
  
}
</script>