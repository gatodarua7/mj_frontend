<template>
  <v-main>
    <barra-superior
      :titulo="$t('telefone.top.title')"
      :subtitulo="$t('telefone.top.subtitle')"
      :breadcrumbs="$t('telefone.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('telefone.top.subtitle')"
        :headers="[
          { text: 'Tipo', value: 'tipo' },
          { text: 'Número', value: 'numero' },
          { text: 'Andar', value: 'andar' },
          { text: 'Sala', value: 'sala' },
          { text: 'Observação', value: 'observacao' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.TELEFONE"
        router="telefone"
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
