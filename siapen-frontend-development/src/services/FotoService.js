import http from '../config/request'

export const getId = id => {
  return http.get(`api/cadastros/foto/${id}/`)
}

export const inserir = params => {
  return http.post('api/cadastros/foto/', params)
}

export const alterar = params => {
  return http.patch(`api/cadastros/foto/${params.id}/`, params)
}

export const deletar = params => {
  return http.delete(`api/cadastros/foto/${params.id}/`)
}
