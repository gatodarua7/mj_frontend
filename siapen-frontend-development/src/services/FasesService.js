import http from '../config/request'

export const getAll = () => {
  return http.get('/api/movimentacao/fases-pedido/?page_size=10000&ativo=true')
}

export const getByGrupo = (grupo, fase) => {
  if (grupo == undefined) {
    grupo = ''
  }
  if (fase == undefined) {
    fase = ''
  }
  return http.get(`/api/movimentacao/fases-pedido/?page_size=10000&ativo=true&grupo=${grupo}&fase=${fase}`)
}

export const getAllByGrupo = grupo => {
  return http.get(`/api/movimentacao/fases-pedido/?page_size=10000&grupo=${grupo}`)
}

export const getGrupos = () => {
  return http.get('/api/movimentacao/fases-pedido/grupos/')
}

export const getId = id => {
  return http.get(`/api/movimentacao/fases-pedido/${id}/`)
}

export const deletar = id => {
  return http.delete(`/api/movimentacao/fases-pedido/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/movimentacao/fases-pedido/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const inserir = params => {
  return http.post('api/movimentacao/fases-pedido/', params)
}

export const alterar = params => {
  return http.patch(`api/movimentacao/fases-pedido/${params.id}/`, params)
}
