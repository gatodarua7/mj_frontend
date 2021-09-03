const mensagens = (id, campo) => {
  let MSGS = {
    MSG1: 'Registro salvo com sucesso.',
    MSG2: `O campo ${campo} é de preenchimento obrigatório.`,
    MSG3: 'Nenhum resultado foi encontrado para sua pesquisa.',
    MSG4: 'Já existe registro cadastrado com esses dados.',
    MSG5: 'Registro excluído com sucesso.',
    MSG6: 'Telefone incluído na lista com sucesso.',
    MSG7: 'Telefone alterado com sucesso.',
    MSG8: 'Telefone excluído com sucesso.',
    MSG9: 'Endereço incluído na lista com sucesso.',
    MSG10: 'Endereço alterado com sucesso.',
    MSG11: 'Endereço excluído com sucesso.',
    MSG12: 'Documento incluído com sucesso.',
    MSG13: 'Documento alterado com sucesso.',
    MSG14: 'Documento excluído com sucesso.',
    MSG15: 'Adicione um documento do tipo CPF para concluir o cadastro.',
    MSG16: 'Não é possível excluir registros com vínculos no sistema.',
    MSG17: 'Deseja ativar o registro?',
    MSG18: 'Deseja desativar o registro?',
    MSG19: 'Erro ao conectar com servidor.',
    MSG20: 'Você tem certeza que deseja excluir esse registro?',
    MSG21: 'Ainda não há registro cadastrado.',
    MSG22: 'Ainda não há setor cadastrado.',
    MSG23: 'O servidor está ativo no sistema. Para acessar as funcionalidades é necessário conceder as permissões de acesso ao sistema.',
    MSG24: 'Tamanho do arquivo não suportado. O arquivo deve ter no máximo 15MB',
    MSG25: 'Tamanho da imagem não suportado. O arquivo deve ter no máximo 1MB.',
    MSG26: 'Não é permitido cadastrar um interno menor que 18 anos. Favor verificar a data de nascimento.',
    MSG27: 'Registro inativado com sucesso.',
    MSG28: 'Registro ativado com sucesso.',
    MSG29: 'Deseja arquivar o registro?',
    MSG30: 'Não é permitido cadastrar um indivíduo menor que 18 anos. Favor verificar a data de nascimento',
    MSG31: 'Não é possível excluir o pedido de inclusão. O pedido está na fase <nome da fase>',
    MSG32: 'Não é possível realizar o pedido de inclusão. O interno encontra-se ativo no sistema.',
    MSG33: 'Registro alterado com sucesso.',
    MSG34: 'Não há fase cadastrada no sistema. Favor verificar',
    MSG35: 'Não é possível agendar uma escolta sem registros selecionados. Favor selecione pelo menos um registro.',
    MSG36: 'Não há presos vinculados ao agendamento.',
    MSG37: 'O agente está vinculado a outra escolta. Favor verificar',
    MSG38: 'Agente não encontrado.',
    MSG39: 'Não é possível realizar o agendamento. Existe pedido de inclusão com a data maior que a data do início do agendamento.'
  }

  return MSGS[id]
}

export default mensagens