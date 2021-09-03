<template>
  <v-main>
    <barra-superior
      :titulo="$t('faccao.top.title')"
      :subtitulo="$t('faccao.top.subtitle')"
      :breadcrumbs="$t('faccao.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('faccao.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'País', value: 'pais_nome' },
          { text: 'Estado', value: 'estado_nome' },
          { text: 'Observação', value: 'observacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.FACCAO"
        router="faccao"
        :actions="['create', 'edit', 'delete']"
      />
    </v-container>
  </v-main>
</template>

<script>
import VTable from '@/components/VTable'

export default {
  components: { VTable }
}
</script>
