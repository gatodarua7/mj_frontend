import http from '../config/request'

export const getAll = () => {
  return http.get('/api/pessoas/sinais/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/pessoas/sinais/${id}/`)
}

export const deletar = params => {
  return http.patch(`/api/pessoas/sinais/${params.id}/`, params)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  param == undefined && (param = '')
  sortDesc == 'true' && (sortBy = '-' + sortBy)

  return http.get(
    `/api/pessoas/sinais/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/pessoas/sinais/', params)
}

export const alterar = params => {
  return http.patch(`api/pessoas/sinais/${params.id}/`, params)
}
