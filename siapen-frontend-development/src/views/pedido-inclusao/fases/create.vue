<template>
  <v-main>
    <barra-superior
      :titulo="$t('fase.top.title')"
      :subtitulo="$t('fase.top.subtitle')"
      :breadcrumbs="$t('fase.top.breadcrumbsCadastrar')"
    />
    <v-container fluid>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-data-table
                :headers="headers"
                :items="fases"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:top>
                  <v-row>
                    <v-col
                      cols="12"
                      md="8"
                      sm="12"
                    >
                      <v-form
                        ref="form"
                        v-model="valid"
                      >
                        <v-text-field
                          v-model="grupo"
                          disabled
                          label="Grupo"
                          :rules="[(v) => !!v || 'Campo obrigatório']"
                        />
                        <v-text-field
                          v-model="fase.nome"
                          label="Nome"
                          :counter="150"
                          :rules="[(v) => !!v || 'Campo obrigatório',
                                   (v) => (v && v.length <= 150) || 'Limite de 150 caracteres']"
                        />
                        <v-textarea
                          v-model="fase.descricao"
                          label="Descrição"
                          filled
                          :rules="[(v) => !!v || 'Campo obrigatório']"
                        />
                        <v-row v-if="!fase.fase_inicial">
                          <v-col
                            cols="12"
                            md="6"
                            sm="12"
                          >
                            <v-radio-group
                              v-model="fase.fase"
                              @change="fase.ultima_fase = null"
                            >
                              <v-radio
                                label="Última fase"
                                value="ULTIMA_FASE"
                              />
                              <v-radio
                                label="Análise da CGIN"
                                value="CGIN"
                              />
                              <v-radio
                                label="Arquivar"
                                value="ARQUIVAR"
                              />
                              <v-radio
                                label="Desarquivar"
                                value="DESARQUIVAR"
                              />
                              <v-radio
                                label="Remetido os autos ao Juízo corregedor"
                                value="REMETIDO"
                              />
                              <v-radio
                                label="Recebido os autos do Juízo corregedor"
                                value="RECEBIDO"
                              />
                            </v-radio-group>
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            sm="12"
                          >
                            <v-radio-group
                              v-if="fase.fase == 'ULTIMA_FASE'"
                              v-model="fase.ultima_fase"
                              :rules="[
                                v =>
                                  fase.fase == 'ULTIMA_FASE' && !!v ||
                                  'O campo é de preenchimento obrigatório'
                              ]"
                            >
                              <v-radio
                                label="Finalizado pelo juízo corregedor, com parecer favorável para inclusão"
                                value="DEFERIDO"
                              />
                              <v-radio
                                label="Finalizado pelo juízo corregedor, com parecer desfavorável para inclusão"
                                value="INDEFERIDO"
                              />
                            </v-radio-group>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                      sm="12"
                    >
                      Selecione a cor da fase:
                      <v-color-picker
                        v-model="cor"
                        mode="hexa"
                        hide-mode-switch
                      />
                    </v-col>
                  </v-row>
                  <v-toolbar
                    flat
                    color="white"
                  >
                    <v-spacer />
                    <v-btn
                      color="primary"
                      class="mb-2"
                      text
                      :disabled="!valid || cor=='#FFFFFF'"
                      @click="adicionar"
                    >
                      {{ faseIndex != -1 ? "Alterar" : "Adicionar" }}
                    </v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:body>
                  <draggable
                    :list="fases"
                    tag="tbody"
                    draggable=".linha"
                  >
                    <tr
                      v-for="(item, index) in fases"
                      :key="index"
                      :item="item"
                      :class="index > 0 ? 'linha' : ''"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>
                        <v-alert
                          dense
                          outlined
                          border="left"
                          :color="item.cor"
                          class="my-2 text-center"
                        >
                          {{ item.nome }}
                        </v-alert>
                      </td>
                      <td>
                        <v-tooltip
                          v-if="!!item.ultima_fase"
                          top
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              text
                              v-bind="attrs"
                              v-on="on"
                            >
                              SIM
                              <v-icon
                                v-if="item.ultima_fase=='INDEFERIDO'"
                                color="red"
                              >
                                info
                              </v-icon>
                              <v-icon
                                v-else
                                color="green"
                              >
                                info
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>{{ tooltipUltimaFase(item) }}</span>
                        </v-tooltip>
                        <v-btn
                          v-else
                          text
                        >
                          NÃO
                        </v-btn>
                      </td>
                      <td>
                        <v-switch
                          v-if="index > 0"
                          v-model="item.ativo"
                          @mousedown="ativarItem(item)"
                        />
                      </td>
                      <td>
                        <v-toolbar-items>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                @click="editarItem(item)"
                                v-on="on"
                              >
                                <v-icon>edit</v-icon>
                              </v-btn>
                            </template>
                            <span>Editar</span>
                          </v-tooltip>
                          <v-tooltip
                            v-if="index > 0"
                            top
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                v-bind="attrs"
                                @click="excluirItem(item)"
                                v-on="on"
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Excluir</span>
                          </v-tooltip>
                        </v-toolbar-items>
                      </td>
                    </tr>
                  </draggable>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
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
      <PromptDialog ref="prompt" />
      <ConfirmDialog ref="confirm" />
    </v-container>
  </v-main>
</template>

<script>
import draggable from 'vuedraggable'
import PromptDialog from '@/components/PromptDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import * as fasesService from '@/services/FasesService'
import mensagens from '@/shared/mensagens'

export default {
  components: { draggable, PromptDialog, ConfirmDialog },
  data: () => ({
    valid: false,
    grupo: null,
    cor: '#FF0000',
    faseIndex: -1,
    fase: {},
    headers: [
      { text: 'Ordenação', value: 'ordem', sortable: false },
      { text: 'Fase', value: 'nome', sortable: false },
      { text: 'Última fase ?', value: 'ultima_fase', sortable: false },
      { text: 'Ativo', value: 'ativo', sortable: false },
      { text: 'Ações', value: 'action', sortable: false },
    ],
    fases: [],
  }),
  mounted() {
    this.grupo = this.$route.params.grupo
    this.carregarFases()
  },
  methods: {
    limpar() {
      this.$refs.form.resetValidation()
      this.faseIndex = -1
      this.fase = {}
    },
    adicionar() {
      this.fase.cor = this.cor
      this.fase.grupo = this.grupo
      this.faseIndex > -1 ? this.alterar() : this.inserir()
      this.$refs.form.resetValidation()      
      this.faseIndex = -1
      this.fase = {}
    },
    carregarFases() {
      fasesService.getAllByGrupo(this.grupo).then((res) => {
        this.fases = res.data.results
      })
    },
    inserir(){
      let index = this.fases.findIndex(el => !!el.ultima_fase === true)
      this.fase.usuario_cadastro = this.user.user_id
      this.fase.ativo = true
      if (!this.fase.ultima_fase && index > -1) {
        this.fases.splice(index, 0, this.fase)
      } else {
        this.fases.push(this.fase)
      }
    },
    alterar(){
      let index = this.fases.findIndex(el => !!el.ultima_fase === true)
      this.fase.usuario_edicao = this.user.user_id
      if (this.fase.ultima_fase) {
        if (this.faseIndex < index) {
          this.fases.splice(this.faseIndex, 1)
          this.fases.push(this.fase)
        } else {
          Object.assign(this.fases[this.faseIndex], this.fase)
        }
      } else {
        if (index > -1 && this.faseIndex < index || this.faseIndex == 0) {
          Object.assign(this.fases[this.faseIndex], this.fase)
        } else {
          this.fases.splice(this.faseIndex, 1)
          this.fases.splice(index, 0, this.fase)
        }
      }
    },
    async ativarItem(item) {
      const index = this.fases.indexOf(item)
      const res = await this.$refs.prompt.open(
        item.ativo ? 'Desativar registro' : 'Ativar registro',
        item.ativo ? `${mensagens('MSG18')}` : `${mensagens('MSG17')}`
      )
      if (res) {
        item.ativo = !item.ativo
        let user = this.user.user_id
        let data = {
          id: item.id,
          ativo: item.ativo,
        }
        if (item.ativo) {
          item.motivo_ativacao = res
          Object.assign(data, {motivo_ativacao: item.motivo_ativacao, usuario_ativacao: user})
        } else {
          item.motivo_inativacao = res
          Object.assign(data, {motivo_inativacao: item.motivo_inativacao, usuario_inativacao: user})
        }
        if (item.id) {
          fasesService
            .alterar(data)
            .then(response => {
              this.fases.splice(index, 1)
              this.fases.splice(index, 0, response.data)
              this.$store.dispatch('snackbar/setSnackbar', {
                text: `${mensagens('MSG1')}`,
                color: 'success',
                timeout: 3000
              })
            })
            .catch(error => {
              this.errors = this.displayErrors(error)
            })
        } else {
          this.fases.splice(index, 1)
          this.fases.splice(index, 0, item)
        }
      }
    },
    editarItem(item) {
      this.faseIndex = this.fases.indexOf(item)
      this.fase = Object.assign({}, item)
      this.cor = this.fase.cor
    },
    async excluirItem(item) {
      if (
        await this.$refs.confirm.open(
          'Excluir registro',
          'Você tem certeza que deseja excluir esse registro ?'
        )
      ) {
        if (item.id) {
          fasesService
            .deletar(item.id)
            .then(() => {
              const index = this.fases.indexOf(item)
              this.fases.splice(index, 1)
              this.salvar()
            })
            .catch(error => {
              this.errors = this.displayErrors(error)
            })
        } else {
          const index = this.fases.indexOf(item)
          this.fases.splice(index, 1)
        }
      }
    },
    salvar() {
      let lista = this.fases.map((res, i) => {
        res.ordem = i + 1
        return res
      })
      fasesService
        .inserir(lista)
        .then(() => {
          this.carregarFases()
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
    corTexto(hexcolor) {
      if (hexcolor.slice(0, 1) === '#') {
        hexcolor = hexcolor.slice(1)
      }
      if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(function (hex) {
          return hex + hex
        }).join('')
      }
      var r = parseInt(hexcolor.substr(0,2),16)
      var g = parseInt(hexcolor.substr(2,2),16)
      var b = parseInt(hexcolor.substr(4,2),16)
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? false : true
    },
    tooltipUltimaFase(item) {
      return item.ultima_fase=='DEFERIDO'
        ? 'Finalizado pelo juízo corregedor, com parecer favorável para inclusão'
        : 'Finalizado pelo juízo corregedor, com parecer desfavorável para inclusão'
    }
  },
}
</script>