<template>
  <v-main>
    <barra-superior
      :titulo="$t('funcao.top.title')"
      :subtitulo="$t('funcao.top.subtitle')"
      :breadcrumbs="$t('funcao.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('funcao.top.subtitle')"
        :headers="[
          { text: 'Função', value: 'descricao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.FUNCAO"
        router="funcao"
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
