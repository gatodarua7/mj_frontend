<template>
  <v-navigation-drawer
    v-model="menu.exibe"
    :clipped="true"
    app
    overflow
  >
    <v-list-item class="hidden-lg-and-up">
      <v-list-item-content>
        <v-list-item-title class="text-center">
          <v-avatar
            color="primary white--text"
            size="64"
            class="mb-3"
          >
            {{ user.login.charAt(0) }}
          </v-avatar><br>
          <span>{{ user.login }}</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list dense>
      <v-subheader>{{ $t("menu.gest_prisional") }}</v-subheader>
      <v-list-item-group>
        <v-list-group prepend-icon="folder_shared">
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.pessoas.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.pessoas.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="assignment_ind">
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.cadastro_visitante.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.cadastro_visitante.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-list-group
          prepend-icon="sync_alt"
        >
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.pedido_inclusao.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.pedido_inclusao.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-list-group
          prepend-icon="mdi-car-emergency"
        >
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.escolta.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.escolta.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-subheader class="mt-5">
          {{
            $t("menu.base_conhecimento")
          }}
        </v-subheader>

        <v-list-group prepend-icon="mdi-owl">
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.inteligencia.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.inteligencia.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-subheader class="mt-5">
          {{
            $t("menu.base_corporativa")
          }}
        </v-subheader>

        <v-list-group prepend-icon="mdi-police-badge">
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.prisional.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.prisional.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-subheader>{{ $t("menu.params") }}</v-subheader>
        <v-list-group prepend-icon="mdi-cog">
          <template v-slot:activator>
            <v-list-item-title>
              {{
                $t("menu.auxiliares.titulo")
              }}
            </v-list-item-title>
          </template>

          <v-list-item
            v-for="(item, i) in $t('menu.auxiliares.items')"
            :key="i"
            link
            @click="destino(item.link)"
          >
            <v-list-item-title v-text="item.label" />
          </v-list-item>
        </v-list-group>

        <v-subheader>{{ $t("menu.system") }}</v-subheader>

        <v-list-item
          @click="destino('/auditoria')"
        >
          <v-list-item-icon>
            <v-icon>history</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Auditoria</v-list-item-title>
        </v-list-item>

        <v-list-item
          :href="swaggerUrl"
          target="_blank"
        >
          <v-list-item-icon>
            <v-icon>mdi-file</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Documentação</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="hidden-lg-and-up">
        <v-divider />
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>apps</v-icon>
            </v-list-item-icon>

            <v-list-item-title
              @click="logout"
            >
              Sair
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { clearToken, getUser } from '@/services/auth.service'

export default {
  props: ['menu'],
  data: () => ({
    swaggerUrl: `${process.env.VUE_APP_ROOT_API}doc/`,
    items: []
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
    destino(link) {
      this.$router.push(link)
    }
  }
}
</script>
