<template>
  <v-main>
    <barra-superior
      :titulo="$t('faccao_pessoa.top.title')"
      :subtitulo="$t('faccao_pessoa.top.subtitle')"
      :breadcrumbs="$t('faccao_pessoa.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('faccao_pessoa.top.subtitle')"
        :headers="[
          { text: 'Facção', value: 'faccao_nome' },
          { text: 'Interno', value: 'pessoa_nome' },
          { text: 'Dt. Filiação', value: 'data_filiacao_faccao' },
          { text: 'Dt. Desfiliação', value: 'data_desfiliacao_faccao' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.FACCAO_PESSOA"
        router="faccao-pessoa"
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


