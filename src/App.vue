<template>
  <v-app>
    <v-system-bar window :app="true" class="transparente drag"
     :style="`background-color: ${systemBarBg} !important;`">
     <img src="logo.png" height="70%" class="mr-3" alt="logo">
      <!-- <v-icon>mdi-message</v-icon>
      <span>10 unread messages</span> -->
      <v-switch class="noDrag mt-5" v-model="$vuetify.theme.dark" label="Dark Mode"></v-switch>
      <v-btn class="noDrag ml-3 px-0" icon small @click="atualizarPagina"><v-icon>mdi-refresh</v-icon></v-btn>
      
      <v-spacer></v-spacer>

      <v-btn icon small color="#2196f3" class="noDrag btnBarr mx-1" @click="minimizar">
        <v-icon small class="mx-0 grey--text">mdi-minus</v-icon>
      </v-btn>

      <v-btn icon small color="#2196f3" class="noDrag btnBarr mx-1" @click="maximizar">
        <v-icon small class="mx-0 grey--text">mdi-checkbox-blank-outline</v-icon>
      </v-btn>

      <v-btn icon small color="#D50000" class="noDrag btnBarr mx-1" @click="fechar">
        <v-icon small class="mx-0 grey--text">mdi-close</v-icon>
      </v-btn>
    </v-system-bar>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>

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

export default {
  mixins: [Model],
  created() {
    window.api.on('attPagina', () => this.atualizarPagina());
    window.api.on('notificacao', (msg, cor, tempo) => this.notificacao(msg, cor, tempo));
  },
  computed: {
    systemBarBg() { return this.$vuetify.theme.dark ? '#121212c9' : '#ffffff' }
  },
  methods: {
    minimizar:() => window.api.send('minimizar'),
    fechar:() => window.api.send('fechar'),
    maximizar:() => window.api.send('maximizar'),
    atualizarPagina() { this.$nextTick(() => { location.reload() }) }
  }
};
</script>
