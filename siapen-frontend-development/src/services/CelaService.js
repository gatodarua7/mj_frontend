import http from '@/config/request'

export const getArvore = () => {
  return http.get('/api/prisional/cela-alocacao/')
}

export const getArvoreById = id => {
  return http.get(`/api/prisional/treeview-cela/${id}/`)
}