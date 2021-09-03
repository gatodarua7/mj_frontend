import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import VueTheMask from 'vue-the-mask'
import HttpGeneric from '@/services/generic.service'
import generic from './mixins/generic';
import endpoints from '@/shared/endpoints'

Vue.config.productionTip = false

Vue.use(VueTheMask)

Vue.prototype.$endpoints = endpoints

// Adiciona classe genérica de api globalmente
Vue.$api = HttpGeneric
Object.defineProperty(Vue.prototype, '$api', {
  get () { return HttpGeneric }
})

Vue.component('BarraSuperior', () => import('@/layout/BarraSuperior.vue'))
Vue.mixin(generic)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
