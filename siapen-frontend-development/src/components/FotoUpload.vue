<template>
  <div class="text-center mt-5">
    <form
      ref="form"
      enctype="multipart/form-data"
    >
      <v-dialog
        v-model="dialog"
        width="auto "
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            v-if="miniaturaUrl && ativo"
            :size="photoSize"
            v-bind="attrs"
            v-on="on"
          >
            <v-img
              :src="miniaturaUrl"
              cover
            />
          </v-avatar>
          <v-avatar
            v-else
            :size="photoSize"
          >
            <v-icon
              color="grey darken-4"
              :size="photoSize"
            >
              account_circle
            </v-icon>
          </v-avatar>
        </template>

        <v-card>
          <v-card-title />
          <v-card-text>
            <v-img
              :src="photoUrl"
              class="img"
            />
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <input
        ref="file"
        type="file"
        hidden
        @change="selecionarArquivo"
      >
      <div
        v-if="!readonly"
        class="mt-4"
      >
        <v-toolbar-items>
          <v-tooltip
            v-if="!cantDelete"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                large
                v-bind="attrs"
                :disabled="!miniaturaUrl"
                @click="removerArquivo"
                v-on="on"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <span>Excluir a imagem</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                large
                :disabled="loading"
                v-bind="attrs"
                @click="abrirArquivo"
                v-on="on"
              >
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                /><v-icon v-else>
                  photo_camera
                </v-icon>
              </v-btn>
            </template>
            <span>Selecione a imagem</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                large
                v-bind="attrs"
                :disabled="!miniaturaUrl"
                @click="ocultarArquivo"
                v-on="on"
              >
                <v-icon>
                  {{
                    ativo ? "visibility" : "visibility_off"
                  }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ ativo ? "Ocultar a imagem" : "Mostrar a imagem" }}</span>
          </v-tooltip>
        </v-toolbar-items>
      </div>
    </form>
    <ConfirmDialog ref="confirm" />
  </div>
</template>
<script>
import * as fotoService from '@/services/FotoService'
import mensagens from '@/shared/mensagens'

export default {
  components: {
    ConfirmDialog: () => import('./ConfirmDialog')
  },
  props: ['photoId', 'update', 'readonly', 'cantDelete'],
  data: () => ({
    dialog: false,
    loading: false,
    file: null,
    miniaturaUrl: null,
    photoUrl: null,
    photoSize: 192,
    ativo: true,
    id: null
  }),
  mounted() {
    this.photoId && this.carregarArquivo(this.photoId)
  },
  methods: {
    async removerArquivo() {
      if (
        await this.$refs.confirm.open(
          'Excluir imagem',
          'Você tem certeza que deseja excluir esta imagem ?'
        )
      ) {
        this.$refs.form.reset()
        this.file = null
        this.miniaturaUrl = null
        this.photoUrl = null
        this.excluirArquivo()
      }
    },
    forcarRemocaoArquivo() {      
      this.$refs.form.reset()
      this.file = null
      this.miniaturaUrl = null
      this.photoUrl = null
    },
    abrirArquivo() {
      this.$refs.file.click()
    },
    selecionarArquivo() {
      this.file = this.$refs.file.files[0]
      this.enviarArquivo()
    },
    async enviarArquivo() {
      this.loading = true
      const formData = new FormData()
      formData.append('foto_temp', this.file)
      await fotoService
        .inserir(formData)
        .then(response => {
          response.data.detail &&
            this.$store.dispatch('snackbar/setSnackbar', {
              text: response.data.detail,
              color: 'warning',
              timeout: 3000
            })
          this.$emit('updatePhotoId', response.data.id)
          this.carregarArquivo(response.data.id)
          this.$store.dispatch('snackbar/setSnackbar', {
            text: `${mensagens('MSG1')}`,
            color: 'success',
            timeout: 3000
          })
        })
        .catch(error => {
          if (error.response.status == 400) {
            const mensagensErro = error.response.data
            for (var itemErro in mensagensErro) {
              this.$store.dispatch('snackbar/setSnackbar', {
                text: `${mensagensErro[itemErro]}`,
                color: 'error',
                timeout: 3000
              })
            }
          } else if (error.response.status >= 500) {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: `${mensagens('MSG19')}`,
              color: 'error',
              timeout: 3000
            })
          } else {
            this.$store.dispatch('snackbar/setSnackbar', {
              text: error.response.data.detail,
              color: 'error',
              timeout: 3000
            })
          }
        })
      this.loading = false
    },
    async excluirArquivo() {
      this.loading = true
      // await fotoService.deletar({ id: this.photoId })
      this.$emit('deletePhoto')
      // this.carregarArquivo(this.photoId)
      this.loading = false
    },
    async ocultarArquivo() {
      this.ativo = !this.ativo
      if (this.photoId) {
        await fotoService.alterar({ id: this.photoId, ativo: this.ativo })
        this.carregarArquivo(this.photoId)
      }
    },
    async carregarArquivo(val) {
      this.loading = true
      val &&
        await fotoService.getId(val).then(res => {
          this.ativo = res.data.ativo
          this.miniaturaUrl = res.data.thumbnail
          this.photoUrl = res.data.foto
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.img {
  max-width: 500px;
}
.v-toolbar__items {
  align-items: center;
  justify-content: center;
}
.theme--light.v-btn.v-btn--disabled .v-icon,
.theme--light.v-btn.v-btn--disabled .v-btn__loading {
  color: #ffffff !important;
}
</style>
