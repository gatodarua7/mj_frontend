import http from '../config/request'

export const getAll = () => {
  return http.get('/api/cadastros/setor/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/cadastros/setor/${id}/`)
}

export const getSetorPorUnidade = id => {
  return http.get(`/api/cadastros/setor/?unidade=${id}`)
}

export const deletar = id => {
  return http.delete(`/api/cadastros/setor/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortBy[0] == 'cep_logradouro') {
    sortBy = sortBy.toString().replace('cep_logradouro', 'enderecos__cep')
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/cadastros/setor/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const getArvore = () => {
  return http.get('api/cadastros/setor/setor-alocacao/')
}

export const getArvoreById = id => {
  return http.get(`api/cadastros/setor/treeview-setor/${id}/`)
}

export const inserir = params => {
  return http.post('api/cadastros/setor/', params)
}

export const alterar = params => {
  return http.put(`api/cadastros/setor/${params.id}/`, params)
}
