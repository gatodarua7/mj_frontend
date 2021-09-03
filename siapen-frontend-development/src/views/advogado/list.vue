<template>
  <v-main>
    <barra-superior
      :titulo="$t('advogado.top.title')"
      :subtitulo="$t('advogado.top.subtitle')"
      :breadcrumbs="$t('advogado.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('advogado.top.subtitle')"
        :headers="[
          { text: '', value: 'thumbnail' },
          { text: 'Nome', value: 'nome' },
          { text: 'CPF', value: 'cpf' },
          { text: 'OAB - UF', value: 'oabs_list' },
          { text: 'Data de Nascimento', value: 'data_nascimento' },
          { text: 'Situação do cadastro', value: 'situacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.ADVOGADO"
        :params="[
          {key: 'fields', value: 'id,thumbnail,nome,cpf,oabs_list,data_nascimento,situacao,ativo'},
        ]"
        router="advogado"
        :actions="['create', 'detail', 'edit', 'delete']"
        :prompt="true"
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
