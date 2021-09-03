<template>
  <v-main>
    <barra-superior
      :titulo="$t('titulo.top.title')"
      :subtitulo="$t('titulo.top.subtitle')"
      :breadcrumbs="$t('titulo.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('titulo.top.subtitle')"
        :headers="[
          { text: 'Norma Jurídica', value: 'norma_juridica_nome' },
          { text: 'Título', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.TITULO"
        router="titulo"
        :actions="['create', 'edit', 'delete']"
        :prompt="true"
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
