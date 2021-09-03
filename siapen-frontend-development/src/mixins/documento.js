import * as documentoService from '@/services/DocumentoService'
import mensagens from '@/shared/mensagens'

const documento = {
  methods: {    
    async getDataFromApi() {
      const response = await this.$api.list({
        resource: this.$endpoints.DOCUMENTO,
        query: {
          page_size: 10000,
          ativo: true,
          search: this.search,
          [this.tipoPessoa]: this.object.id
        }
      })
      this.object.documentos = response.data.results
    },
    exibirObservacoes(observacao) {
      this.$refs.simpleDialog.open(observacao)
    },
    fechar() {
      this.dialog = false
      setTimeout(() => {
        this.$refs.form.reset()
        this.errors = {}
        this.disabled = null
        this.date = null
        this.arquivo = null
        this.documento = {}
        this.documentoIndex = -1
      }, 300)
    },
    visualizarItem(item) {
      this.documentoIndex = this.object.documentos.indexOf(item)
      this.documento = Object.assign({}, item)
      this.date = this.documento.data_validade
      this.documento.id && this.carregarArquivo()
      this.disabled = true
      this.dialog = true
    },
    editarItem(item) {
      this.documentoIndex = this.object.documentos.indexOf(item)
      this.documento = Object.assign({}, item)
      this.date = this.documento.data_validade
      delete this.documento.arquivo_temp
      this.documento.id && this.carregarArquivo()
      this.dialog = true
    },
    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir documento',
          'Você tem certeza que deseja excluir este documento ?'
        )
      ) {
        const response = this.$api.destroy({resource: this.$endpoints.DOCUMENTO, id: item.id})
        response
          .then(() =>{
            const index = this.object.documentos.indexOf(item)
            this.object.documentos.splice(index, 1)
          })
          .catch(error => {
            this.displayErrors(error)
          })
      }
    },

    salvar() {
      !this.documento.tipo && (this.documento.tipo = '')
      this.documento.data_validade = this.computedDateFormatted
      let formData = this.getFormData(this.documento)
      const response = this.documento.id 
        ? this.$api.update({resource: this.$endpoints.DOCUMENTO, id: this.documento.id, data: formData})
        : this.$api.create({resource: this.$endpoints.DOCUMENTO, data: formData})
      response
        .then(result => {
          this.documentoIndex > -1
            ? Object.assign(
                this.object.documentos[this.documentoIndex],
                result.data
              )
            : this.object.documentos.push(result.data)
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
          this.fechar()
          this.object.id && this.$emit('update')
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    async getTipoDocumento() {
      const response = await this.$api.list({
        resource: this.$endpoints.TIPO_DOCUMENTO,
        query: {
          page_size: 10000,
          ativo: true
        }
      })
      this.tipoDocumentos = response.data.results
    },
    baixarArquivo(id) {
      documentoService.carregarArquivo(id).then(response => {
        let filename = response.headers['content-disposition'].split('=')[1]
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
      })
    },
    carregarArquivo() {
      documentoService.carregarArquivo(this.documento.id).then(response => {
        let filename = response.headers['content-disposition'].split('=')[1]
        let blob = new Blob([response.data])
        this.arquivo = new File([blob], filename)
      })
    },
    limparArquivo() {
      this.arquivo = ''
      this.documento.arquivo_temp = ''
    },
    verificarArquivo() {
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
            this.documento.arquivo_temp = this.arquivo
            this.errors.arquivo_temp = null
            this.disableSubmit = false
          }
        } else {
          this.errors.arquivo_temp = 'Formato de arquivo não suportado'
          this.disableSubmit = true
        }
      }
    },
  }
}

export default documento