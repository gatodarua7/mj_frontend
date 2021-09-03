<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
    >       
      <template v-slot:[`item.arquivo`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="baixarArquivoVisitante(item.id)"
            >
              <v-icon>file_download</v-icon>
            </v-btn>
          </template>
          <span>Baixar arquivo</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-toolbar-items>
          <v-tooltip
            v-if="!readonly && !cantDelete"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="excluirArquivoVisitante(item)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <span>Excluir</span>
          </v-tooltip>
        </v-toolbar-items>
      </template>
    </v-data-table>
  
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import visitanteMixin from '@/mixins/visitante'

export default {
  components: { ConfirmDialog },
  mixins: [visitanteMixin],
  props: {
    items: Array,
    readonly: Boolean,
    cantDelete: Boolean
  },
  data: () => ({
    headers: [],
  }),
  mounted() {    
    if(this.readonly){
      this.headers = [
        { text: 'Nome do arquivo', value: 'filename' },
        { text: 'Arquivo', value: 'arquivo' },
      ]
    } else {
      this.headers = [
        { text: 'Nome do arquivo', value: 'filename' },
        { text: 'Arquivo', value: 'arquivo' },
        { text: 'Ações', value: 'action', sortable: false }
      ]
    }
  }
}
</script>