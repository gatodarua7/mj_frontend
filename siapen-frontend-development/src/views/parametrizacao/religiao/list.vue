<template>
  <v-main>
    <barra-superior
      :titulo="$t('religiao.top.title')"
      :subtitulo="$t('religiao.top.subtitle')"
      :breadcrumbs="$t('religiao.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('religiao.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.RELIGIAO"
        router="religiao"
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
