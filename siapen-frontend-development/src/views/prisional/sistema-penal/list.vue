<template>
  <v-main>
    <barra-superior
      :titulo="$t('penal_system.top.title')"
      :subtitulo="$t('penal_system.top.subtitle')"
      :breadcrumbs="$t('penal_system.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('penal_system.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'País', value: 'pais_nome' },
          { text: 'Estado', value: 'estado_nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.SISTEMA_PENAL"
        router="sistema-penal"
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
