import http from '@/config/request'

export const getArvore = () => {
  return http.get('api/prisional/bloco-alocacao/')
}

export const getArvoreById = id => {
  return http.get(`api/prisional/treeview-bloco/${id}/`)
}