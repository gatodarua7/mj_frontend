import http from '../config/request'

export const getAll = () => {
  return http.get('/api/comum/telefones/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/comum/telefones/${id}/`)
}

export const getPhoneUse = numero => {
  return http.get(`/api/cadastros/pessoas/usuarios_telefone/${numero}/`)
}

export const deletar = id => {
  return http.delete(`/api/comum/telefones/${id}/`)
}

export const search = (
  sortBy,
  sortDesc,
  page,
  itemsPerPage,
  param,
  privacy
) => {
  param == undefined && (param = '')
  privacy == undefined && (privacy = false)
  sortDesc == 'true' && (sortBy = '-' + sortBy)

  return http.get(
    `/api/comum/telefones/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}&privado=${privacy}`
  )
}

export const searchByTipo = (tipo, numero, privacy) => {
  privacy == undefined && (privacy = false)

  return http.get(
    `/api/comum/telefones/?page_size=1&numero=${numero}&tipo=${tipo}&privado=${privacy}`
  )
}

export const searchByPhone = (numero, privacy) => {
  privacy == undefined && (privacy = false)

  return http.get(
    `/api/comum/telefones/?page_size=1&numero=${numero}&privado=${privacy}`
  )
}

export const searchByPhoneWithoutPrivacy = numero => {
  return http.get(`/api/comum/telefones/?page_size=1&numero=${numero}`)
}

export const inserir = params => {
  return http.post('api/comum/telefones/', params)
}

export const alterar = params => {
  return http.patch(`api/comum/telefones/${params.id}/`, params)
}
