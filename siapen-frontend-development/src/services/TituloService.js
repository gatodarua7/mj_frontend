import http from '../config/request'

export const getAll = () => {
  return http.get('/api/juridico/titulo/?page_size=10000&ativo=true')
}

export const getByNorma = norma => {
  return http.get(`/api/juridico/titulo/?page_size=10000&ativo=true&norma_juridica=${norma}`)
}

export const getByNormaEdit = (norma, titulo) => {
  return http.get(`/api/juridico/titulo/?page_size=10000&ativo=true&norma_juridica=${norma}&titulo_id=${titulo}`)
}

export const getId = id => {
  return http.get(`/api/juridico/titulo/${id}/`)
}

export const deletar = id => {
  return http.delete(`/api/juridico/titulo/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortBy[0] === 'norma_juridica_nome') {
    sortBy = sortBy.toString().replace('norma_juridica_nome', 'norma_juridica')
  }
  
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/juridico/titulo/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/juridico/titulo/', params)
}

export const alterar = params => {
  return http.patch(`api/juridico/titulo/${params.id}/`, params)
}
