<template>
  <v-main>
    <barra-superior
      :titulo="$t('escolta.top.title')"
      :subtitulo="$t('escolta.top.subtitle')"
      :breadcrumbs="$t('escolta.top.breadcrumbsPrincipal')"
    />
    <v-container fluid>
      <v-card>
        <v-card-title>
          <v-toolbar
            flat
          >
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoje
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer />
            <v-menu
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Dia</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mês</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            event-overlap-mode="column"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @change="updateRange"
          >
            <template v-slot:event="{event, eventParsed}">
              <strong>{{ formatDate(eventParsed.start.date) }} {{ event.hora_inicio }}</strong> - <strong>{{ event.tipo_escolta_nome }}</strong><br>
              <strong>Destino:</strong><br>
              <span v-html="returnListaDestino(event.unidade_nome)" /><br>
              <strong>Fase:</strong> {{ returnNomeFase(event.fase) }}
            </template>
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
            max-width="350px"
          >
            <v-card
              color="grey lighten-4"
            >
              <v-toolbar
                flat
                color="grey lighten-4"
              >
                <v-toolbar-title>
                  Escolta de {{ returnTipoEscolta(selectedEvent.tipo_escolta) }}
                </v-toolbar-title>
                <v-spacer />                
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      @click="expandirEscolta(selectedEvent.id)"
                      v-on="on"
                    >
                      <v-icon>open_in_full</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar escolta</span>
                </v-tooltip>
                <v-btn
                  icon
                  @click="selectedOpen = false"
                >
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <p>Escolta {{ selectedEvent.responsavel }} <span v-show="selectedEvent.responsavel=='DEPEN'">- <strong>{{ selectedEvent.numero_escolta }}</strong></span></p>
                <p v-show="selectedEvent.data_inicio_aerea">
                  Tipo: <strong>Aéreo</strong><br>
                  {{ selectedEvent.dia_semana_inicio_aereo }}, {{ formatDate(selectedEvent.data_inicio_aerea) }} {{ selectedEvent.hora_inicio_aerea }}<br>  
                  {{ selectedEvent.dia_semana_fim_aereo }},{{ formatDate(selectedEvent.data_fim_aerea) }} {{ selectedEvent.hora_fim_aerea }}<br>
                  Fase Aérea: {{ returnNomeFase(selectedEvent.fase_escolta_aerea) }}<br>
                </p>
                <p v-show="selectedEvent.data_inicio_terrestre">
                  Tipo: <strong>Terrestre</strong><br>
                  {{ selectedEvent.dia_semana_inicio_terrestre }}, {{ formatDate(selectedEvent.data_inicio_terrestre) }} {{ selectedEvent.hora_inicio_terrestre }}<br>  
                  {{ selectedEvent.dia_semana_fim_terrestre }}, {{ formatDate(selectedEvent.data_fim_terrestre) }} {{ selectedEvent.hora_fim_terrestre }}<br>
                  Fase Terrestre: {{ returnNomeFase(selectedEvent.fase_escolta_terrestre) }}<br>
                </p>
                <p>
                  Destino:<br>
                  <span v-html="returnListaDestino(selectedEvent.unidade_nome)" />
                </p>
                <p>Presos:<br> <span v-html="showPresos(selectedEvent.pedidos_inclusao)" /></p>
                <p>Organizador: {{ selectedEvent.usuario_cadastro_nome }}</p>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import * as escoltaService from '@/services/EscoltaService'

export default {
  data: () => ({
    focus: '',
    type: 'week',
    typeToLabel: {
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
  }),
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    showPresos(pedidos){
      let list_presos = []
      pedidos && pedidos.map(item=>{
        list_presos.push(item.nome)
      })
      return list_presos.join('<br>')
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      let cor = null
      switch (event.fase) {
        case 'AGENDADA':
          cor = 'orange darken-1' 
          break        
        case 'INICIADA_TERRESTRE':
          cor = 'light-blue darken-4' 
          break
        case 'INICIADA_AEREA':
          cor = 'light-blue darken-4' 
          break
        case 'EM_TRANSITO':
          cor = 'blue-grey darken-3' 
          break
        case 'FINALIZADA':
          cor = 'light-green darken-4' 
          break
        default:
          break
      }
      return cor
    },
    returnNomeFase(fase) {
      let nome = null
      switch (fase) {
        case 'AGENDADA':
          nome = 'Agendada' 
          break        
        case 'INICIADA_TERRESTRE':
          nome = 'Iniciada Escolta Terrestre' 
          break
        case 'INICIADA_AEREA':
          nome = 'Iniciada Escolta Aérea' 
          break
        case 'EM_TRANSITO':
          nome = 'Em Trânsito' 
          break
        case 'FINALIZADA':
          nome = 'Finalizada' 
          break
        default:
          break
      }
      return nome
    },
    returnListaDestino(unidades){
      return unidades && unidades.join('<br />')
    },
    returnTipoEscolta(tipoEscolta){
      return tipoEscolta == 'INCLUSAO' ? 'Inclusão' : null
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        escoltaService
          .getId(event.id)
          .then(res => {
            this.selectedEvent = res.data
          })        
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      escoltaService
        .calendario(start.date, end.date)
        .then(res => {
          this.events = res.data
        })
    },
    expandirEscolta(escoltaId) {
      this.$router.push(`/escolta/cadastro/detalhes/${escoltaId}`)
    }
  },
}
</script>

<style>
.v-event-timed {
  padding: .5rem;
}
</style>