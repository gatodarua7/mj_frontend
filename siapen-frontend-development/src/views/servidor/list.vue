<template>
  <v-main>
    <barra-superior
      :titulo="$t('servidor.top.title')"
      :subtitulo="$t('servidor.top.subtitle')"
      :breadcrumbs="$t('servidor.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('servidor.top.subtitle')"
        :headers="[
          { text: '', value: 'thumbnail' },
          { text: 'Nome', value: 'nome' },
          { text: 'CPF', value: 'cpf' },
          { text: 'Matrícula SIAPE', value: 'matricula' },
          { text: 'Cargo Efetivo', value: 'cargo_nome' },
          { text: 'Situação do cadastro', value: 'situacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.SERVIDOR"
        :params="[
          {key: 'fields', value: 'id,thumbnail,nome,cpf,matricula,cargo_nome,situacao,ativo'},
        ]"
        router="servidor"
        :actions="['create', 'detail', 'edit', 'delete']"
        :prompt="true"
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
