<template>
  <v-main>
    <barra-superior
      :titulo="$t('faccao_cargo.top.title')"
      :subtitulo="$t('faccao_cargo.top.subtitle')"
      :breadcrumbs="$t('faccao_cargo.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('faccao_cargo.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Facção', value: 'faccao_nome' },
          { text: 'Observação', value: 'observacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.FACCAO_CARGO"
        router="faccao-cargo"
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


