<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        Hierarquia
      </v-card-title>
      <v-card-text v-show="!!tree">
        <v-treeview
          v-if="loaded"
          item-key="key"
          :items="tree"
          open-all
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TreeDlg',
  data() {
    return {
      loaded: false,
      dialog: false,
      resolve: null,
      reject: null,
      tree: null,
      title: null,
      options: {
        color: 'grey lighten-3',
        width: 400,
        zIndex: 200,
        noconfirm: false
      }
    }
  },
  watch: {
    dialog(){
      this.loaded = false
    },
    tree(val) {
      val && (this.loaded = true)
    }
  },
  methods: {
    open(tree, options) {
      this.dialog = true
      this.tree = tree
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
