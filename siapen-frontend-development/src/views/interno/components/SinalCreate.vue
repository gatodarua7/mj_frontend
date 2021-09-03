<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
  >
    <v-card>
      <v-card-title />

      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <sinais-upload
              ref="foto"
              :photo-id="sinal.foto"
              :readonly="readonly"
              @updatePhotoId="getFotoId"
            />
            <div
              v-show="errors.foto"
              class="red--text"
            >
              {{ errors.foto }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-form>
              <v-combobox
                v-model="sinal.tipo"
                :items="items"
                label="Tipo"
                :error-messages="errors.tipo"
              />
              <v-textarea
                v-model="sinal.descricao"
                label="Descrição"
                filled
                :error-messages="errors.descricao"
              />
                        
              <v-row
                justify="space-around"
              >
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Excluir
                </v-btn>

                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancelar
                </v-btn>

                <v-btn
                  color="blue darken-1"
                  text
                  @click="salvar"
                >
                  Salvar
                </v-btn>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SinaisUpload from './SinaisUpload.vue'
import * as sinalService from '@/services/SinalService'
import mensagens from '@/shared/mensagens'

export default {
  components: { SinaisUpload },
  data: () => ({
    dialog: false,
    readonly: false,
    items: ['SINAL', 'TATUAGEM'],
    sinal: {},
    errors: {}
  }),
  watch: {
    dialog() {      
      this.$refs.foto.limparArquivo()
    }
  },
  methods: {
    async getFotoId(id) {
      this.sinal.foto = id
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    close() {
      this.dialog = false
      this.sinal = {}
      this.errors = {}
      this.$refs.foto.limparArquivo()
    },
    open(internoId, area, positionX, positionY) {
      internoId && (this.sinal.interno = internoId)
      this.sinal.area = area
      this.sinal.position_x = positionX
      this.sinal.position_y = positionY
      this.dialog = true
    },
    salvar() {
      sinalService
        .inserir(this.sinal)
        .then(res => {
          sinalService.getId(res.data.id).then(result => {            
            this.$emit('createSinais', result.data)
            this.close()
            this.$store.dispatch('snackbar/setSnackbar', {
              text: `${mensagens('MSG1')}`,
              color: 'success',
              timeout: 3000
            })
          })
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    }
  }
}
</script>