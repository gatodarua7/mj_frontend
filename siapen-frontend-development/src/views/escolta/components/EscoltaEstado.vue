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
                    @blur="dataInicioAereaEstado = parseDate(dataInicio)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataInicioAereaEstado"
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
                clearable
                :error-messages="errors.hora_inicio_aerea"
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
                    @blur="dataFimAereaEstado = parseDate(dataFim)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataFimAereaEstado"
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
              <v-textarea
                v-model="object.descricao_aerea"
                :error-messages="errors.descricao_aerea"
                label="Descrição"
                filled
                :disabled="readonly"
                :counter="500"
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
                    @blur="dataInicioTerrestreEstado = parseDate(dataInicioTerrestre)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataInicioTerrestreEstado"
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
                    @blur="dataFimTerrestreEstado = parseDate(dataFimTerrestre)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dataFimTerrestreEstado"
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
                label="Hora Fim Terrestre"
                :disabled="readonly"
                clearable
                :error-messages="errors.hora_fim_terrestre"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <v-textarea
                v-model="object.descricao_terrestre"
                :error-messages="errors.descricao_terrestre"
                label="Descrição"
                filled
                :disabled="readonly"
                :counter="500"
              />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  props: {
    object: Object,
    errors: Object,
    readonly: Boolean
  },
  data: () => ({
    tabs: null,

    dataInicioAereaEstado: null,
    dataInicio: null,
    pickerDataInicio: false,
    
    dataFimAereaEstado: null,
    dataFim: null,
    pickerDataFim: false,

    dataInicioTerrestreEstado: null,
    dataInicioTerrestre: null,
    pickerDataInicioTerrestre: false,
    
    dataFimTerrestreEstado: null,
    dataFimTerrestre: null,
    pickerDataFimTerrestre: false,
  }),
  computed: {
    computedDataInicioAereaEstado() {
      return this.formatDate(this.dataInicioAereaEstado)
    },
    computedDataFimAereaEstado() {
      return this.formatDate(this.dataFimAereaEstado)
    },
    computedDataInicioTerrestreEstado() {
      return this.formatDate(this.dataInicioTerrestreEstado)
    },
    computedDataFimTerrestreEstado() {
      return this.formatDate(this.dataFimTerrestreEstado)
    },
  },
  watch: {
    dataInicioAereaEstado() {
      this.dataInicio = this.formatDate(this.dataInicioAereaEstado)
      this.object.data_inicio_aerea = this.dataInicio
    },
    dataFimAereaEstado() {
      this.dataFim = this.formatDate(this.dataFimAereaEstado)
      this.object.data_fim_aerea = this.dataFim
    },
    dataInicioTerrestreEstado() {
      this.dataInicioTerrestre = this.formatDate(this.dataInicioTerrestreEstado)
      this.object.data_inicio_terrestre = this.dataInicioTerrestre
    },
    dataFimTerrestreEstado() {
      this.dataFimTerrestre = this.formatDate(this.dataFimTerrestreEstado)
      this.object.data_fim_terrestre = this.dataFimTerrestre
    }
  },
  mounted() {
    this.dataInicioAereaEstado = this.object.data_inicio_aerea
    this.dataFimAereaEstado = this.object.data_fim_aerea
    this.dataInicioTerrestreEstado = this.object.data_inicio_terrestre
    this.dataFimTerrestreEstado = this.object.data_fim_terrestre
  }
}
</script>