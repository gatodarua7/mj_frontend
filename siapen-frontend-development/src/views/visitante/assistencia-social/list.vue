<template>
  <v-main>
    <barra-superior
      titulo="Gestão Penitenciária"
      subtitulo="Cadastro de Visitante"
      :breadcrumbs="breadcrumbs"
    />
    <v-container fluid>
      <v-row>
        <v-col
          cols="12"
          md="12"
          class="d-flex flex-row-reverse"
        >
          <v-btn
            color="blue darken-2"
            class="mb-2"
            text
            @click="cadastrarVisitante"
          >
            <v-icon>add</v-icon>
            <span>Incluir</span>
          </v-btn>
        </v-col>
      </v-row>
      <data-table-visitantes
        title="Cadastro de Visitante"
        :headers="[
          { text: '', value: 'thumbnail' },
          { text: 'Nome', value: 'nome' },
          { text: 'Data de Nascimento', value: 'data_nascimento' },
          { text: 'CPF', value: 'cpf' },
          { text: 'Atendimento', value: 'atendimento' },
          { text: 'Fase', value: 'fase' },
          { text: 'Solicitante informado', value: 'solicitante_informado' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :actions="[]"
      />
    </v-container>
  </v-main>
</template>

<script>
import DataTableVisitantes from '../components/DataTableVisitantes.vue'

export default {
  components: { DataTableVisitantes },
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        to: '/',
        exact: true
      },
      {
        text: 'Assistência Social',
        to: '/visitante/assistencia',
        exact: true
      }
    ],
  }),
  methods: {
    cadastrarVisitante() {
      this.$router.push('/visitante/cadastro')
    }
  }
}
</script>
