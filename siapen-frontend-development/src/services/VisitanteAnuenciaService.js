import http from '../config/request'

export const getAll = () => {
  return http.get('/api/visitante/anuencia/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/visitante/anuencia/${id}/?expand=interno,tipo_vinculo`)
}

export const deletar = id => {
  return http.delete(`/api/visitante/anuencia/${id}/`)
}

export const carregarArquivo = id => {
  return http.get(`/api/visitante/anuencia/content/${id}/`, {
    responseType: 'blob'
  })
}

export const search = (param, id) => {
  param == undefined && (param = '')
  id == undefined && (id = '')

  return http.get(
    `/api/visitante/anuencia/?page_size=10000&expand=interno,tipo_vinculo&search=${param}&id_visitante=${id}`
  )
}

export const inserir = params => {
  return http.post('api/visitante/anuencia/', params)
}

export const alterar = (params, id) => {
  return http.patch(`api/visitante/anuencia/${id}/`, params)
}
