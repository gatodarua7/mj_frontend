<template>
  <v-main>
    <barra-superior
      :titulo="$t('profissao.top.title')"
      :subtitulo="$t('profissao.top.subtitle')"
      :breadcrumbs="$t('profissao.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('profissao.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.PROFISSAO"
        router="profissao"
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
