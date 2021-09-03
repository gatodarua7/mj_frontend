import http from '@/config/request'

export const getFases = fase => {
  return http.get(`api/visitante/movimentacao/get_fases/${fase}/`)
}

export const getMovimentacoes = visitanteId => {
  return http.get(`api/visitante/movimentacao/?page_size=10000&ativo=true&ordering=-created_at&visitante=${visitanteId}`)
}
