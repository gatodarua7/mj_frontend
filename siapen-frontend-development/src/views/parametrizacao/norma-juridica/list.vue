<template>
  <v-main>
    <barra-superior
      :titulo="$t('norma_juridica.top.title')"
      :subtitulo="$t('norma_juridica.top.subtitle')"
      :breadcrumbs="$t('norma_juridica.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('norma_juridica.top.subtitle')"
        :headers="[
          { text: 'Norma Jurídica', value: 'norma_juridica_nome' },
          { text: 'Título', value: 'titulo_nome' },
          { text: 'Descrição', value: 'descricao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.NORMA_JURIDICA"
        router="norma-juridica"
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
