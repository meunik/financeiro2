<template>
  <v-app>
    <TitleBar @abrirMenu="menu()"/>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
      <v-footer padless :color="systemBg">
        <v-col class="text-center" cols="12" style="height: 100px;">
        </v-col>
      </v-footer>
    </v-main>

    <Navegacao ref="navegacao"/>

    <v-snackbar
      v-for="(item, i) in notificacoes"
      :key="i"
      v-model="item.show"
      :color="item.color"
      :timeout="2000000"
      :style="`bottom: ${i * 60}px`"
      right
      shaped
    >
      {{ item.text }}
      <template v-slot:action="{ attrs }">
        <v-btn icon text v-bind="attrs" @click="removeNotificacao(item.id)">
          <v-icon class="mx-0">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { Model } from "@/store/Model"
import Navegacao from "@/views/components/layout/Navegacao.vue"
import TitleBar from "@/views/components/layout/TitleBar.vue"

export default {
  mixins: [Model],
  components: {
    Navegacao,
    TitleBar,
  },
  created() {
    window.api.on('loadingOn', () => this.loading = true);
    window.api.on('loadingOff', () => this.loading = false);
    window.api.on('notificacao', (msg, cor, tempo) => this.notificacao(msg, cor, tempo));
  },
  computed: {
    systemBg() { return this.$vuetify.theme.dark ? '#12121200' : '#ffffff00' }
  },
  methods: {
    menu() { this.$refs.navegacao.drawer = true }
  }
};
</script>
