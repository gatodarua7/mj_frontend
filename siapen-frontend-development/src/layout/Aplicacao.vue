<template>
  <v-app>
    <loader />
    <snack-bar />
    <menu-esquerdo :menu="menuLateral" />
    <cabecalho :menu="menuLateral" />
    <router-view />
    <rodape />
  </v-app>
</template>

<script>
import Loader from '@/components/Loader.vue'
import Cabecalho from './Cabecalho'
import MenuEsquerdo from './MenuEsquerdo'
import Rodape from './Rodape'
import SnackBar from './SnackBar'

export default {
  components: { Cabecalho, MenuEsquerdo, Rodape, SnackBar, Loader },
  data: () => ({
    menuLateral: {
      exibe: true
    }
  })
}
</script>