import http from '@/config/request'

export const carregarArquivo = id => {
  return http.get(`/api/cadastros/documento/content/${id}/`, {
    responseType: 'blob'
  })
}