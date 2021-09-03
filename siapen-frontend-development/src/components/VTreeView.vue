<template>
  <v-treeview
    activatable
    item-key="key"
    :items="items"
    :open="open"
    :active="active"
    @update:active="setActive"
    @update:open="setOpen"
  />
</template>

<script>
import * as sistemaPenalService from '@/services/SistemaPenalService'
import * as unidadeService from '@/services/UnidadeService'
import * as setorService from '@/services/SetorService'

export default {
  props: ['items', 'open', 'active', 'value'],
  data: () => ({
    itemsOpen: []
  }),
  methods: {
    setOpen(item) {
      this.itemsOpen = item
    },
    async setActive(item) {
      this.itemsOpen.push(item)
      this.value.itemsOpen = this.itemsOpen
      this.value.itemActive = item
      let obj = item.toString()
      let id = obj.substring(2)

      if (obj.startsWith('SP')) {
        sistemaPenalService.getId(id).then(response => {
          this.value.sistema = response.data.id
          this.value.sistema_nome = response.data.nome
          this.value.unidade = null
          this.value.unidade_nome = null
          this.value.bloco_pai = null
          this.value.bloco_pai_nome = null
        })
      }

      if (obj.startsWith('UN')) {
        unidadeService.getUnidadeId(id).then(response => {
          this.value.sistema = response.data.sistema
          this.value.sistema_nome = response.data.sistema_nome
          this.value.unidade = response.data.id
          this.value.unidade_nome = response.data.nome
          this.value.bloco_pai = null
          this.value.bloco_pai_nome = null
        })
      }
      
      if (obj.startsWith('BO')) {
        const response = await this.$api.get({resource: this.$endpoints.BLOCO, id: id})
        this.value.sistema = response.data.sistema
        this.value.sistema_nome = response.data.sistema_nome
        this.value.unidade = response.data.unidade
        this.value.unidade_nome = response.data.unidade_nome
        this.value.bloco_pai = response.data.id
        this.value.bloco_pai_nome = response.data.nome
        this.value.bloco = response.data.id
        this.value.bloco_nome = response.data.nome
      }
      
      if (obj.startsWith('CE')) {
        this.value.sistema = null
        this.value.sistema_nome = null
        this.value.unidade = null
        this.value.unidade_nome = null
        this.value.bloco_pai = null
        this.value.bloco_pai_nome = null
        this.value.bloco = null
        this.value.bloco_nome = null
      }
      
      if (obj.startsWith('SE')) {
        setorService.getId(id).then(response => {
          this.value.setor_pai = response.data.id
          this.value.setor_pai_nome = response.data.nome
        })
      }
    }
  }
}
</script>
