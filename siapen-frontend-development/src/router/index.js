import Vue from 'vue'
import VueRouter from 'vue-router'
import { isValidToken } from '@/services/auth.service'

Vue.use(VueRouter)

const Layout = () => import(/* webpackChunkName: "layout" */ '@/layout/Aplicacao')

const routeOptions = [
  // Prisional
  { path: 'sistema-penal', name: 'prisional/sistema-penal/list' },
  { path: 'sistema-penal/cadastro/:id?', name: 'prisional/sistema-penal/form' },
  { path: 'unidades', name: 'prisional/unidade/list' },
  { path: 'unidades/cadastro/:id?', name: 'prisional/unidade/form' },
  { path: 'bloco', name: 'prisional/bloco/list' },
  { path: 'bloco/cadastro/:id?', name: 'prisional/bloco/form' },
  { path: 'cela', name: 'prisional/cela/list' },
  { path: 'cela/cadastro/:id?', name: 'prisional/cela/form' },
  { path: 'defeito', name: 'prisional/defeito/list' },
  { path: 'defeito/cadastro/:id?', name: 'prisional/defeito/form' },
  // Inteligência
  { path: 'faccao', name: 'inteligencia/faccao/list' },
  { path: 'faccao/cadastro/:id?', name: 'inteligencia/faccao/form' },
  { path: 'faccao-cargo', name: 'inteligencia/faccao-cargo/list' },
  { path: 'faccao-cargo/cadastro/:id?', name: 'inteligencia/faccao-cargo/form' },
  { path: 'faccao-grupo', name: 'inteligencia/faccao-grupo/list' },
  { path: 'faccao-grupo/cadastro/:id?', name: 'inteligencia/faccao-grupo/form' },
  { path: 'faccao-pessoa', name: 'inteligencia/faccaoPessoa/list' },
  { path: 'faccao-pessoa/cadastro/:id?', name: 'inteligencia/faccaoPessoa/form' },
  // Parametrização
  { path: 'setor', name: 'parametrizacao/setor/list' },
  { path: 'setor/cadastro', name: 'parametrizacao/setor/create' },
  { path: 'setor/cadastro/:id', name: 'parametrizacao/setor/edit' },
  { path: 'setor/cadastro/detalhes/:id', name: 'parametrizacao/setor/detail' },
  { path: 'genero', name: 'parametrizacao/genero/list' },
  { path: 'genero/cadastro/:id?', name: 'parametrizacao/genero/form' },
  { path: 'funcao', name: 'parametrizacao/funcao/list' },
  { path: 'funcao/cadastro/:id?', name: 'parametrizacao/funcao/form' },
  { path: 'tipo-documento', name: 'parametrizacao/tipo-documento/list' },
  { path: 'tipo-documento/cadastro/:id?', name: 'parametrizacao/tipo-documento/form' },
  { path: 'cargo', name: 'parametrizacao/cargo/list' },
  { path: 'cargo/cadastro/:id?', name: 'parametrizacao/cargo/form' },
  { path: 'telefone', name: 'parametrizacao/telefone/list' },
  { path: 'telefone/cadastro/:id?', name: 'parametrizacao/telefone/form' },
  { path: 'orientacao-sexual', name: 'parametrizacao/orientacao-sexual/list' },
  { path: 'orientacao-sexual/cadastro/:id?', name: 'parametrizacao/orientacao-sexual/form' },
  { path: 'raca', name: 'parametrizacao/raca/list' },
  { path: 'raca/cadastro/:id?', name: 'parametrizacao/raca/form' },
  { path: 'religiao', name: 'parametrizacao/religiao/list' },
  { path: 'religiao/cadastro/:id?', name: 'parametrizacao/religiao/form' },
  { path: 'vinculo', name: 'parametrizacao/vinculo/list' },
  { path: 'vinculo/cadastro/:id?', name: 'parametrizacao/vinculo/form' },
  { path: 'necessidade-especial', name: 'parametrizacao/necessidade-especial/list' },
  { path: 'necessidade-especial/cadastro/:id?', name: 'parametrizacao/necessidade-especial/form' },
  { path: 'estado-civil', name: 'parametrizacao/estado-civil/list' },
  { path: 'estado-civil/cadastro/:id?', name: 'parametrizacao/estado-civil/form' },
  { path: 'grau-instrucao', name: 'parametrizacao/grau-instrucao/list' },
  { path: 'grau-instrucao/cadastro/:id?', name: 'parametrizacao/grau-instrucao/form' },
  { path: 'profissao', name: 'parametrizacao/profissao/list' },
  { path: 'profissao/cadastro/:id?', name: 'parametrizacao/profissao/form' },
  { path: 'orgao-expedidor', name: 'parametrizacao/orgao-expedidor/list' },
  { path: 'orgao-expedidor/cadastro/:id?', name: 'parametrizacao/orgao-expedidor/form' },
  { path: 'regime-prisional', name: 'parametrizacao/regime-prisional/list' },
  { path: 'regime-prisional/cadastro/:id?', name: 'parametrizacao/regime-prisional/form' },
  { path: 'grau-periculosidade', name: 'parametrizacao/grau-periculosidade/list' },
  { path: 'grau-periculosidade/cadastro/:id?', name: 'parametrizacao/grau-periculosidade/form' },
  { path: 'comportamento-interno', name: 'parametrizacao/comportamento-interno/list' },
  { path: 'comportamento-interno/cadastro/:id?', name: 'parametrizacao/comportamento-interno/form' },
  { path: 'titulo', name: 'parametrizacao/titulo/list' },
  { path: 'titulo/cadastro/:id?', name: 'parametrizacao/titulo/form' },
  { path: 'norma-juridica', name: 'parametrizacao/norma-juridica/list' },
  { path: 'norma-juridica/cadastro/:id?', name: 'parametrizacao/norma-juridica/form' },
  // Servidor
  { path: 'servidor', name: 'servidor/list' },
  { path: 'servidor/cadastro', name: 'servidor/create' },
  { path: 'servidor/cadastro/:id', name: 'servidor/edit' },
  { path: 'servidor/cadastro/detalhes/:id', name: 'servidor/detail' },
  // Interno
  { path: 'interno', name: 'interno/list' },
  { path: 'interno/cadastro', name: 'interno/create' },
  { path: 'interno/cadastro/:id', name: 'interno/edit' },
  { path: 'interno/cadastro/detalhes/:id', name: 'interno/detail' },
  // Advogado
  { path: 'advogado', name: 'advogado/list' },
  { path: 'advogado/cadastro', name: 'advogado/create' },
  { path: 'advogado/cadastro/:id', name: 'advogado/edit' },
  { path: 'advogado/cadastro/detalhes/:id', name: 'advogado/detail' },
  // Visitante
  { path: 'visitante', name: 'visitante/list' },
  { path: 'visitante/cadastro', name: 'visitante/create' },
  { path: 'visitante/cadastro/:id', name: 'visitante/edit' },
  { path: 'visitante/cadastro/detalhes/:id', name: 'visitante/detail' },
  { path: 'visitante/assistencia', name: 'visitante/assistencia-social/list' },
  { path: 'visitante/inteligencia', name: 'visitante/inteligencia/list' },
  { path: 'visitante/inteligencia/:id', name: 'visitante/inteligencia/create' },
  { path: 'visitante/inteligencia/detalhes/:id', name: 'visitante/inteligencia/detail' },
  { path: 'visitante/diretoria', name: 'visitante/diretoria/list' },
  { path: 'visitante/diretoria/:id', name: 'visitante/diretoria/create' },
  { path: 'visitante/diretoria/detalhes/:id', name: 'visitante/diretoria/detail' },
  { path: 'visitante/timeline/:id', name: 'visitante/timeline' },
  // Pedido de Inclusão
  { path: 'pedido-inclusao', name: 'pedido-inclusao/list' },
  { path: 'pedido-inclusao/cadastro/:id', name: 'pedido-inclusao/edit' },
  { path: 'pedido-inclusao/cadastro/:tipo?/:id?', name: 'pedido-inclusao/create' },
  { path: 'pedido-inclusao/detalhes/:id', name: 'pedido-inclusao/detail' },
  { path: 'pedido-inclusao/dashboard', name: 'pedido-inclusao/dashboard' },
  { path: 'pedido-inclusao/fase/:grupo', name: 'pedido-inclusao/fases/create' },
  { path: 'pedido-inclusao/fase', name: 'pedido-inclusao/fases/list' },
  { path: 'pedido-inclusao/fase/detalhes/:grupo', name: 'pedido-inclusao/fases/detail' },
  { path: 'pedido-inclusao/timeline/:id', name: 'pedido-inclusao/timeline' },
  { path: 'pedido-inclusao/pessoas', name: 'pedido-inclusao/pessoas/list' },
  { path: 'pedido-inclusao/cgin', name: 'pedido-inclusao/cgin/list' },
  { path: 'pedido-inclusao/escolta', name: 'pedido-inclusao/escolta/list' },
  { path: 'pedido-inclusao/cgin/analise/:id', name: 'pedido-inclusao/cgin/create' },
  { path: 'pedido-inclusao/cgin/detalhes/:id', name: 'pedido-inclusao/cgin/detail' },
  { path: 'pedido-inclusao/cgin/analise/editar/:pedidoId/:analiseId', name: 'pedido-inclusao/cgin/edit' },
  // Escolta
  { path: 'escolta', name: 'escolta/list' },
  { path: 'escolta/cadastro/pedidos/:ids?', name: 'escolta/create' },
  { path: 'escolta/cadastro/:id', name: 'escolta/edit' },
  { path: 'escolta/cadastro/detalhes/:id', name: 'escolta/detail' },
  { path: 'escolta/agenda', name: 'escolta/calendar' },
  // Auditoria
  { path: 'auditoria', name: 'auditoria/list' },
  { path: 'auditoria/:id', name: 'auditoria/detail' },
]

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import(/* webpackChunkName: "[request]" */ `@/views/${route.name}`)
  }
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/layout/Login')
    },
    {
      path: '/',
      component: Layout,
      children: routes
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('siapen@accessToken')
  if (to.name !== 'Login' && !isValidToken(token)) next({ name: 'Login' })
  else next()
})

export default router
