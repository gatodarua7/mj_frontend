import http from '../config/request'

export const getAll = () => {
  return http.get('/api/cadastros/orgao-expedidor/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/cadastros/orgao-expedidor/${id}/`)
}

export const deletar = id => {
  return http.delete(`/api/cadastros/orgao-expedidor/${id}/`)
}

export const getUfs = () => {
  return http.get('/api/cadastros/orgao-expedidor/ufs/')
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  param == undefined && (param = '')

  if (sortBy[0] === 'estado_sigla') {
    sortBy = sortBy.toString().replace('estado_sigla', 'estado__sigla')
  }

  
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/cadastros/orgao-expedidor/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const searchByUf = uf => {
  return http.get(
    `/api/cadastros/orgao-expedidor/?estado=${uf}&page_size=10000&ativo=true`
  )
}

export const inserir = params => {
  return http.post('api/cadastros/orgao-expedidor/', params)
}

export const alterar = params => {
  return http.put(`api/cadastros/orgao-expedidor/${params.id}/`, params)
}
