<template>
  <v-main>
    <barra-superior
      :titulo="$t('tipo_documento.top.title')"
      :subtitulo="$t('tipo_documento.top.subtitle')"
      :breadcrumbs="$t('tipo_documento.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('tipo_documento.top.subtitle')"
        :headers="[
          { text: 'Tipo de Documento', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.TIPO_DOCUMENTO"
        router="tipo-documento"
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
