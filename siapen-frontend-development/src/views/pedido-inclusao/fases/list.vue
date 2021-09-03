<template>
  <v-main>
    <barra-superior
      :titulo="$t('fase.top.title')"
      :subtitulo="$t('fase.top.subtitle')"
      :breadcrumbs="$t('fase.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <v-card>
        <v-card-title>
          {{ $t('fase.top.subtitle') }}
          <v-chip
            class="ml-2"
            color="grey lighten-1"
            text-color="white"
            small
          >
            {{ totalItems }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
          >
            <template v-slot:[`item.action`]="{ item }">
              <v-toolbar-items>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="visualizar(item)"
                      v-on="on"
                    >
                      <v-icon>visibility</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="editar(item)"
                      v-on="on"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </v-toolbar-items>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as fasesService from '@/services/FasesService'

export default {

  data: () => ({
    headers: [
      { text: 'Grupo', value: 'grupo' },
      { text: 'Quantidade de Fases', value: 'total_fases' },
      { text: 'Ações', value: 'action', sortable: false }
    ],
    items: [],
    totalItems: null
  }),
  mounted() {
    fasesService
      .getGrupos()
      .then(res => {
        this.items = res.data.results
        this.totalItems = res.data.count
      })
  },
  methods: {
    visualizar(item) {
      this.$router.push(`fase/detalhes/${item.grupo}`)
    },
    editar(item) {
      this.$router.push(`fase/${item.grupo}`)
    }
  }
}
</script>
