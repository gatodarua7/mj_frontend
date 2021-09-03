<template>
  <v-main>
    <barra-superior
      :titulo="$t('pedido_inclusao.top.title')"
      :subtitulo="$t('pedido_inclusao.top.subtitle')"
      :breadcrumbs="$t('pedido_inclusao.top.breadcrumbsAnalisarCgin')"
    />
    <v-container fluid>
      <v-card>
        <v-card-text>
          <v-card flat>
            <v-card-text>
              <form-pedido-inclusao
                v-if="carregado"
                ref="formPedidoInclusao"
                :pedido-inclusao="pedidoInclusao"
                :errors="errors"
                disabled
              />
            </v-card-text>
          </v-card>
          <v-card flat>
            <v-card-title v-show="historico.length">
              Manifestações anteriores
            </v-card-title>
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(item,i) in historico"
                  :key="i"
                >
                  <v-expansion-panel-header>
                    Data: {{ formatDateTime(item.created_at) }} - Responsável pelo parecer: {{ item.usuario }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                        sm="12"
                      >
                        Desfavorável ou favorável à inclusão: {{ item.posicionamento == 'FAVORAVEL' ? 'Favorável' : 'Desfavorável' }}
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        sm="12"
                      >
                        Penitenciária indicada: {{ item.penitenciaria_nome }}
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                        Parecer: {{ item.parecer }}
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
          <v-card flat>
            <v-card-title>
              Análise do Perfil do Preso
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-switch
                      v-model="posicionamento"
                      :label="
                        posicionamento ? 'Desfavorável ou favorável à inclusao: FAVORÁVEL' : 'Desfavorável ou favorável à inclusao: DESFAVORÁVEL'
                      "
                      inset
                      hide-details
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-autocomplete
                      v-model="analiseCgin.penitenciaria"
                      :items="unidades"
                      hide-no-data
                      hide-selected
                      item-text="nome"
                      item-value="id"
                      label="Penitenciária indicada"
                      clearable
                      :error-messages="errors.penitenciaria"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-textarea
                      v-model="analiseCgin.parecer"
                      label="Parecer"
                      :error-messages="errors.parecer"
                      filled
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            color="blue darken-1"
            text
            @click="sair"
          >
            Voltar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="limpar"
          >
            Limpar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="salvar"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as pedidoInclusaoService from '@/services/PedidoInclusaoService'
import * as unidadeService from '@/services/UnidadeService'
import mensagens from '@/shared/mensagens'
import FormPedidoInclusao from '../components/formPedidoInclusao.vue'

export default {
  components: { FormPedidoInclusao },
  data: () => ({
    carregado: false,
    pedidoInclusao: {
      motivos_inclusao: []
    },
    errors: {},
    analiseCgin: {},
    posicionamento: false,
    unidades: [],
    historico: []
  }),
  mounted() {
    this.getUnidades()
    let id = this.$route.params.id
    this.carregarDados(id)
  },
  methods: {
    carregarDados(id) {
      pedidoInclusaoService
        .getId(id)
        .then(res => {
          this.pedidoInclusao = Object.assign(this.pedidoInclusao, res.data)
          this.analiseCgin.pedido_inclusao = res.data.id
          this.carregarHistorico(res.data.id)
          this.carregado =  true
        })
        .catch(error => {
          this.displayErrors(error)
        })
    },
    async carregarHistorico(pedidoInclusaoId) {
      const response = await this.$api.list({resource: this.$endpoints.ANALISE_PEDIDO, query: {pedido_inclusao: pedidoInclusaoId}})
      this.historico = response.data.results
    },
    salvar() {
      this.analiseCgin.posicionamento = this.posicionamento ? 'FAVORAVEL' : 'DESFAVORAVEL'
      const response = this.$api.create({resource: this.$endpoints.ANALISE_PEDIDO, data: this.analiseCgin})
      response
        .then(() => {
          this.$router.back()
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    getUnidades() {
      unidadeService.getAll().then(response => {
        this.unidades = response.data.results
      })
    }
  }
}
</script>
