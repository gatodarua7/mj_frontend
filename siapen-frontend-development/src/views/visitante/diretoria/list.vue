<template>
  <v-main>
    <barra-superior
      titulo="Gestão Penitenciária"
      subtitulo="Cadastro de Visitante"
      :breadcrumbs="breadcrumbs"
    />
    <v-container fluid>
      <data-table-visitantes
        title="Aguardando análise"
        :headers="[
          { text: '', value: 'thumbnail' },
          { text: 'Nome', value: 'nome' },
          { text: 'Data de Nascimento', value: 'data_nascimento' },
          { text: 'CPF', value: 'cpf' },
          { text: 'Atendimento', value: 'atendimento' },
          { text: 'Fase', value: 'fase' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        fase="ANALISE_DIRETORIA,RECURSO_EM_ANALISE"
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
        text: 'Análise da Diretoria',
        to: '/visitante/diretoria',
        exact: true
      }
    ]
  })
}
</script>
