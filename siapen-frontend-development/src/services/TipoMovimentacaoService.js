import http from '../config/request'

export const listAll = () => {
  return http.get(
    '/api/movimentacao/tipo-movimentacao/?page_size=1000&ativo=true'
  )
}

export const getMotivosPorTipo = tipo => {
  return http.get(`/api/movimentacao/tipo-movimentacao/?tipo=${tipo}`)
}
