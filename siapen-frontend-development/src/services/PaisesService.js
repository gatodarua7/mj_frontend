import http from '../config/request'

export const listAll = () => {
  return http.get('api/localizacao/paises/?page_size=10000&ativo=true')
}

export const getPorNome = nome => {
  return http.get(`api/localizacao/paises/?nome=${nome}`)
}
