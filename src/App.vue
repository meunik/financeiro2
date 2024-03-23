<template>
  <v-app>
    <TitleBar @abrirMenu="menu()"/>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
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
  methods: {
    menu() { this.$refs.navegacao.drawer = true }
  }
};
</script>
