import http from '../config/request'

export const pesquisa = (sortBy, sortDesc, page, itemsPerPage, termo) => {
  if (sortBy.toString().endsWith('.nome')) {
    sortBy = sortBy.toString().replace('pessoa_dados.nome', 'pessoa__nome')
  } else if (sortBy.toString().endsWith('_mae')) {
    sortBy = sortBy
      .toString()
      .replace('pessoa_dados.nome_mae', 'pessoa__nome_mae')
  } else if (sortBy.toString().endsWith('_sigla')) {
    sortBy = sortBy
      .toString()
      .replace('solicitante_sigla', 'solicitante__sigla')
  }
  
  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `api/juridico/pedidos-inclusao/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${termo}`
  )
}

export const addOrUpdate = pedido => {
  let metodo = 'post'
  let url = ''

  if (pedido.id != null) {
    metodo = 'patch'
    url = pedido.id + '/'
  }

  return http[metodo](`api/juridico/pedidos-inclusao/${url}`, pedido)
}

export const getPessoasDeferidas = () => {
  return http.get('api/juridico/pedidos-inclusao/?status=DEF')
}

export const getAll = () => {
  return http.get('/api/movimentacao/pedido-inclusao/?page_size=10000&ativo=true')
}

export const getId = id => {
  return http.get(`/api/movimentacao/pedido-inclusao/${id}/`)
}

export const deletar = id => {
  return http.delete(`/api/movimentacao/pedido-inclusao/${id}/`)
}

export const search = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortBy[0] === 'estado_solicitante_nome') {
    sortBy = sortBy.toString().replace('estado_solicitante_nome', 'estado_solicitante__nome')
  } else if (sortBy[0] === 'fase_pedido') {
    sortBy = sortBy.toString().replace('fase_pedido', 'fase_pedido__nome')
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/movimentacao/pedido-inclusao/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&search=${param}`
  )
}

export const searchCgin = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
  }

  if (sortBy[0] === 'estado_solicitante_nome') {
    sortBy = sortBy.toString().replace('estado_solicitante_nome', 'estado_solicitante__nome')
  } else if (sortBy[0] === 'fase_pedido') {
    sortBy = sortBy.toString().replace('fase_pedido', 'fase_pedido__nome')
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/movimentacao/pedido-inclusao/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&fase=cgin&search=${param}`
  )
}

export const searchEscolta = (sortBy, sortDesc, page, itemsPerPage, param) => {
  if (param == undefined) {
    param = ''
    if(!sortBy.length){
      sortBy = '-data_movimentacao'
    }
  }

  if (sortBy[0] === 'estado_solicitante_nome') {
    sortBy = sortBy.toString().replace('estado_solicitante_nome', 'estado_solicitante__nome')
  } else if (sortBy[0] === 'fase_pedido') {
    sortBy = sortBy.toString().replace('fase_pedido', 'fase_pedido__nome')
  } else if (sortBy[0] === 'unidade_nome') {
    sortBy = sortBy.toString().replace('unidade_nome', 'unidade__nome')
  }

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/movimentacao/pedido-inclusao/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&fase=escolta&search=${param}`
  )
}

export const searchAllEscolta = (param, pedidos) => {
  if (param == undefined) {
    param = ''
  }

  let list_pedidos = []
  if (pedidos == undefined) {
    list_pedidos = ''
  } else {
    pedidos.map(item=>{
      list_pedidos.push(item.id)
    })
  }

  return http.get(
    `/api/movimentacao/pedido-inclusao/?page_size=10000&fase=escolta&search=${param}&exclude_ids=${list_pedidos}`
  )
}

export const searchPessoa = (sortBy, sortDesc, page, itemsPerPage, param) => {
  !param.cpf && (param.cpf = '')
  !param.nome && (param.nome = '')
  !param.nome_mae && (param.nome_mae = '')

  if (sortDesc == 'true') {
    sortBy = '-' + sortBy
  }

  return http.get(
    `/api/movimentacao/pedido-inclusao/pessoas/?page=${page}&ordering=${sortBy}&page_size=${itemsPerPage}&cpf=${encodeURIComponent(param.cpf)}&nome=${encodeURIComponent(param.nome)}&nome_mae=${encodeURIComponent(param.nome_mae)}`
  )
}

export const inserir = params => {
  return http.post('api/movimentacao/pedido-inclusao/', params)
}

export const alterar = params => {
  return http.patch(`api/movimentacao/pedido-inclusao/${params.id}/`, params)
}

export const movimentar = params => {
  return http.post('api/movimentacao/pedido-movimentacao/', params)
}

export const getMovimentacoes = pedidoInclusaoId => {
  if (pedidoInclusaoId == undefined) {
    pedidoInclusaoId = ''
  }
  return http.get(`/api/movimentacao/pedido-movimentacao/?page_size=10000&ativo=true&ordering=-created_at&pedido_inclusao=${pedidoInclusaoId}`)
}

export const getTotalFases = () => {
  return http.get('/api/movimentacao/pedido-inclusao/total-fases/')
}

export const getTotalParecerCgin = () => {
  return http.get('/api/movimentacao/pedido-inclusao/total-parecer-cgin/')
}

export const getTotalUnidadesCgin = () => {
  return http.get('/api/movimentacao/pedido-inclusao/total-unidades-cgin/')
}

export const getTotalFasesMes = () => {
  return http.get('/api/movimentacao/pedido-inclusao/total-fases-mes/')
}

export const getTotalEstadoSolicitante = () => {
  return http.get('/api/movimentacao/pedido-inclusao/total-estado-solicitante/')
}