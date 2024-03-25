<template>
  <v-system-bar
    window
    :app="true"
    class="transparente drag"
    :style="`background-color: ${systemBarBg} !important;`"
  >
    <v-btn icon small color="secondary" class="noDrag btnBarr mx-1 mr-3" @click.stop="abrirMenu()">
      <v-icon small class="mx-0 iconBarr" :color="iconColor">mdi-menu</v-icon>
    </v-btn>
    
    <router-link to="/" class="noDrag d-flex align-content-center">
      <img src="logo.png" height="25" class="mr-3" alt="logo" @click.stop="home()">
    </router-link>
    
    <v-switch class="noDrag mt-5" v-model="$vuetify.theme.dark"></v-switch>
    <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
    <v-icon v-else>mdi-white-balance-sunny</v-icon>
    
    <v-btn class="noDrag ml-3 px-0" icon x-small @click="voltar"><v-icon small>mdi-chevron-left</v-icon></v-btn>
    <v-btn class="noDrag px-0" icon x-small @click="avancar"><v-icon small>mdi-chevron-right</v-icon></v-btn>
    <v-btn class="noDrag px-0" icon small @click="atualizarPagina"><v-icon>mdi-refresh</v-icon></v-btn>

    <div class="ml-2">
      <router-link to="/" class="noDrag text-decoration-none blue-grey--text">
        <span>Financeiro</span>
      </router-link>
      <span>{{ currentUrl }}</span>
    </div>
    
    <v-spacer></v-spacer>

    <v-btn icon small color="#2196f3" class="noDrag btnBarr mx-1" @click="minimizar">
      <v-icon small class="mx-0 iconBarr" :color="iconColor">mdi-minus</v-icon>
    </v-btn>

    <v-btn icon small color="#2196f3" class="noDrag btnBarr mx-1" @click="maximizar">
      <v-icon small class="mx-0 iconBarr" :color="iconColor">mdi-checkbox-blank-outline</v-icon>
    </v-btn>

    <v-btn icon small color="#D50000" class="noDrag btnBarr mx-1" @click="fechar">
      <v-icon small class="mx-0 iconBarr" :color="iconColor">mdi-close</v-icon>
    </v-btn>
  </v-system-bar>
</template>

<script>
import { Model } from "@/store/Model"

export default {
  mixins: [Model],
  created() {
    window.api.on('attPagina', () => this.atualizarPagina());
  },
  computed: {
    systemBarBg() { return this.$vuetify.theme.dark ? '#121212c9' : '#ffffff' },
    iconColor() { return this.$vuetify.theme.dark ? '#ffffffb3' : '#000000' },
    currentUrl() { return this.$route.path; }
  },
  methods: {
    voltar() { this.$router.go(-1) },
    avancar() { this.$router.go(1) },
    minimizar:() => window.api.send('minimizar'),
    fechar:() => window.api.send('fechar'),
    maximizar:() => window.api.send('maximizar'),
    atualizarPagina() { this.$nextTick(() => { location.reload() }) },
    abrirMenu() { this.$emit('abrirMenu') },
    home() { this.$router.push("/").catch(err => { this.$nextTick(() => { location.reload() }) }); },
  }
};
</script>
  