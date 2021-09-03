import * as documentoVisitanteService from '@/services/DocumentoVisitanteService'

const visitante = {
  methods: {
    getFase(fase) {
      const fases = {
        'ANALISE_DIRETORIA': {nome: 'Análise da Diretoria' , cor:'indigo darken-4'},
        'ANALISE_INTELIGENCIA': {nome: 'Análise da Inteligência' , cor:'grey darken-1'},
        'ASSISTENCIA_SOCIAL': {nome: 'Assistência Social' , cor:'purple'},
        'DEFERIDO': {nome: 'Deferido' , cor:'green'},
        'INDEFERIDO': {nome: 'Indeferido' , cor:'red'},
        'INICIADO': {nome: 'Iniciado' , cor:'light-blue'},
        'RECURSO': {nome: 'Recurso' , cor:'orange'},
        'RECURSO_EM_ANALISE': {nome: 'Recurso - Análise da Diretoria' , cor:'grey darken-1'},
        'RECURSO_DEFERIDO': {nome: 'Recurso Deferido' , cor:'green'},
        'RECURSO_INDEFERIDO': {nome: 'Recurso Indeferido' , cor:'red'},
        'SOLICITANTE_INFORMADO': {nome: 'Solicitante Informado' , cor:'light-green darken-4'}
      }
      return fase && fases[fase]
    },
    
    baixarArquivoVisitante(id) {
      documentoVisitanteService.carregarArquivoVisitante(id).then(response => {
        let filename = response.headers['content-disposition'].split('=')[1]
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      })
    },
    carregarArquivoVisitante() {
      documentoVisitanteService.carregarArquivoVisitante(this.documento.id).then(response => {
        let filename = response.headers['content-disposition'].split('=')[1]
        let blob = new Blob([response.data])
        this.arquivo = new File([blob], filename)
      })
    },
    verificarArquivoVisitante() {
      if(this.arquivo){
        const isImage = ['image/jpeg', 'image/png'].includes(this.arquivo.type)
        const isPdf = ['application/pdf'].includes(this.arquivo.type)

        if (isImage || isPdf) {
          if(isImage && this.arquivo.size > 1*1024*1024){
            this.errors.arquivo_temp = 'Tamanho da imagem não suportado. O arquivo deve ter no máximo 1MB'
            this.disableSubmit = true
          } else if(isPdf && this.arquivo.size > 15*1024*1024){
            this.errors.arquivo_temp = 'Tamanho do arquivo não suportado. O arquivo deve ter no máximo 15MB'
            this.disableSubmit = true
          } else {
            this.errors.arquivo_temp = null
            this.disableSubmit = false
          }
        } else {
          this.errors.arquivo_temp = 'Formato de arquivo não suportado'
          this.disableSubmit = true
        }
      }
    },

    async excluirArquivoVisitante(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir',
          'Você tem certeza que deseja excluir este registro ?'
        )
      ) {
        const response = this.$api.destroy({resource: this.$endpoints.VISITANTE_DOCUMENTO, id: item.id})
        response
          .then(() =>{
            const index = this.items.indexOf(item)
            this.items.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },
  }
}

export default visitante