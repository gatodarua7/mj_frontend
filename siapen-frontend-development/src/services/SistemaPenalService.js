import http from '../config/request'

export const getId = id => {
  return http.get(`/api/prisional/sistema-penal/${id}/`)
}

export const getSistemaPenal = () => {
  return http.get('api/prisional/sistema-penal/?page_size=10000&ativo=true')
}

export const search = (sortBy, sortDesc, page, itemsPerPage, nome) => {
  if (nome == undefined) {
    nome = ''
  }

  if (sortBy.toString().endsWith('.ativo')) {
    sortBy = sortBy.toString().split('.')[1]
  } else if (sortBy[0] === 'pais_nome') {
    sortBy = sortBy.toString().replace('pais_nome', 'pais__nome')
  } else if (sortBy[0] === 'estado_nome') {
    sortBy = sortBy.toString().replace('estado_nome', 'estado__nome')
  }

  
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `api/prisional/sistema-penal/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${nome}`
  )
}

export const inserir = params => {
  return http.post('api/prisional/sistema-penal/', params)
}

export const alterar = params => {
  return http.put(`api/prisional/sistema-penal/${params.id}/`, params)
}

export const deletar = id => {
  return http.delete(`api/prisional/sistema-penal/${id}/`)
}
