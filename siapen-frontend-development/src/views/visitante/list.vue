<template>
  <v-main>
    <barra-superior
      :titulo="$t('visitante.top.title')"
      :subtitulo="$t('visitante.top.subtitle')"
      :breadcrumbs="$t('visitante.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('visitante.top.subtitle')"
        :headers="[
          { text: '', value: 'thumbnail' },
          { text: 'Nome', value: 'nome' },
          { text: 'Data de Nascimento', value: 'data_nascimento' },
          { text: 'CPF', value: 'cpf' },
          { text: 'Atendimento', value: 'atendimento' },
          { text: 'Data do Deferimento', value: 'data_movimentacao' },
          { text: 'Data da Validade', value: 'data_validade' },
          { text: 'Situação', value: 'situacao' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.VISITANTE"
        :params="visitanteQuery"
        router="visitante"
        :actions="['detail', 'edit']"
        :prompt="true"
        :prompt-delete="true"
      />
    </v-container>
  </v-main>
</template>

<script>
import VTable from '@/components/VTable'

export default {
  components: { VTable },
  data: () => ({
    visitanteQuery: [
      {key: 'fields', value: 'id,thumbnail,nome,data_nascimento,cpf,atendimento,created_at,data_movimentacao,data_validade,situacao'},
      {key: 'fase', value: 'DEFERIDO,RECURSO_DEFERIDO'},
    ]
  })
}
</script>
