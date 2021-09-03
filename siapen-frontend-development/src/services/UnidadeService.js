import http from '../config/request'

export const getAll = () => {
  return http.get('/api/prisional/unidade/?page_size=1000&ativo=true')
}

export const getUnidadeId = id => {
  return http.get(`/api/prisional/unidade/${id}/`)
}

export const getUnidadesPorSistema = sistema => {
  return http.get(`/api/prisional/unidade/?sistema__id=${sistema}&ativo=true`)
}

export const deletar = id => {
  return http.delete(`/api/prisional/unidade/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }
  if (sortBy.toString().endsWith('.ativo')) {
    sortBy = sortBy.toString().split('.')[1]
  } else if (sortBy[0] === 'estado_nome') {
    sortBy = sortBy.toString().replace('estado_nome', 'estado__nome')
  } else if (sortBy[0] === 'cidade_nome') {
    sortBy = sortBy.toString().replace('cidade_nome', 'cidade__nome')
  } else if (sortBy[0] === 'sistema_nome') {
    sortBy = sortBy.toString().replace('sistema_nome', 'sistema__nome')
  }
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }
  return http.get(
    `/api/prisional/unidade/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/prisional/unidade/', params)
}

export const alterar = params => {
  return http.put(`api/prisional/unidade/${params.id}/`, params)
}
