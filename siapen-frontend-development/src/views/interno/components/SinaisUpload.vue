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
          <v-card
            class="mx-auto"
            tile
            flat
          >
            <v-img
              v-if="thumbnailUrl && ativo"
              contain
              aspect-ratio="1.5"
              :src="thumbnailUrl"
              v-bind="attrs"
              v-on="on"
            />
            <v-img
              v-else
              contain
              aspect-ratio="1.5"
              src="data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q=="
            />
          </v-card>
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
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                large
                v-bind="attrs"
                :disabled="!thumbnailUrl"
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
                v-bind="attrs"
                @click="abrirArquivo"
                v-on="on"
              >
                <v-icon>
                  photo_camera
                </v-icon>
              </v-btn>
            </template>
            <span>Selecione a imagem</span>
          </v-tooltip>
        </v-toolbar-items>
      </div>
      <div
        v-show="errors.foto_temp"
        class="red--text"
      >
        {{ errors.foto_temp }}
      </div>
    </form>
    <ConfirmDialog ref="confirm" />
  </div>
</template>
<script>
import * as fotoService from '@/services/FotoService'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  components: { ConfirmDialog },
  props: ['photoId', 'update', 'readonly'],
  data: () => ({
    dialog: false,
    file: null,
    thumbnailUrl: null,
    photoUrl: null,
    photoSize: 192,
    ativo: true,
    id: null,
    errors: {}
  }),
  watch: {
    photoId(val) {
      this.thumbnailUrl = null
      this.carregarArquivo(val)
    }
  },
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
        this.thumbnailUrl = null
        this.photoUrl = null
        this.photoId && this.excluirArquivo()
      }
    },
    limparArquivo() {
      this.$refs.form.reset()
      this.file = null
      this.thumbnailUrl = null
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
        })
        .catch(error => {
          this.errors = this.displayErrors(error)
        })
    },
    async excluirArquivo() {
      this.$emit('deletePhoto')
    },
    async ocultarArquivo() {
      this.ativo = !this.ativo
      if (this.photoId) {
        await fotoService.alterar({ id: this.photoId, ativo: this.ativo })
        this.carregarArquivo(this.photoId)
      }
    },
    async carregarArquivo(val) {
      val &&
        await fotoService.getId(val).then(res => {
          this.ativo = res.data.ativo
          this.thumbnailUrl = res.data.thumbnail
          this.photoUrl = res.data.foto
        })
    }
  }
}
</script>

<style scoped>
.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
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
