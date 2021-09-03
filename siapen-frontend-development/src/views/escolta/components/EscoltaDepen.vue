<template>
  <v-card flat>
    <v-card-text>
      <v-tabs v-model="tabs">
        <v-tab>
          <v-icon class="mr-2">
            flight
          </v-icon> Aérea
        </v-tab>
        <v-tab>
          <v-icon class="mr-2">
            directions_car
          </v-icon> Terrestre
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tabs"
        class="mt-3"
      >
        <v-tab-item>
          <v-row>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-menu
                ref="pickerDataInicio"
                v-model="pickerDataInicio"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                :disabled="readonly"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dataInicio"
                    v-mask="['##/##/####']"
                    label="Data Início"
                    hint="DD/MM/AAAA"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    :error-messages="errors.data_inicio_aerea"
                    :disabled="readonly"
                    readonly
                    clearable
                    @blur="dataInicioAereaDepen = parseDate(dataInicio)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataInicioAereaDepen"
                  no-title
                  locale="pt-br"
                  :disabled="readonly"
                  @input="pickerDataInicio = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-text-field
                v-model="object.hora_inicio_aerea"
                type="time"
                label="Hora Início"
                :disabled="readonly"
                :error-messages="errors.hora_inicio_aerea"
                clearable
              />
            </v-col>
            
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-menu
                ref="pickerDataFim"
                v-model="pickerDataFim"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                :disabled="readonly"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dataFim"
                    v-mask="['##/##/####']"
                    label="Data Fim"
                    hint="DD/MM/AAAA"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    :error-messages="errors.data_fim_aerea"
                    :disabled="readonly"
                    readonly
                    clearable
                    @blur="dataFimAereaDepen = parseDate(dataFim)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataFimAereaDepen"
                  no-title
                  locale="pt-br"
                  :disabled="readonly"
                  @input="pickerDataFim = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-text-field
                v-model="object.hora_fim_aerea"
                type="time"
                label="Hora Fim"
                :disabled="readonly"
                clearable
                :error-messages="errors.hora_fim_aerea"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <v-autocomplete
                v-model="object.tipo_aeronave"
                :error-messages="errors.tipo_aeronave"
                :items="tipoAeronave"
                item-text="text"
                item-value="value"
                label="Aeronave"
                :disabled="readonly"
              />
            </v-col>
            <v-col
              v-if="object.tipo_aeronave == 'COMERCIAL'"
              cols="12"
              sm="12"
            >
              <v-text-field
                v-model="numero_voo"
                label="Nº do Vôo"
                append-outer-icon="add"
                :disabled="readonly"
                :counter="20"
                @click:append-outer="adicionaVoo"
              />
            </v-col>
            <v-col
              v-if="object.tipo_aeronave == 'COMERCIAL'"
              cols="12"
              sm="12"
            >
              <v-data-table
                :headers="headersVoo"
                :items="object.voos"
                hide-default-footer
              >
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
                          @click="excluirVoo(item)"
                          v-on="on"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>
                  </v-toolbar-items>
                </template>
              </v-data-table>
            </v-col>
            <v-col
              v-if="object.tipo_aeronave == 'INSTITUCIONAL'"
              cols="12"
              sm="12"
            >
              <v-autocomplete
                v-model="object.instituicao"
                :error-messages="errors.instituicao"
                :items="instituicoes"
                item-text="text"
                item-value="value"
                label="Instituição"
                :disabled="readonly"
              />
            </v-col>
            <v-col
              v-if="object.tipo_aeronave == 'INSTITUCIONAL'"
              cols="12"
              sm="12"
            >
              <v-textarea
                v-model="object.descricao_aerea"
                :error-messages="errors.descricao_aerea"
                label="Descrição"
                filled
                :disabled="readonly"
                :counter="500"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <search-servidores
                :items="object.servidores_escolta_aerea"
                :readonly="readonly"
                @atualizarServidores="atualizarServidoresAereoDEPEN"
                @desvincularServidores="desvincularServidoresAereoDEPEN"
              />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-menu
                ref="pickerDataInicioTerrestre"
                v-model="pickerDataInicioTerrestre"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                :disabled="readonly"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dataInicioTerrestre"
                    v-mask="['##/##/####']"
                    label="Data Início"
                    hint="DD/MM/AAAA"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    :error-messages="errors.data_inicio_terrestre"
                    :disabled="readonly"
                    readonly
                    clearable
                    @blur="dataInicioTerrestreDepen = parseDate(dataInicioTerrestre)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataInicioTerrestreDepen"
                  no-title
                  locale="pt-br"
                  :disabled="readonly"
                  @input="pickerDataInicioTerrestre = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-text-field
                v-model="object.hora_inicio_terrestre"
                type="time"
                label="Hora Início"
                :disabled="readonly"
                clearable
                :error-messages="errors.hora_inicio_terrestre"
              />
            </v-col>
            
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-menu
                ref="pickerDataFimTerrestre"
                v-model="pickerDataFimTerrestre"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                :disabled="readonly"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dataFimTerrestre"
                    v-mask="['##/##/####']"
                    label="Data Fim"
                    hint="DD/MM/AAAA"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    :error-messages="errors.data_fim_terrestre"
                    :disabled="readonly"
                    readonly
                    clearable
                    @blur="dataFimTerrestreDepen = parseDate(dataFimTerrestre)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataFimTerrestreDepen"
                  no-title
                  locale="pt-br"
                  :disabled="readonly"
                  @input="pickerDataFimTerrestre = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              md="6"
              sm="12"
            >
              <v-text-field
                v-model="object.hora_fim_terrestre"
                type="time"
                label="Hora Fim"
                :disabled="readonly"
                clearable
                :error-messages="errors.hora_fim_terrestre"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <search-servidores
                :items="object.servidores_escolta_terrestre"
                :readonly="readonly"
                @atualizarServidores="atualizarServidoresTerrestreDEPEN"
                @desvincularServidores="desvincularServidoresTerrestreDEPEN"
              />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import SearchServidores from './SearchServidores.vue'

export default {
  components: { SearchServidores },
  props: {
    object: Object,
    errors: Object,
    readonly: Boolean
  },
  data: () => ({
    tabs: null,
    tipoAeronave: [
      {text: 'Comercial', value: 'COMERCIAL'},
      {text: 'Institucional', value: 'INSTITUCIONAL'},
    ],
    numero_voo: null,
    headersVoo: [
      { text: 'Nº Vôo', value: 'numero_voo' },
      { text: 'Ações', value: 'action', sortable: false },
    ],

    
    instituicoes: [
      { text: 'Força Aérea Brasileira', value: 'FAB' },
      { text: 'Polícia Federal', value: 'PF' },
      { text: 'Polícia Rodoviária Federal', value: 'PRF' },
      { text: 'Polícia Civil', value: 'PC' },
      { text: 'Outros', value: 'OUTROS' },
    ],

    dataInicioAereaDepen: null,
    dataInicio: null,
    pickerDataInicio: false,
    
    dataFimAereaDepen: null,
    dataFim: null,
    pickerDataFim: false,

    dataInicioTerrestreDepen: null,
    dataInicioTerrestre: null,
    pickerDataInicioTerrestre: false,
    
    dataFimTerrestreDepen: null,
    dataFimTerrestre: null,
    pickerDataFimTerrestre: false,
  }),
  computed: {
    computedDataInicio() {
      return this.formatDate(this.dataInicioAereaDepen)
    },
    computedDataFim() {
      return this.formatDate(this.dataFimAereaDepen)
    },
    computedDataInicioTerrestre() {
      return this.formatDate(this.dataInicioTerrestreDepen)
    },
    computedDataFimTerrestre() {
      return this.formatDate(this.dataFimTerrestreDepen)
    },
  },
  watch: {
    dataInicioAereaDepen() {
      this.dataInicio = this.formatDate(this.dataInicioAereaDepen)
      this.object.data_inicio_aerea = this.dataInicio
    },
    dataFimAereaDepen() {
      this.dataFim = this.formatDate(this.dataFimAereaDepen)
      this.object.data_fim_aerea = this.dataFim
    },
    dataInicioTerrestreDepen() {
      this.dataInicioTerrestre = this.formatDate(this.dataInicioTerrestreDepen)
      this.object.data_inicio_terrestre = this.dataInicioTerrestre
    },
    dataFimTerrestreDepen() {
      this.dataFimTerrestre = this.formatDate(this.dataFimTerrestreDepen)
      this.object.data_fim_terrestre = this.dataFimTerrestre
    }
  },
  mounted() {
    this.dataInicioAereaDepen = this.object.data_inicio_aerea
    this.dataFimAereaDepen = this.object.data_fim_aerea
    this.dataInicioTerrestreDepen = this.object.data_inicio_terrestre
    this.dataFimTerrestreDepen = this.object.data_fim_terrestre
  },
  methods: {
    adicionaVoo() {
      this.object.voos.push({numero_voo: this.numero_voo})
      this.numero_voo = null
    },
    excluirVoo(item) {
      const index = this.object.voos.indexOf(item)
      this.object.voos.splice(index, 1)
    },
    atualizarServidoresAereoDEPEN(item) {
      this.object.servidores_escolta_aerea.push(item)
    },
    desvincularServidoresAereoDEPEN(item) {      
      const index = this.object.servidores_escolta_aerea.indexOf(item)
      this.object.servidores_escolta_aerea.splice(index, 1)
    },
    atualizarServidoresTerrestreDEPEN(item) {
      this.object.servidores_escolta_terrestre.push(item)
    },
    desvincularServidoresTerrestreDEPEN(item) {      
      const index = this.object.servidores_escolta_terrestre.indexOf(item)
      this.object.servidores_escolta_terrestre.splice(index, 1)
    }
  }
}
</script>