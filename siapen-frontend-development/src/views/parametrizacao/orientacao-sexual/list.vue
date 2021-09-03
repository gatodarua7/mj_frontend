<template>
  <v-main>
    <barra-superior
      :titulo="$t('orientacao_sexual.top.title')"
      :subtitulo="$t('orientacao_sexual.top.subtitle')"
      :breadcrumbs="$t('orientacao_sexual.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('orientacao_sexual.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.ORIENTACAO_SEXUAL"
        router="orientacao-sexual"
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
