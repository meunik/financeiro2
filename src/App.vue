<template>
  <v-app>
    <v-system-bar window :app="true" class="transparente" style="-webkit-app-region: drag">
      <!-- <v-icon>mdi-message</v-icon>
      <span>10 unread messages</span> -->
      <v-switch style="-webkit-app-region: no-drag" v-model="$vuetify.theme.dark" label="Dark Mode"></v-switch>
      <v-spacer></v-spacer>
      <v-icon @click="minimizar" style="-webkit-app-region: no-drag">mdi-minus</v-icon>
      <v-icon @click="maximizar" style="-webkit-app-region: no-drag">mdi-checkbox-blank-outline</v-icon>
      <v-icon @click="fechar" style="-webkit-app-region: no-drag">mdi-close</v-icon>
    </v-system-bar>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  methods: {
    minimizar() { window.api.send('minimizar') },
    fechar() { window.api.send('fechar') },
    maximizar() { window.api.send('maximizar') },
  }
};
</script>
