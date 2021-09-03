<template>
  <v-main>
    <barra-superior
      :titulo="$t('bloco.top.title')"
      :subtitulo="$t('bloco.top.subtitle')"
      :breadcrumbs="$t('bloco.top.breadcrumbsPrincipal')"
    />

    <v-container fluid>
      <VTable
        :subtitle="$t('bloco.top.subtitle')"
        :headers="[
          { text: 'Sistema Penal', value: 'sistema_nome' },
          { text: 'Unidade de Custódia', value: 'unidade_nome' },
          { text: 'Bloco/Alocação', value: 'bloco_pai_nome' },
          { text: 'Nome', value: 'nome' },
          { text: 'Ativo', value: 'ativo' },
          { text: 'Ações', value: 'action', sortable: false }
        ]"
        :endpoint="$endpoints.BLOCO"
        router="bloco"
        :actions="['create', 'hierarchy', 'edit', 'delete']"
        @getHierarchy="getBlocoHierarquia"
      />
      <tree-dialog ref="tree" />
    </v-container>
  </v-main>
</template>

<script>
import * as blocoService from '@/services/BlocoService'
import VTable from '@/components/VTable'
import TreeDialog from '@/components/TreeDialog.vue'

export default {
  components: { VTable, TreeDialog },
  methods: {
    getBlocoHierarquia(item) {      
      blocoService.getArvoreById(item.id).then(response => {
        this.$refs.tree.open(response.data)
      })
    }
  }
}
</script>


