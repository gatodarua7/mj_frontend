export default {
  namespaced: true,
  state: {
    snackbars: []
  },
  mutations: {
    SET_SNACKBAR(state, snackbar) {
      const existe = state.snackbars.find(
        u => u.text == snackbar.text && u.showing
      )
      if (!existe) {
        state.snackbars = state.snackbars.concat(snackbar)
      }
    }
  },
  actions: {
    setSnackbar({ commit }, snackbar) {
      snackbar.showing = true
      snackbar.color = snackbar.color || 'success'
      commit('SET_SNACKBAR', snackbar)
    }
  }
}
