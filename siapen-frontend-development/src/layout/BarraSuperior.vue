<template>
  <v-toolbar
    class="grey lighten-4"
    flat
  >
    <v-toolbar-title>{{ titulo }}</v-toolbar-title>
    <v-subheader class="mt-1">
      {{ subtitulo }}
    </v-subheader>
    <v-spacer />
    <v-breadcrumbs :items="breadcrumbs" />
  </v-toolbar>
</template>

<script>

export default {
  name: 'BarraSuperior',
  props: {
    titulo: String,
    subtitulo: String,
    breadcrumbs: Array
  }
}
</script>
