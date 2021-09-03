<template>
  <v-main>
    <barra-superior
      :titulo="$t('escolta.top.title')"
      :subtitulo="$t('escolta.top.subtitle')"
      :breadcrumbs="$t('escolta.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-card>
        <v-card-text>
          <search-pedidos
            :object="escolta"
            :update="true"
            @desvincularPedido="salvar(false)"
          />
          <v-card flat>
            <v-card-title>
              Dados do agendamento
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                  >
                    <v-text-field
                      v-model="escolta.nome_missao"
                      label="Nome da missão"
                      :error-messages="errors.nome_missao"
                      counter="150"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="escolta.numero_sei"
                      v-mask="['#####.######/####-##']"
                      label="Nº SEI"
                      :error-messages="errors.numero_sei"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="escolta.numero_documento_sei"
                      v-mask="['##########']"
                      label="Nº Documento SEI"
                      :error-messages="errors.numero_documento_sei"
                      counter="10"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="12"
                  >
                    <v-text-field
                      v-model="escolta.ordem_missao"
                      label="Ordem de Missão Penitenciária"
                      :error-messages="errors.ordem_missao"
                      counter="50"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card flat>
            <v-card-text>
              <v-radio-group
                v-model="escolta.responsavel"
                :error-messages="errors.responsavel"
                row
              >
                <v-radio
                  label="Escolta DEPEN"
                  value="DEPEN"
                />
                <v-radio
                  label="Escolta ESTADO"
                  value="ESTADO"
                />
              </v-radio-group>
            </v-card-text>
          </v-card>
          <escolta-depen
            v-if="escolta.responsavel"
            v-show="escolta.responsavel == 'DEPEN'"
            ref="formDepen"
            :object="depen"
            :errors="errors"
          />
          <escolta-estado
            v-if="escolta.responsavel"
            v-show="escolta.responsavel == 'ESTADO'"
            ref="formEstado"
            :object="estado"
            :errors="errors"
          />
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
            @click="salvar(true)"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import SearchPedidos from './components/SearchPedidos.vue'
import EscoltaDepen from './components/EscoltaDepen.vue'
import EscoltaEstado from './components/EscoltaEstado.vue'
import * as escoltaService from '@/services/EscoltaService'
import mensagens from '@/shared/mensagens'

export default {
  components: {
    SearchPedidos,
    EscoltaDepen,
    EscoltaEstado
  },
  data: () => ({
    escolta: {
      pedidos_inclusao: [],
      servidores_escolta_aerea: [],      
      servidores_escolta_terrestre: [],
      voos: []
    },
    depen: {
      servidores_escolta_aerea: [],      
      servidores_escolta_terrestre: [],
      voos: []
    },
    estado: {},
    errors: {}
  }),
  mounted() {
    const id = this.$route.params.id
    escoltaService
      .getId(id)
      .then(res => {
        this.escolta = res.data
        if(this.escolta.responsavel=='DEPEN') {
          Object.assign(this.depen, this.escolta)
        } else {
          Object.assign(this.estado, this.escolta)
        }
      })
      .catch(err =>{
        this.displayErrors(err)
      })
  },
  methods: {
    limpar() {
      let id = this.escolta.id
      Object.assign(this.escolta, {
        data_inicio_aerea: null,
        data_fim_aerea: null,
        data_inicio_terrestre: null,
        data_fim_terrestre: null,
        hora_inicio_aerea: null,
        hora_fim_aerea: null,
        hora_inicio_terrestre: null,
        hora_fim_terrestre: null,
        nome_missao: null,
        numero_sei: null,
        numero_documento_sei: null,
        ordem_missao: null,
        tipo_aeronave: null,
        instituicao: null,
        responsavel: null,
        descricao_terrestre: null,
        descricao_aerea: null,
        fase_escolta_aerea: null,
        fase_escolta_terrestre: null,
        servidores_escolta_aerea: [],
        servidores_escolta_terrestre: [],
        pedidos_inclusao: [],
        voos: []
      })
      this.escolta.id = id
      this.errors = {}
    },
    limpaValidacaoEscolta() {
      this.errors = {}
    },
    salvar(next) {
      if(this.escolta.responsavel=='DEPEN') {
        Object.assign(this.escolta, this.depen)
      } else {
        Object.assign(this.escolta, this.estado)
      }
      this.escolta.hora_inicio_aerea = this.escolta.hora_inicio_aerea || null
      this.escolta.hora_fim_aerea = this.escolta.hora_fim_aerea || null
      this.escolta.hora_inicio_terrestre = this.escolta.hora_inicio_terrestre || null
      this.escolta.hora_fim_terrestre = this.escolta.hora_fim_terrestre || null
      escoltaService
        .alterar(this.escolta)
        .then(()=>{
          next && this.$router.push('/escolta')
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(err=>{
          this.errors = this.displayErrors(err)
        })
    }
  }
}
</script>
