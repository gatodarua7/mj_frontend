import http from '../config/request'

export const getAll = () => {
  return http.get('/api/visitante/visitante/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/visitante/visitante/${id}/`)
}

export const deletar = params => {
  return http.delete(`/api/visitante/visitante/${params.id}/`, params)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined || !param) {
    param = ''
    if(!sortBy.length){sortBy = '-created_at'}
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/visitante/visitante/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&fields=id,thumbnail,nome,data_nascimento,cpf,atendimento,created_at,data_movimentacao,data_validade,situacao&fase=DEFERIDO,RECURSO_DEFERIDO&search=${param}`
  )
}

export const searchByFase = (sortBy, sortDesc, page, itemsPerPage, param, fase) => {
  if (param == undefined || !param) {
    param = ''
    if(!sortBy.length){
      if (fase=='ANALISE_DIRETORIA,RECURSO_EM_ANALISE' || fase=='ANALISE_INTELIGENCIA') {
        sortBy = 'nome'
      } else {
        sortBy = '-data_movimentacao'
      }
    }
  }

  if (fase == undefined || !fase) {
    fase = ''
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/visitante/visitante/?fields=id,thumbnail,nome,data_nascimento,cpf,atendimento,solicitante_informado,fase,analise_inteligencia,analise_diretoria,permite_recurso&fase=${fase}&page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/visitante/visitante/', params)
}

export const alterar = params => {
  return http.patch(`api/visitante/visitante/${params.id}/`, params)
}

export const historicoManifestacao = visitanteId => {
  return http.get(
    `/api/visitante/manifestacao/?page_size=10000&expand=documentos&visitante=${visitanteId}`
  )
}

export const inserirManifestacao = params => {
  return http.post('/api/visitante/manifestacao/', params)
}

export const alterarManifestacao = params => {
  return http.patch(`/api/visitante/manifestacao/${params.id}/`, params)
}

export const deletarManifestacao = id => {
  return http.delete(`/api/visitante/manifestacao/${id}/`)
}

export const historicoManifestacaoDiretoria = (visitanteId, analiseId) => {
  !analiseId && (analiseId = '')
  return http.get(
    `/api/visitante/manifestacao-diretoria/?page_size=10000&expand=documentos&visitante=${visitanteId}&manifestacao_diretoria=${analiseId}`
  )
}

export const getManifestacaoDiretoria = id => {
  return http.get(
    `/api/visitante/manifestacao-diretoria/${id}/?expand=documentos`
  )
}

export const inserirManifestacaoDiretoria = params => {
  return http.post('/api/visitante/manifestacao-diretoria/', params)
}

export const alterarManifestacaoDiretoria = params => {
  return http.patch(`/api/visitante/manifestacao-diretoria/${params.id}/`, params)
}

export const deletarManifestacaoDiretoria = id => {
  return http.delete(`/api/visitante/manifestacao-diretoria/${id}/`)
}
