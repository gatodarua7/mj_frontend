import http from '../config/request'

export const getAll = () => {
  return http.get('/api/escoltas/escoltas/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/escoltas/escoltas/${id}/`)
}

export const deletar = params => {
  return http.delete(`/api/escoltas/escoltas/${params.id}/`, params)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortBy[0] === 'escolta_aerea') {
    sortBy = sortBy.toString().replace('escolta_aerea', 'data_inicio_aerea,hora_inicio_aerea')
  }

  if (sortBy[0] === 'escolta_terrestre') {
    sortBy = sortBy.toString().replace('escolta_terrestre', 'data_inicio_terrestre,hora_inicio_terrestre')
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/escoltas/escoltas/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const carregarPedidos = pedidos => {
  
  let list_pedidos = []
  if (pedidos == undefined) {
    list_pedidos = ''
  } else {
    pedidos.map(item=>{
      list_pedidos.push(item.id)
    })
  }
  return http.get(`/api/escoltas/escoltas/pedidos-inclusao/?page_size=10000&pedido=${list_pedidos}`)
}

export const calendario = (data_inicio, data_fim) => {
  return http.get(`/api/escoltas/escoltas/calendario/?data_inicio=${data_inicio}&data_fim=${data_fim}`)
}

export const inserir = params => {
  return http.post('api/escoltas/escoltas/', params)
}

export const alterar = params => {
  return http.patch(`api/escoltas/escoltas/${params.id}/`, params)
}
