<template>
  <v-main>
    <barra-superior
      :titulo="$t('orgao_expedidor.top.title')"
      :subtitulo="$t('orgao_expedidor.top.subtitle')"
      :breadcrumbs="$t('orgao_expedidor.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('orgao_expedidor.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'Estado', value: 'estado_sigla' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.ORGAO_EXPEDIDOR"
        router="orgao-expedidor"
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
