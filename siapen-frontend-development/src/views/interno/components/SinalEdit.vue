<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
    persistent
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
              @deletePhoto="desvincularFoto"
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
                :disabled="readonly"
                :error-messages="errors.tipo"
              />
              <v-textarea
                v-model="sinal.descricao"
                label="Descrição"
                filled
                :disabled="readonly"
                :error-messages="errors.descricao"
              />
                        
              <v-row
                justify="space-around"
              >
                <v-spacer />
                <v-btn
                  v-show="!readonly"
                  color="blue darken-1"
                  text
                  @click="deletar(sinal)"
                >
                  Excluir
                </v-btn>

                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  {{ readonly ? "Fechar" : "Cancelar" }}
                </v-btn>

                <v-btn
                  v-show="!readonly"
                  color="blue darken-1"
                  text
                  :disabled="!sinal.foto"
                  @click="salvar"
                >
                  Salvar
                </v-btn>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>      
      <PromptDialog ref="prompt" />
    </v-card>
  </v-dialog>
</template>

<script>
import SinaisUpload from './SinaisUpload.vue'
import PromptDialog from '@/components/PromptDialog.vue'
import * as sinalService from '@/services/SinalService'
import mensagens from '@/shared/mensagens'

export default {
  components: { SinaisUpload, PromptDialog },  
  data: () => ({
    dialog: false,
    readonly: false,
    items: ['SINAL', 'TATUAGEM'],
    sinal: {},
    errors: {}
  }),
  methods: {
    async getFotoId(id) {
      this.sinal.foto = id
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    async desvincularFoto() {
      this.sinal.foto = null
    },
    close() {
      this.dialog = false
      this.sinal = {}
      this.errors = {}
    },
    async deletar(item) {
      const res = await this.$refs.prompt.open(
        'Excluir sinal ou tatuagem',
        'Você tem certeza que deseja excluir este sinal ou tatuagem ?'
      )
      if (res) {
        const params = {
          id: item.id,
          motivo_exclusao: res,
          excluido: true
        }
        sinalService
          .deletar(params)
          .then(() => {
            this.$emit('deletarSinais', item)
            this.close()
          })
      }
    },
    open(id, readonly) {
      this.readonly = readonly
      sinalService
        .getId(id)
        .then(res => {
          this.sinal = res.data
          this.dialog = true
        })
    },
    salvar() {
      sinalService
        .alterar(this.sinal)
        .then(res => {
          sinalService.getId(res.data.id).then(result => {
            this.$emit('updateSinais', result.data)
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