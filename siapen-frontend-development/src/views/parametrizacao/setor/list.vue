<template>
  <v-main>
    <barra-superior
      :titulo="$t('setor.top.title')"
      :subtitulo="$t('setor.top.subtitle')"
      :breadcrumbs="$t('setor.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <VTable
        :subtitle="$t('setor.top.subtitle')"
        :headers="[
          { text: 'Nome', value: 'nome' },
          { text: 'Sigla', value: 'sigla' },
          { text: 'Endereço', value: 'cep_logradouro' },
          { text: 'Qtd. Telefones', value: 'telefones.length', sortable: false },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', width: '150px', sortable: false }
        ]"
        :endpoint="$endpoints.SETOR"
        router="setor"
        :actions="['create', 'hierarchy', 'detail', 'edit', 'delete']"
        @getHierarchy="getSetorHierarquia"
      />
      <tree-dialog ref="tree" />
    </v-container>
  </v-main>
</template>

<script>
import * as setorService from '@/services/SetorService'
import VTable from '@/components/VTable'
import TreeDialog from '@/components/TreeDialog.vue'

export default {
  components: { VTable, TreeDialog },
  methods: {
    getSetorHierarquia(item) {      
      setorService.getArvoreById(item.id).then(response => {
        this.$refs.tree.open(response.data)
      })
    }
  }
}
</script>


