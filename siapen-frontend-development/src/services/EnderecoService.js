import http from '../config/request'

export const inserir = params => {
  return http.post('api/comum/endereco/', params)
}

export const alterar = params => {
  return http.patch(`api/comum/endereco/${params.id}/`, params)
}
