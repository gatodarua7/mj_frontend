<template>
  <v-main>
    <barra-superior
      :titulo="$t('defeito.top.title')"
      :subtitulo="$t('defeito.top.subtitle')"
      :breadcrumbs="$t('defeito.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('defeito.top.subtitle')"
        :headers="[
          { text: 'Descrição', value: 'descricao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.DEFEITO"
        router="defeito"
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


