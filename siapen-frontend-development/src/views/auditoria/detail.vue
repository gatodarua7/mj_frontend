<template>
  <v-main>
    <barra-superior
      titulo="Inteligência"
      subtitulo="Auditoria"
      :breadcrumbs="breadcrumbs"
    />

    <v-container fluid>
      <v-card>
        <v-card-title>
          Auditoria - Detalhamento do Evento
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="requested_at"
                label="Data/Hora"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.username_persistent"
                label="Usuário"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                label="Perfil"
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.path"
                label="Caminho da Funcionalidade"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.method"
                label="Método"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.status_code"
                label="Status da Requisição"
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.host"
                label="Nome da Estação"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                v-model="auditoria.remote_addr"
                label="IP"
                readonly
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              sm="12"
            >
              <v-text-field
                label="Origem da Requisição"
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-textarea
                v-model="auditoria.data"
                label="Conteúdo da Requisição"
                filled
                readonly
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <v-textarea
                v-model="auditoria.response"
                label="Conteúdo da Resposta"
                filled
                readonly
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn
            text
            color="primary"
            @click="sair"
          >
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    breadcrumbs: [
      {
        text: 'Dashboard',
        to: '/',
        exact: true
      },
      {
        text: 'Auditoria',
        to: '/auditoria',
        exact: true
      },
      {
        text: 'Auditoria - Detalhamento do Evento',
        disabled: true
      }
    ],
    auditoria: {},
    requested_at: null
  }),
  mounted() {
    this.getAuditoria(this.$route.params.id)
  },
  methods: {
    async getAuditoria(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.AUDITORIA,
        id: id
      })
      this.auditoria = response.data
      this.requested_at = this.formatDateTime(this.auditoria.requested_at)
    }
  }
}
</script>
