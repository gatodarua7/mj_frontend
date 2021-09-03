import http from '../config/request'

export const getAll = () => {
  return http.get('/api/visitante/recurso/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/visitante/recurso/${id}/?expand=documentos`)
}

export const deletar = id => {
  return http.delete(`/api/visitante/recurso/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  param == undefined && (param = '')
  sortDesc == 'true' && (sortBy = '-' + sortBy)

  return http.get(
    `/api/visitante/recurso/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/visitante/recurso/', params)
}

export const alterar = params => {
  return http.patch(`api/visitante/recurso/${params.id}/`, params)
}
