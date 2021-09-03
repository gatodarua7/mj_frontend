const advogado = {
  methods: {    
    completeStep1() {
      return !!(this.advogado.nome && this.advogado.data_nascimento && this.advogado.cpf && this.advogado.nacionalidade)
    },
    completeStep2() {
      return !!(
        this.advogado.telefones.length && this.advogado.enderecos.length
      )
    },
    limparAba1() {
      this.$refs.aba1.clearFoto()
      this.$refs.aba1.date = null
      Object.assign(this.advogado, {
        nome: null,
        data_nascimento:null,
        genero: null,
        cpf: null,
        emails: null,
        nacionalidade: null,
        estado: null,
        naturalidade: null,
        necessidade_especial: null,
        rgs: [],
        oabs: []
      })
    },
    limparAba2() {
      Object.assign(this.advogado, {
        telefones: [],
        enderecos: []
      })
    }
  }
}

export default advogado