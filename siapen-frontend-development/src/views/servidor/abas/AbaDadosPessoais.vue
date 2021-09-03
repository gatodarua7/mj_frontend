<template>
  <v-form v-model="rules.stepForm1">
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="12"
      >
        <foto-upload
          v-if="servidor"
          ref="foto"
          :photo-id="servidor.foto"
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
            sm="12"
          >
            <v-text-field
              v-model="servidor.nome"
              label="Nome"
              :counter="150"
              :error-messages="errors.nome"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="servidor.nome_social"
              label="Nome Social"
              :counter="150"
              :error-messages="errors.nome_social"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
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
                v-model="date"
                no-title
                locale="pt-br"
                @input="menu1 = false"
              />
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="servidor.cpf"
              v-mask="['###.###.###-##']"
              label="CPF"
              :error-messages="errors.cpf"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="servidor.rg"
              label="RG"
              :error-messages="errors.rg"
              :disabled="readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-show="servidor.rg"
              v-model="servidor.uf_rg"
              :items="ufs_rg"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="UF -RG"
              clearable
              @change="getOrgaosPorEstado(servidor.uf_rg)"
              @click:clear="onUfRgClear"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-autocomplete
              v-show="servidor.rg"
              v-model="servidor.orgao_expedidor"
              :items="orgaoExpedidor"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Órgão Expedidor"
              clearable
              :error-messages="errors.orgao_expedidor"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.genero"
              :items="genero"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="descricao"
              item-value="id"
              label="Gênero"
              clearable
              :error-messages="errors.genero"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.raca"
              :items="raca"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Raça"
              clearable
              :error-messages="errors.raca"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.estado_civil"
              :items="estadoCivil"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Estado Civil"
              clearable
              :error-messages="errors.estado_civil"
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
              v-model="servidor.nacionalidade"
              :items="paises"
              :disabled="readonly"
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
              v-model="servidor.estado"
              :items="estados"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="UF"
              clearable
              :error-messages="errors.estado"
              @change="getCidadesPorEstado(servidor.estado)"
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
              v-model="servidor.naturalidade"
              :items="cidades"
              :disabled="readonly"
              hide-no-data
              hide-selected
              item-text="nome_uf"
              item-value="id"
              label="Naturalidade"
              clearable
              :error-messages="errors.naturalidade"
            />
          </v-col>
          <v-col
            cols="12"
            md="8"
            sm="12"
          >
            <v-text-field
              v-model="servidor.nome_mae"
              label="Nome da mãe"
              :counter="150"
              :error-messages="errors.nome_mae"
              :disabled="servidor.mae_nao_declarado == true || readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="servidor.mae_nao_declarado"
              label="Não declarado"
              :disabled="readonly"
              :error-messages="errors.mae_nao_declarado"
              @change="checkMaeDeclarado"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="servidor.mae_falecido"
              label="Falecido"
              :disabled="readonly"
              :error-messages="errors.mae_falecido"
            />
          </v-col>
          <v-col
            cols="12"
            md="8"
            sm="12"
          >
            <v-text-field
              v-model="servidor.nome_pai"
              label="Nome do pai"
              :counter="150"
              :error-messages="errors.nome_pai"
              :disabled="servidor.pai_nao_declarado == true || readonly"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="servidor.pai_nao_declarado"
              label="Não declarado"
              :disabled="readonly"
              :error-messages="errors.pai_nao_declarado"
              @change="checkPaiDeclarado"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-checkbox
              v-model="servidor.pai_falecido"
              label="Falecido"
              :disabled="readonly"
              :error-messages="errors.pai_falecido"
            />
          </v-col>
          <v-col
            cols="12"
            md="12"
            sm="12"
          >
            <v-text-field
              v-model="servidor.email_pessoal"
              type="email"
              prepend-icon="mail"
              label="E-mail Pessoal"
              :disabled="readonly"
              :error-messages="errors.email_pessoal"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.grau_instrucao"
              :items="grauInstrucao"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Grau de Instrução"
              clearable
              :disabled="readonly"
              :error-messages="errors.grau_instrucao"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.orientacao_sexual"
              :items="orientacaoSexual"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Orientação Sexual"
              clearable
              :disabled="readonly"
              :error-messages="errors.orientacao_sexual"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.religiao"
              :items="religiao"
              hide-no-data
              hide-selected
              item-text="nome"
              item-value="id"
              label="Religião"
              clearable
              :disabled="readonly"
              :error-messages="errors.religiao"
            />
          </v-col>
          <v-col
            cols="12"
            md="12"
            sm="12"
          >
            <v-autocomplete
              v-model="servidor.necessidade_especial"
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
              :disabled="readonly"
              :error-messages="errors.necessidade_especial"
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
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import FotoUpload from '@/components/FotoUpload.vue'
import * as orgaoExpedidorService from '@/services/OrgaoExpedidorService'
import { ID_BRASIL } from '@/shared/valoresAvulsos'

export default {
  components: {
    FotoUpload
  },
  props: {
    servidor: Object,
    errors: Object,
    rules: Object,
    readonly: Boolean
  },
  data: () => ({    
    validaEstados: false,
    date: null,
    dateFormatted: null,
    menu1: false,
    genero: [],
    raca: [],
    estadoCivil: [],
    grauInstrucao: [],
    orientacaoSexual: [],
    religiao: [],
    necessidadeEspecial: [],
    cidades: [],
    estados: [],
    ufs_rg: [],
    paises: [],
    orgaoExpedidor: [],
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    },
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
      this.servidor.data_nascimento = this.dateFormatted
    },
  },
  mounted() {
    this.getEstados()
    this.getUfs()
    this.getPaises()
    this.getGeneros()
    this.getRacas()
    this.getEstadoCivil()
    this.getGrauInstrucao()
    this.getOrientacaoSexual()
    this.getReligiao()
    this.getNecessidadeEspecial()
    this.date = this.servidor.data_nascimento
    this.exibeEstados()
    this.servidor.estado && this.getCidadesPorEstado(this.servidor.estado)
    this.servidor.orgao_expedidor &&
      this.getUfOrgaoExpedidor(this.servidor.orgao_expedidor)
  },
  methods: {
    onUfRgClear() {
      this.servidor.orgao_expedidor = null
      this.orgaoExpedidor = []
    },
    onEstadoClear() {
      this.servidor.naturalidade = null
      this.cidades = []
    },
    onLotacaoClear() {
      this.servidor.lotacao = null
      this.servidor.lotacao_nome = null
    },
    onLotacaoTemporariaClear() {
      this.servidor.lotacao_temporaria = null
      this.servidor.lotacao_temporaria_nome = null
    },

    getUfs() {
      orgaoExpedidorService.getUfs().then(response => {
        this.ufs_rg = response.data.results
      })
    },

    exibeEstados() {
      if (
        this.servidor.nacionalidade &&
        this.servidor.nacionalidade.indexOf(ID_BRASIL) > -1
      ) {
        this.validaEstados = true
      } else {
        this.validaEstados = false
        this.servidor.estado = null
        this.servidor.naturalidade = null
      }
    },
    checkMaeDeclarado() {
      if (this.servidor.mae_nao_declarado) {
        this.servidor.nome_mae = null
      }
    },
    checkPaiDeclarado() {
      if (this.servidor.pai_nao_declarado) {
        this.servidor.nome_pai = null
      }
    },
    async getFotoId(id) {
      this.servidor.foto = id
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    async desvincularFoto() {
      this.servidor.foto = null
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.servidor.id && this.$emit('desvincularFoto')
    },
    getOrgaosPorEstado(uf) {
      orgaoExpedidorService.searchByUf(uf).then(res => {
        this.orgaoExpedidor = res.data.results
      })
    },
    getUfOrgaoExpedidor(id) {
      orgaoExpedidorService.getId(id).then(res => {
        this.servidor.uf_rg = res.data.estado
        this.getOrgaosPorEstado(this.servidor.uf_rg)
      })
    },
  }
}
</script>