<template>
  <v-main>
    <barra-superior
      :titulo="$t('estado_civil.top.title')"
      :subtitulo="$t('estado_civil.top.subtitle')"
      :breadcrumbs="$t('estado_civil.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('estado_civil.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.ESTADO_CIVIL"
        router="estado-civil"
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
