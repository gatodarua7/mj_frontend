<template>
  <v-main>
    <barra-superior
      :titulo="$t('grau_instrucao.top.title')"
      :subtitulo="$t('grau_instrucao.top.subtitle')"
      :breadcrumbs="$t('grau_instrucao.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('grau_instrucao.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.GRAU_INSTRUCAO"
        router="grau-instrucao"
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
