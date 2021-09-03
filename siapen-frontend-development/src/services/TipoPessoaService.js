import http from '../config/request'

export const listAll = () => {
  return http.get('/api/cadastros/modelo-tipo-pessoa/')
}

export const pesquisa = (sortBy, sortDesc, page, itemsPerPage, nome) => {
  if (sortBy.toString().endsWith('.ativo')) {
    sortBy = sortBy.toString().split('.')[1]
  } else {
    sortBy = sortBy.toString().replace('pessoa_dados.', 'pessoa__')
  }

  
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/cadastros/tipo-pessoa/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${nome}`
  )
}

export const addOrUpdate = tipo => {
  let metodo = 'post'
  let url = ''

  if (tipo.id != null) {
    metodo = 'patch'
    url = tipo.id + '/'
  }

  return http[metodo](`api/cadastros/tipo-pessoa/${url}`, tipo)
}
