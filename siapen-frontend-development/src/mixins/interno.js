const interno = {
  methods: {    
    completeStep1() {
      return !!(this.interno.nome && this.interno.data_nascimento && this.interno.cpf)
    },
    completeStep2() {
      return !!(this.interno.documentos.length)
    },
    completeStep3() {
      return !!(this.interno.contatos.length)
    },
    completeStep4() {
      return !!(this.interno.caracteristicas_cutis &&
      this.interno.caracteristicas_cor_cabelo &&
      this.interno.caracteristicas_tipo_cabelo &&
      this.interno.caracteristicas_tipo_rosto &&
      this.interno.caracteristicas_tipo_testa &&
      this.interno.caracteristicas_sobrancelhas &&
      this.interno.caracteristicas_tipo_olhos &&
      this.interno.caracteristicas_cor_olhos &&
      this.interno.caracteristicas_nariz &&
      this.interno.caracteristicas_orelhas &&
      this.interno.caracteristicas_labios &&
      this.interno.caracteristicas_compleicao)
    },
    completeStep5() {
      return !!(this.interno.sinais.length)
    },
    limparAba1() {
      this.$refs.aba1.clearFoto()
      this.$refs.aba1.date = null
      Object.assign(this.interno, {
        nome: null,
        data_nascimento:null,
        nome_social:null,
        genero: null,
        cpf: null,
        outros_nome: null,
        vulgo: null,
        nacionalidade: null,
        estado: null,
        naturalidade: null,
        nome_mae: null,
        mae_nao_declarado: null,
        mae_falecido: null,
        nome_pai: null,
        pai_nao_declarado: null,
        pai_falecido: null,
        grau_instrucao: null,
        profissao: null,
        raca: null,
        orientacao_sexual: null,
        religiao: null,
        necessidade_especial: null,
        estado_civil: null,
        rgs: []
      })
    },
    limparAba2() {
      Object.assign(this.interno, {
        documentos: []
      })
    },
    limparAba3() {
      Object.assign(this.interno, {
        contatos: []
      })
    },
    limparAba4() {
      Object.assign(this.interno, {
        caracteristicas_cutis: null,
        caracteristicas_cor_cabelo: null,
        caracteristicas_tipo_cabelo: null,
        caracteristicas_tipo_rosto: null,
        caracteristicas_tipo_testa: null,
        caracteristicas_sobrancelhas: null,
        caracteristicas_tipo_olhos: null,
        caracteristicas_cor_olhos: null,
        caracteristicas_nariz: null,
        caracteristicas_orelhas: null,
        caracteristicas_labios: null,
        caracteristicas_compleicao: null
      })
    },
    limparAba5() {
      Object.assign(this.interno, {
        sinais: []
      })
      this.$refs.aba5.clearAreas()
    },
    checkValidStep4() {
      if (this.errors.caracteristicas_cutis ||
      this.errors.caracteristicas_cor_cabelo ||
      this.errors.caracteristicas_tipo_cabelo ||
      this.errors.caracteristicas_tipo_rosto ||
      this.errors.caracteristicas_tipo_testa ||
      this.errors.caracteristicas_sobrancelhas ||
      this.errors.caracteristicas_tipo_olhos ||
      this.errors.caracteristicas_cor_olhos ||
      this.errors.caracteristicas_nariz ||
      this.errors.caracteristicas_orelhas ||
      this.errors.caracteristicas_labios ||
      this.errors.caracteristicas_compleicao){
        this.rules.stepForm4 = false
      } else {
        this.rules.stepForm4 = true
      }
    },
  }
}

export default interno