<template>
  <v-card flat>
    <v-card-title>Dados Básicos</v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="rules.stepForm1"
      >
        <v-row>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <foto-upload
              ref="foto"
              :photo-id="visitante.foto"
              :readonly="readonly"
              :cant-delete="visitante.fase && visitante.fase!='INICIADO'"
              @updatePhotoId="getFotoId"
              @deletePhoto="desvincularFoto"
            />
            <div
              v-show="errors.foto"
              class="red--text"
            >
              {{ errors.foto }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="9"
            sm="12"
          >
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-text-field
                  v-model="visitante.nome"
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
                md="4"
                sm="12"
              >
                <v-text-field
                  v-model="visitante.idade"
                  label="Idade"
                  readonly
                  :disabled="readonly"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="12"
              >
                <v-autocomplete
                  v-model="visitante.genero"
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
                md="4"
                sm="12"
              >
                <v-autocomplete
                  v-model="visitante.nacionalidade"
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
                  v-model="visitante.estado"
                  :items="estados"
                  hide-no-data
                  hide-selected
                  item-text="nome"
                  item-value="id"
                  label="UF"
                  clearable
                  :error-messages="errors.estado"
                  :disabled="readonly"
                  @change="getCidadesPorEstado(visitante.estado)"
                  @click:clear="onEstadoClear"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="12"
              >
                <v-autocomplete
                  v-show="validaEstados && visitante.estado"
                  v-model="visitante.naturalidade"
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
                md="3"
                sm="12"
              >
                <v-text-field
                  v-model="visitante.cpf"
                  v-mask="['###.###.###-##']"
                  label="CPF"
                  :error-messages="errors.cpf"
                  :disabled="readonly"
                />
              </v-col>
              <v-col
                cols="12"
                md="9"
                sm="12"
              />
              <v-col
                cols="12"
                sm="12"
              >
                <v-combobox
                  v-model="visitante.emails"
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
          
              <v-col
                cols="12"
                sm="12"
              >
                <rg-dialog
                  :object="visitante"
                  :readonly="readonly"
                  :endpoint="$endpoints.RG_VISITANTE"
                />
              </v-col>
            </v-row>
          </v-col>
      
          <v-col
            cols="12"
            md="8"
            sm="12"
          >
            <v-text-field
              v-model="visitante.nome_mae"
              label="Nome da mãe"
              :counter="150"
              :error-messages="errors.nome_mae"
              :disabled="visitante.mae_nao_declarado == true || readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="visitante.mae_nao_declarado"
              label="Não declarado"
              :error-messages="errors.mae_nao_declarado"
              :disabled="readonly"
              @change="checkMaeDeclarado"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="visitante.mae_falecido"
              label="Falecido"
              :error-messages="errors.mae_falecido"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="8"
            sm="12"
          >
            <v-text-field
              v-model="visitante.nome_pai"
              label="Nome do pai"
              :counter="150"
              :error-messages="errors.nome_pai"
              :disabled="visitante.pai_nao_declarado == true || readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="visitante.pai_nao_declarado"
              label="Não declarado"
              :error-messages="errors.pai_nao_declarado"
              :disabled="readonly"
              @change="checkPaiDeclarado"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="visitante.pai_falecido"
              label="Falecido"
              :error-messages="errors.pai_falecido"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="visitante.grau_instrucao"
              :items="grauInstrucao"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Grau de Instrução"
              clearable
              :error-messages="errors.grau_instrucao"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="visitante.profissao"
              :items="profissao"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Profissão"
              clearable
              :error-messages="errors.profissao"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          />
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="visitante.necessidade_especial"
              :items="necessidadeEspecial"
              chips
              small-chips
              multiple
              color="blue"
              item-color="primary"
              hide-no-data
              item-text="nome"
              item-value="id"
              label="Necessidade Especial"
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
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="visitante.estado_civil"
              :items="estadoCivil"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Estado Civil"
              clearable
              :error-messages="errors.estado_civil"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-text-field
              v-model="visitante.numero_sei"
              v-mask="['#####.######/####-##']"
              label="Nº Processo SEI"
              :error-messages="errors.numero_sei"
              :disabled="readonly"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import { ID_BRASIL } from '@/shared/valoresAvulsos'
import FotoUpload from '@/components/FotoUpload.vue'
import RgDialog from '@/components/RgDialog.vue'

export default {
  components: {
    FotoUpload,
    RgDialog
  },
  props: ['visitante', 'errors', 'readonly', 'rules'],
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
      this.visitante.data_nascimento = this.formatDate(this.date)
      this.setIdade(this.date)
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
    this.visitante.estado && this.getCidadesPorEstado(this.visitante.estado)
    this.date = this.visitante.data_nascimento
  },
  methods: {
    maxDate() {
      var date = new Date()
      date.setFullYear(date.getFullYear())
      return date.toISOString().slice(0,10)
    },
    setIdade(data_nascimento) {
      if(data_nascimento && data_nascimento.length == 10) {
        var today = new Date()
        var birthDate = new Date(data_nascimento)
        var age = today.getFullYear() - birthDate.getFullYear()
        var m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        this.visitante.idade = age
      }
    },
    onEstadoClear() {
      this.visitante.naturalidade = null
      this.cidades = []
    },
    exibeEstados() {
      if (
        this.visitante.nacionalidade &&
        this.visitante.nacionalidade.indexOf(ID_BRASIL) > -1
      ) {
        this.validaEstados = true
      } else {
        this.validaEstados = false
        this.visitante.estado = null
        this.visitante.naturalidade = null
      }
    },
    checkMaeDeclarado() {
      if (this.visitante.mae_nao_declarado) {
        this.visitante.nome_mae = null
      }
    },
    checkPaiDeclarado() {
      if (this.visitante.pai_nao_declarado) {
        this.visitante.nome_pai = null
      }
    },
    async getFotoId(id) {
      this.visitante.foto = id
      await new Promise(resolve => setTimeout(resolve, 500))
      this.$emit('updatePhotoId')
    },
    async desvincularFoto() {
      this.visitante.foto = null
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.$emit('desvincularFoto')
    },
    clearFoto() {
      this.$refs.foto.forcarRemocaoArquivo()
    },
    async limpar(){
      this.$refs.form.reset()
      this.visitante.foto && this.$refs.foto.removerArquivo()
      await new Promise(resolve => setTimeout(resolve, 500))
      this.visitante.rgs = []
      this.visitante.data_nascimento = null
      this.visitante.idade = null
    }
  }
  
}
</script>