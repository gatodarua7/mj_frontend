<template>
  <v-main>
    <barra-superior
      :titulo="$t('grau_periculosidade.top.title')"
      :subtitulo="$t('grau_periculosidade.top.subtitle')"
      :breadcrumbs="$t('grau_periculosidade.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('grau_periculosidade.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'Observação', value: 'observacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.GRAU_PERICULOSIDADE"
        router="grau-periculosidade"
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
