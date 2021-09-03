<template>
  <v-main>
    <barra-superior
      :titulo="$t('fase.top.title')"
      :subtitulo="$t('fase.top.subtitle')"
      :breadcrumbs="$t('fase.top.breadcrumbsVisualizar')"
    />
    <v-container fluid>
      <v-card>
        <v-card-title>
          Grupo: {{ grupo }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-data-table
                :headers="headers"
                :items="fases"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:[`item.ultima_fase`]="{ item }">
                  {{ item.ultima_fase ? "Sim" : "Não" }}
                </template>
                <template v-slot:[`item.ativo`]="{ item }">
                  {{ item.ativo ? "Sim" : "Não" }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="blue darken-1"
            text
            @click="sair"
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as fasesService from '@/services/FasesService'

export default {
  data: () => ({
    grupo: null,
    headers: [
      { text: 'Ordenação', value: 'ordem', sortable: false },
      { text: 'Nome', value: 'nome', sortable: false },
      { text: 'Última fase ?', value: 'ultima_fase', sortable: false },
      { text: 'Ativo', value: 'ativo', sortable: false },
    ],
    fases: [],
  }),
  mounted() {
    this.grupo = this.$route.params.grupo
    fasesService.getAllByGrupo(this.grupo).then((res) => {
      this.fases = res.data.results
    })
  }
}
</script>