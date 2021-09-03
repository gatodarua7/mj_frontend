<template>
  <v-main>
    <barra-superior
      :titulo="$t('comportamento_interno.top.title')"
      :subtitulo="$t('comportamento_interno.top.subtitle')"
      :breadcrumbs="$t('comportamento_interno.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('comportamento_interno.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.COMPORTAMENTO_INTERNO"
        router="comportamento-interno"
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
