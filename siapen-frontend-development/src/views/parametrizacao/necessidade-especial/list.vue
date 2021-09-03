<template>
  <v-main>
    <barra-superior
      :titulo="$t('necessidade_especial.top.title')"
      :subtitulo="$t('necessidade_especial.top.subtitle')"
      :breadcrumbs="$t('necessidade_especial.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('necessidade_especial.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.NECESSIDADE_ESPECIAL"
        router="necessidade-especial"
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
