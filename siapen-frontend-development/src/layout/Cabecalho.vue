<template>
  <v-app-bar
    :clipped-left="true"
    color="blue darken-3"
    dark
    app
    fixed
    flat
  >
    <v-toolbar-title class="d-none d-sm-flex">
      SIAPEN
    </v-toolbar-title>

    <v-app-bar-nav-icon
      @click.stop="menu.exibe = !menu.exibe"
    />

    <v-spacer />

    <template>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              large
              class="d-none d-sm-flex"
              v-bind="attrs"
              v-on="on"
            >
              <v-avatar
                color="white primary--text"
                size="36"
                class="mr-3"
              >
                {{ user.login.charAt(0) }}
              </v-avatar>
              <span>{{ user.login }}</span>
              <v-icon class="mr-0">
                arrow_drop_down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout()">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>
</template>

<script>
import i18n from '@/plugins/i18n'
import { clearToken, getUser } from '@/services/auth.service'

export default {
  props: {
    menu: Object
  },
  data: () => ({
    flagSelecionada: 'br',
    languages: [
      { flag: 'br', language: 'pt', title: 'Português' },
      { flag: 'es', language: 'es', title: 'Español' },
      { flag: 'gb', language: 'en', title: 'English' }
    ]
  }),
  computed: {
    user() {
      return getUser()
    }
  },
  methods: {
    logout() {
      clearToken()
      this.$router.push('/login')
    },
    changeLocale(locale) {
      i18n.locale = locale.language
      this.flagSelecionada = locale.flag
    },
    exibeMenu() {
      this.menu.exibe = !this.menu.exibe
    }
  }
}
</script>
