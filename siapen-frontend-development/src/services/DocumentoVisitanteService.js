import http from '@/config/request'

export const carregarArquivoVisitante = id => {
  return http.get(`/api/visitante/documentos/content/${id}/`, {
    responseType: 'blob'
  })
}