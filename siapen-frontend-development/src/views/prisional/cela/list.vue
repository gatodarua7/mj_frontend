<template>
  <v-main>
    <barra-superior
      :titulo="$t('cela.top.title')"
      :subtitulo="$t('cela.top.subtitle')"
      :breadcrumbs="$t('cela.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('cela.top.subtitle')"
        :headers="[
          { text: 'Sistema Penal', value: 'sistema_nome' },
          { text: 'Unid. de Custódia', value: 'unidade_nome' },
          { text: 'Bloco', value: 'bloco_nome' },
          { text: 'Nome/N° da Cela', value: 'nome' },
          { text: 'Cap.', value: 'capacidade' },
          { text: 'Obs.', value: 'observacao' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', width: '150px', sortable: false }
        ]"
        :endpoint="$endpoints.CELA"
        router="cela"
        :actions="['create', 'hierarchy', 'edit', 'delete']"
        @getHierarchy="getCelaHierarquia"
      />
      <tree-dialog ref="tree" />
    </v-container>
  </v-main>
</template>

<script>
import * as celaService from '@/services/CelaService'
import VTable from '@/components/VTable'
import TreeDialog from '@/components/TreeDialog.vue'

export default {
  components: { VTable, TreeDialog },
  methods: {
    getCelaHierarquia(item) {      
      celaService.getArvoreById(item.id).then(response => {
        this.$refs.tree.open(response.data)
      })
    }
  }
}
</script>


