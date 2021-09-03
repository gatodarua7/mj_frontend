<template>
  <v-main>
    <barra-superior
      titulo="Inteligência"
      subtitulo="Grupo de Alocação"
      :breadcrumbs="[
        {
          text: 'Dashboard',
          to: '/',
          exact: true
        },
        {
          text: 'Inteligência',
          disabled: true
        },
        {
          text: 'Grupo de Alocação',
          disabled: true
        },
      ]"
    />

    <v-container fluid>
      <VTable
        subtitle="Grupo de Alocação"
        :headers="[
          { text: 'Facção', value: 'faccao_nome' },
          { text: 'Grupo', value: 'nome' },
          { text: 'Observação', value: 'observacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.FACCAO_GRUPO"
        :sort="[
          { text: 'faccao_nome', value: 'faccao__nome'}
        ]"
        router="faccao-grupo"
        :actions="['create', 'edit', 'delete']"
      />
    </v-container>
  </v-main>
</template>

<script>
import VTable from '@/components/VTable'

export default {
  components: { VTable },
}
</script>


