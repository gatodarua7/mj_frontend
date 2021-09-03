<template>
  <v-main>
    <barra-superior
      :titulo="$t('telefone.top.title')"
      :subtitulo="$t('telefone.top.subtitle')"
      :breadcrumbs="$t('telefone.top.breadcrumbsAlterar')"
    />
    <v-container fluid>
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="salvar()"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-autocomplete
                  v-model="telefone.tipo"
                  label="Tipo"
                  :items="tipoTelefones"
                  :rules="tipoRules"
                  clearable
                  @change="setMask()"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="telefone.numero"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  placeholder="(11) 11111-1111"
                  clearable
                  prepend-inner-icon="mdi-phone"
                  :rules="telefoneRules"
                />
              </v-col>
            </v-row>
            <v-row
              v-if="telefone.tipo == 'RAMAL'"
              dense
            >
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="telefone.andar"
                  label="Andar"
                  clearable
                />
              </v-col>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-text-field
                  v-model="telefone.sala"
                  label="Sala"
                  clearable
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col
                cols="12"
                lg="10"
                xs="12"
              >
                <v-textarea
                  v-model="telefone.observacao"
                  label="Observação"
                  filled
                />
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
              :disabled="!valid "
              color="blue darken-1"
              text
              type="submit"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import mensagens from '@/shared/mensagens'
import * as telefoneService from '@/services/TelefoneService'

export default {
  data: () => ({
    valid: true,    
    tipoTelefones: ['CELULAR', 'FUNCIONAL', 'RESIDENCIAL', 'RAMAL'],
    telefone: {},
    tipoRules: [v => !!v || 'Campo obrigatório'],
    telefoneRules: [
      v => !!v || 'Campo obrigatório',
      v =>
        (v && v.replace(/[\s+)(+-]/g, '').length <= 11) ||
        'Limite de 11 caracteres'
    ]
  }),
  mounted() {
    let id = this.$route.params.id
    telefoneService.getId(id).then(response => {
      this.telefone = response.data
      this.setMask()
    })
  },
  methods: {
    salvar() {      
      this.telefone.usuario_cadastro = this.user.user_id
      this.telefone.numero = this.telefone.numero.replace(/[\s+)(+-]/g, '')
      const response = this.telefone.id
        ? this.$api.update({resource: this.$endpoints.TELEFONE, id: this.telefone.id, data: this.telefone})
        : this.$api.create({resource: this.$endpoints.TELEFONE, data: this.telefone})
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
          this.displayErrors(error)
        })
    },
    setMask() {
      this.telefoneRules.splice(2)
      this.telefoneRules.push(
        v =>
          (v && v.replace(/[\s+)(+-]/g, '').length >= 10) ||
          'Mínimo de 10 caracteres'
      )
      this.telefone.numero = this.telefone.numero.replace(/[^\d]/g, '')
      this.telefone.numero = this.telefone.numero.replace(
        /^([0-9]{2})([0-9]{4,5})([0-9]{4})$/,
        '($1) $2-$3'
      )
    }
  }
}
</script>
