<template>
  <v-main>
    <barra-superior
      :titulo="$t('vinculo.top.title')"
      :subtitulo="$t('vinculo.top.subtitle')"
      :breadcrumbs="$t('vinculo.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('vinculo.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.TIPO_VINCULO"
        router="vinculo"
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
