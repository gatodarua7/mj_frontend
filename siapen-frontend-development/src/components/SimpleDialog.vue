<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <v-card>
      <v-card-text
        v-show="!!message"
        class="pt-5"
      >
        {{ message }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SimpleDlg',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      options: {
        color: 'grey lighten-3',
        width: 400,
        zIndex: 200,
        noconfirm: false
      }
    }
  },

  methods: {
    open(message, options) {
      this.dialog = true
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
