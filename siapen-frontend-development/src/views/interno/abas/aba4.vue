<template>
  <v-expansion-panels :multiple="true">
    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_cutis ? 'red--text' : ''">
            Cutis
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_cutis"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              class="ml-0"
              :src="require('@/assets/caracteristicas/cutis_branca.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Branca
              <input
                v-model="interno.caracteristicas_cutis"
                type="radio"
                :disabled="readonly"
                value="BRANCA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cutis_amarela.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Amarela
              <input
                v-model="interno.caracteristicas_cutis"
                type="radio"
                :disabled="readonly"
                value="AMARELA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cutis_parda.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Parda
              <input
                v-model="interno.caracteristicas_cutis"
                type="radio"
                :disabled="readonly"
                value="PARDA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cutis_preta.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Preta
              <input
                v-model="interno.caracteristicas_cutis"
                type="radio"
                :disabled="readonly"
                value="PRETA"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_cor_cabelo ? 'red--text' : ''">
            Cor dos cabelos
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_cor_cabelo"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_preto.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Preto
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="PRETO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_castanho.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Castanho
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="CASTANHO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_ruivo.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Ruivo
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="RUIVO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_loiro.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Loiro
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="LOIRO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_grisalho.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Grisalho
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="GRISALHO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="6"
          >
            <v-img
              :src="require('@/assets/caracteristicas/cabelo_branco.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Branco
              <input
                v-model="interno.caracteristicas_cor_cabelo"
                type="radio"
                :disabled="readonly"
                value="BRANCO"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_tipo_cabelo ? 'red--text' : ''">
            Tipo de cabelo
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_tipo_cabelo"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_cabelo_liso.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Liso
              <input
                v-model="interno.caracteristicas_tipo_cabelo"
                type="radio"
                :disabled="readonly"
                value="LISO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_cabelo_crespo.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Crespo
              <input
                v-model="interno.caracteristicas_tipo_cabelo"
                type="radio"
                :disabled="readonly"
                value="CRESPO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_cabelo_ondulado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Ondulado
              <input
                v-model="interno.caracteristicas_tipo_cabelo"
                type="radio"
                :disabled="readonly"
                value="ONDULADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_cabelo_carapinha.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio">
              Carapinha
              <input
                v-model="interno.caracteristicas_tipo_cabelo"
                type="radio"
                :disabled="readonly"
                value="CARAPINHA"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_tipo_rosto ? 'red--text' : ''">
            Tipo de rosto
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_tipo_rosto"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_rosto_achatado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Achatado
              <input
                v-model="interno.caracteristicas_tipo_rosto"
                type="radio"
                :disabled="readonly"
                value="ACHATADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_rosto_comprido.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Comprido
              <input
                v-model="interno.caracteristicas_tipo_rosto"
                type="radio"
                :disabled="readonly"
                value="COMPRIDO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_rosto_ovalado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Ovalado
              <input
                v-model="interno.caracteristicas_tipo_rosto"
                type="radio"
                :disabled="readonly"
                value="OVALADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_rosto_quadrado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Quadrado
              <input
                v-model="interno.caracteristicas_tipo_rosto"
                type="radio"
                :disabled="readonly"
                value="QUADRADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_rosto_redondo.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Redondo
              <input
                v-model="interno.caracteristicas_tipo_rosto"
                type="radio"
                :disabled="readonly"
                value="REDONDO"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_tipo_testa ? 'red--text' : ''">
            Tipo de testa
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_tipo_testa"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="4"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_testa_alta.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Alta
              <input
                v-model="interno.caracteristicas_tipo_testa"
                type="radio"
                :disabled="readonly"
                value="ALTA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="4"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_testa_com_entradas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Com entradas
              <input
                v-model="interno.caracteristicas_tipo_testa"
                type="radio"
                :disabled="readonly"
                value="COM_ENTRADAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="4"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_testa_curta.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Curta
              <input
                v-model="interno.caracteristicas_tipo_testa"
                type="radio"
                :disabled="readonly"
                value="CURTA"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_sobrancelhas ? 'red--text' : ''">
            Sobrancelhas
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_sobrancelhas"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_aparadas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Aparadas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="APARADAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_finas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Finas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="FINAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_grossas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Grossas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="GROSSAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_pintadas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Pintadas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="PINTADAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_separadas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Separadas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="SEPARADAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/sobrancelhas_unidas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Unidas
              <input
                v-model="interno.caracteristicas_sobrancelhas"
                type="radio"
                :disabled="readonly"
                value="UNIDAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_tipo_olhos ? 'red--text' : ''">
            Tipo de olhos
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_tipo_olhos"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_olhos_fundos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Fundos
              <input
                v-model="interno.caracteristicas_tipo_olhos"
                type="radio"
                :disabled="readonly"
                value="FUNDOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_olhos_grandes.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Grandes
              <input
                v-model="interno.caracteristicas_tipo_olhos"
                type="radio"
                :disabled="readonly"
                value="GRANDES"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_olhos_orientais.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Orientais
              <input
                v-model="interno.caracteristicas_tipo_olhos"
                type="radio"
                :disabled="readonly"
                value="ORIENTAIS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_olhos_pequenos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Pequenos
              <input
                v-model="interno.caracteristicas_tipo_olhos"
                type="radio"
                :disabled="readonly"
                value="PEQUENOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/tipo_olhos_saltados.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Saltados
              <input
                v-model="interno.caracteristicas_tipo_olhos"
                type="radio"
                :disabled="readonly"
                value="SALTADOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_cor_olhos ? 'red--text' : ''">
            Cor dos olhos
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_cor_olhos"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_pretos.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Pretos
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="PRETOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_castanhos.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Castanhos
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="CASTANHO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_azuis.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Azuis
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="AZUIS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_verdes.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Verdes
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="VERDES"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_duas_cores.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Duas cores
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="DUAS_CORES"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_indef_claros.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Indefinidos Claros
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="INDEFINIDOS_CLAROS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/olhos_indef_escuros.jpg')"
              aspect-ratio="1"
              max-width="291"
              max-height="117"
            />
            <br>
            <label class="radio">
              Indefinidos Escuros
              <input
                v-model="interno.caracteristicas_cor_olhos"
                type="radio"
                :disabled="readonly"
                value="INDEFINIDOS_ESCUROS"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_nariz ? 'red--text' : ''">
            Nariz
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_nariz"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_achatado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Achatado
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="ACHATADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_adunco.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Andunco
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="ADUNCO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_afilado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Afilado
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="AFILADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_arrebitado.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Arrebitado
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="ARREBITADO"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_grande.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Grande
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="GRANDE"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_medio.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Médio
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="MEDIO"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/nariz_pequeno.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Pequeno
              <input
                v-model="interno.caracteristicas_nariz"
                type="radio"
                :disabled="readonly"
                value="PEQUENO"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_orelhas ? 'red--text' : ''">
            Orelhas
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_orelhas"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/orelhas_grandes.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Grandes
              <input
                v-model="interno.caracteristicas_orelhas"
                type="radio"
                :disabled="readonly"
                value="GRANDES"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/orelhas_medias.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Médias
              <input
                v-model="interno.caracteristicas_orelhas"
                type="radio"
                :disabled="readonly"
                value="MEDIAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/orelhas_pequenas.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Pequenas
              <input
                v-model="interno.caracteristicas_orelhas"
                type="radio"
                :disabled="readonly"
                value="PEQUENAS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/orelhas_lobulos_fechados.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Lóbulos fechados
              <input
                v-model="interno.caracteristicas_orelhas"
                type="radio"
                :disabled="readonly"
                value="LOBULOS_FECHADOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/orelhas_lobulos_abertos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Lóbulos abertos
              <input
                v-model="interno.caracteristicas_orelhas"
                type="radio"
                :disabled="readonly"
                value="LOBULOS_ABERTOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_labios ? 'red--text' : ''">
            Lábios
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_labios"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/labios_finos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Finos
              <input
                v-model="interno.caracteristicas_labios"
                type="radio"
                :disabled="readonly"
                value="FINOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/labios_medios.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Médios
              <input
                v-model="interno.caracteristicas_labios"
                type="radio"
                :disabled="readonly"
                value="MEDIOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/labios_grossos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Grossos
              <input
                v-model="interno.caracteristicas_labios"
                type="radio"
                :disabled="readonly"
                value="GROSSOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="3"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/labios_leporinos.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Leporinos
              <input
                v-model="interno.caracteristicas_labios"
                type="radio"
                :disabled="readonly"
                value="LEPORINOS"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header
        class="subtitle-1"
      >
        <template v-slot:default>
          <div :class="errors.caracteristicas_compleicao ? 'red--text' : ''">
            Compleição
          </div>
        </template>
        <template v-slot:actions>
          <v-icon
            v-if="errors.caracteristicas_compleicao"
            color="error"
          >
            mdi-alert-circle
          </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/compleicao_gorda.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Gorda
              <input
                v-model="interno.caracteristicas_compleicao"
                type="radio"
                :disabled="readonly"
                value="GORDA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/compleicao_media.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Média
              <input
                v-model="interno.caracteristicas_compleicao"
                type="radio"
                :disabled="readonly"
                value="MEDIA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/compleicao_magra.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Magra
              <input
                v-model="interno.caracteristicas_compleicao"
                type="radio"
                :disabled="readonly"
                value="MAGRA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/compleicao_musculosa.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Musculosa
              <input
                v-model="interno.caracteristicas_compleicao"
                type="radio"
                :disabled="readonly"
                value="MUSCULOSA"
              >
              <span class="checkmark" />
            </label>
          </v-col>

          <v-col
            cols="12"
            lg="2"
            sm="12"
          >
            <v-img
              :src="require('@/assets/caracteristicas/compleicao_raquitica.png')"
              aspect-ratio="1"
              max-width="230"
              max-height="260"
            />
            <br>
            <label class="radio ml-12">
              Raquítica
              <input
                v-model="interno.caracteristicas_compleicao"
                type="radio"
                :disabled="readonly"
                value="RAQUITICA"
              >
              <span class="checkmark" />
            </label>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  props: ['interno', 'errors', 'readonly', 'rules']
}
</script>