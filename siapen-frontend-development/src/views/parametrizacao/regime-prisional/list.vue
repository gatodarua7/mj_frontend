<template>
  <v-main>
    <barra-superior
      :titulo="$t('regime_prisional.top.title')"
      :subtitulo="$t('regime_prisional.top.subtitle')"
      :breadcrumbs="$t('regime_prisional.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('regime_prisional.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.REGIME_PRISIONAL"
        router="regime-prisional"
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
