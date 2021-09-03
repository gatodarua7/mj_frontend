export default {
  namespaced: true,
  state: {
    loading: false
  },
  getters: {
    getLoading(state) {
      return state.loading
    }
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading
    }
  }
}
