import Vue from 'vue'
import Vuex from 'vuex'
import snackbar from './modules/snackbar'
import loading from './modules/loading'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  modules: {
    snackbar,
    loading
  },
  getters: {},
  mutations: {}
})
