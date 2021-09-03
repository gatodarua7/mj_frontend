import http from '../config/request'

export const addOrUpdate = pessoa => {
  let metodo = 'post'
  let url = ''

  if (pessoa.id != null) {
    metodo = 'patch'
    url = pessoa.id + '/'
  }

  return http[metodo](`api/cadastros/pessoas/${url}`, pessoa)
}

export const pesquisaExataCompleta = (nome, mae, cpf, nascimento) => {
  const tipo_doc = 1

  return http.get(
    `api/cadastros/pessoas/?nome=${nome}&nome_mae=${mae}&documentos__tipo=${tipo_doc}&documentos__numero=${cpf}&data_nascimento=${nascimento}`
  )
}

/*
 * retorna todos os internos(a) que estão ativo no cadastro de pessoas
 */
export const listarInternosAtivos = () => {
  return http.get(
    '/api/cadastros/pessoas/?status=true&tipos_pessoa__modelo__descricao=INTERNO'
  )
}

/*
 * retorna todos os AGENTES FEDERAIS que estão ativo no cadastro de pessoas
 */
export const listarAgentesFederaisAtivos = () => {
  return http.get(
    '/api/cadastros/pessoas/?status=true&tipos_pessoa__modelo__descricao=POLICIAL+PENAL+FEDERAL'
  )
}
