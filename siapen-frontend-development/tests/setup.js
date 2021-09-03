import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import generic from '@/mixins/generic'
import HttpGeneric from '@/services/generic.service'
import endpoints from '@/shared/endpoints'

Vue.use(Vuetify)
Vue.use(VueI18n)
Vue.use(VueRouter)
Vue.component('BarraSuperior', () => import('@/layout/BarraSuperior.vue'))
Vue.mixin(generic)
Vue.prototype.$endpoints = endpoints

// Adiciona classe genérica de api globalmente
Vue.$api = HttpGeneric
Object.defineProperty(Vue.prototype, '$api', {
  get () { return HttpGeneric }
})