import http from '../config/request'

export const listAll = () => {
  return http.get('api/localizacao/estados/?page_size=10000')
}

export const getEstadoPorSigla = sigla => {
  return http.get(`api/localizacao/estados/?sigla=${sigla}`)
}

export const getId = id => {
  return http.get(`api/localizacao/estados/${id}`)
}
