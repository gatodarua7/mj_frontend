import http from '../config/request'

export const getAll = () => {
  return http.get('/api/pessoas/servidor/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/pessoas/servidor/${id}/`)
}

export const deletar = id => {
  return http.delete(`/api/pessoas/servidor/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/pessoas/servidor/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&fields=id,thumbnail,nome,cpf,matricula,cargo_nome,situacao,ativo&search=${param}`
  )
}

export const searchAll = (param, servidores) => {
  if (param == undefined) {
    param = ''
  }

  let list_servidores = []
  if (servidores == undefined) {
    list_servidores = ''
  } else {
    servidores.map(item=>{
      list_servidores.push(item.id)
    })
  }

  return http.get(
    `/api/pessoas/servidor/?page_size=10000&search=${param}&exclude_ids=${list_servidores}`
  )
}

export const inserir = params => {
  return http.post('api/pessoas/servidor/', params)
}

export const alterar = params => {
  return http.patch(`api/pessoas/servidor/${params.id}/`, params)
}
