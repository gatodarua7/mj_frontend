<template>
  <v-main>
    <barra-superior
      :titulo="$t('genero.top.title')"
      :subtitulo="$t('genero.top.subtitle')"
      :breadcrumbs="$t('genero.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('genero.top.subtitle')"
        :headers="[
          { text: 'Descrição', value: 'descricao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.GENERO"
        router="genero"
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
