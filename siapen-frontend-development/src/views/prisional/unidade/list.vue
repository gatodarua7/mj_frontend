<template>
  <v-main>
    <barra-superior
      :titulo="$t('units.top.title')"
      :subtitulo="$t('units.top.subtitle')"
      :breadcrumbs="$t('units.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('units.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'Sistema Penal', value: 'sistema_nome' },
          { text: 'Estado', value: 'estado_nome' },
          { text: 'Cidade', value: 'cidade_nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.UNIDADE"
        router="unidades"
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
