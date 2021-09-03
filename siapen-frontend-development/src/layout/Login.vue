<template>
  <v-app>
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>SIAPEN - Acesso</v-toolbar-title>
                <div class="flex-grow-1" />
                F: {{ frontVersion }} / B: {{ backVersion }}
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                  @submit.prevent="login"
                >
                  <v-alert
                    v-if="!!errors.detail"
                    type="error"
                  >
                    <v-row align="center">
                      <v-col class="grow">
                        {{ errors.detail }}
                      </v-col>
                    </v-row>
                  </v-alert>
                  <v-text-field
                    v-model="data.username"
                    label="Usuário"
                    prepend-icon="person"
                    :error-messages="errors.username"
                    class="mt-4"
                  />
                  <v-text-field
                    v-model="data.password"
                    label="Senha"
                    prepend-icon="lock"
                    :error-messages="errors.password"
                    :append-icon="
                      !showPassword ? 'visibility' : 'visibility_off'
                    "
                    :type="!showPassword ? 'password' : 'text'"
                    @keydown.enter="login"
                    @click:append="() => (showPassword = !showPassword)"
                  />
                  <div class="d-flex justify-end mt-4">
                    <v-btn
                      color="primary white--text"
                      type="submit"
                      :loading="logging"
                      :disabled="logging"
                    >
                      Login
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { handleLogin, setToken, setBackVersion, getBackVersion } from '@/services/auth.service'

export default {
  data: () => ({
    valid: false,
    data: {},
    errors: {},
    showPassword: false,
    logging: false,
  }),
  computed: {
    loading() {
      return this.$store.getters['loading/getLoading']
    },
    frontVersion() {
      return process.env.VUE_APP_VERSION
    },
    backVersion() {
      return getBackVersion()
    }
  },
  beforeMount() {
    setBackVersion()
  },
  methods: {
    login() {
      this.logging = true
      handleLogin(this.data)
        .then(res => {
          setToken(res)
          this.logging = false
        })
        .catch(err => {
          this.errors = err.response.data
          this.logging = false
        })
    }
  }
}
</script>