import mensagens from '@/shared/mensagens'
import { getUser } from '@/services/auth.service'
import moment from 'moment'

const generic = {
  computed: {
    user() {
      return getUser()
    }
  },
  methods: {
    displayErrors: function (error) {
      if (error.response.status == 400) {
        const mensagensErro = error.response.data
        let listErrors = {}
        for (var itemErro in mensagensErro) {
          if (itemErro == 'non_field_errors') {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: `${mensagensErro[itemErro]}`,
              color: 'error',
              timeout: 3000
            })
          } else {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: 'Verifique os erros no formulário',
              color: 'error',
              timeout: 3000
            })
            listErrors[itemErro] = `${mensagensErro[itemErro]}`
          }
        }
        return listErrors
      } else if (error.response.status >= 500) {
        this.$store.dispatch('snackbar/setSnackbar', {
          text: `${mensagens('MSG19')}`,
          color: 'error',
          timeout: 3000
        })
        return {}
      } else {
        this.$store.dispatch('snackbar/setSnackbar', {
          text: error.response.data.detail,
          color: 'error',
          timeout: 3000
        })
        return {}
      }
    },
    formatDate(date) {
      if (!date) return ''

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) return ''

      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatDateTime(date) {
      if (!date) return ''
      return moment(date).format('DD/MM/YYYY HH:mm:ss')
    },
    formatDateTimeWithoutSeconds(date) {
      if (!date) return ''
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    formatDateTimeToDate(date) {
      if (!date) return ''
      return moment(date).format('DD/MM/YYYY')
    },
    limpar() {
      this.$refs.form.reset()
    },
    sair() {
      this.$router.back()
    },
    convertPhoneNumber(numero) {
      if (!numero) return ''
      numero.replace(/[^\d]/g, '')
      return numero.replace(/^([0-9]{2})([0-9]{4,5})([0-9]{4})$/, '($1) $2-$3')
    },
    convertCPF(cpf) {
      if (!cpf) return ''
      cpf.replace(/[^\d]/g, '')
      return cpf.replace(
        /^([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})-?([0-9]{2})$/,
        '$1.$2.$3-$4'
      )
    },
    async getPaises() {
      const response = await this.$api.list({
        resource: this.$endpoints.PAIS,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.paises = response.data.results
    },
    async getEstados() {
      const response = await this.$api.list({
        resource: this.$endpoints.ESTADO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.estados = response.data.results
    },
    async getCidades(cidade) {
      this.cidades = []
      this.cidades.push(cidade)
      const res = await this.$api.list({
        resource: this.$endpoints.CIDADE,
        query: {
          page_size: 10000
        }
      })
      this.cidades = res.data.results
    },
    async getCidadesPorEstado(estadoId) {
      const res = await this.$api.list({
        resource: this.$endpoints.CIDADE,
        query: {
          page_size: 10000,
          estado: estadoId
        }
      })
      this.cidades = res.data.results
    },
    async getGeneros() {
      const response = await this.$api.list({
        resource: this.$endpoints.GENERO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.genero = response.data.results
    },
    async getRacas() {
      const response = await this.$api.list({
        resource: this.$endpoints.RACA,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.raca = response.data.results
    },
    async getEstadoCivil() {
      const response = await this.$api.list({
        resource: this.$endpoints.ESTADO_CIVIL,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.estadoCivil = response.data.results
    },
    async getGrauInstrucao() {
      const response = await this.$api.list({
        resource: this.$endpoints.GRAU_INSTRUCAO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.grauInstrucao = response.data.results
    },
    async getOrientacaoSexual() {
      const response = await this.$api.list({
        resource: this.$endpoints.ORIENTACAO_SEXUAL,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.orientacaoSexual = response.data.results
    },
    async getReligiao() {
      const response = await this.$api.list({
        resource: this.$endpoints.RELIGIAO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.religiao = response.data.results
    },
    async getProfissao() {
      const response = await this.$api.list({
        resource: this.$endpoints.PROFISSAO,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.profissao = response.data.results
    },
    async getNecessidadeEspecial() {
      const response = await this.$api.list({
        resource: this.$endpoints.NECESSIDADE_ESPECIAL,
        query: {
          page_size:10000,
          ativo: true
        }
      })
      this.necessidadeEspecial = response.data.results
    },
    getFormData(object) {
      const formData = new FormData()
      Object.keys(object).forEach(
        key => (object[key] || object.id) && formData.append(key, object[key])
      )
      return formData
    },
  }
}

export default generic