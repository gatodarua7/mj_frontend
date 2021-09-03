<template>
  <v-main>
    <barra-superior
      :titulo="$t('cargo.top.title')"
      :subtitulo="$t('cargo.top.subtitle')"
      :breadcrumbs="$t('cargo.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('cargo.top.subtitle')"
        :headers="[
          { text: 'Cargo', value: 'cargo' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.CARGO"
        router="cargo"
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
