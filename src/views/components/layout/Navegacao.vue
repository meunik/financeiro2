<template>
  <v-navigation-drawer v-model="drawer" absolute temporary class="noDrag" app>
    <v-list-item>
      <v-list-item-content>
        <!-- <v-list-item-title>Projeto</v-list-item-title> -->
        
        <Pastas />
      </v-list-item-content>

      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-group>
        
        <template v-slot:activator>
          <v-list-item-icon class="mr-2">
            <Icone icone="Nubank" :cor="iconColor"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>NuBank</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list nav dense class="pt-0">
          <v-list-item @click="dialogCpfSenha = true">
            <v-icon left>mdi-file-certificate-outline</v-icon>
            Gerar Certificado
          </v-list-item>
          <v-list-item @click="dialogCpfSenha = true">
            <v-icon left>mdi-invoice-list-outline</v-icon>
            busca fatura
          </v-list-item>
          <v-list-item @click="dialogCpfSenha = true">
            <v-icon left>mdi-format-list-bulleted-square</v-icon>
            listarGastosCartao
          </v-list-item>
        </v-list>

      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { Model } from "@/store/Model"
import Icone from '@/assets/icones/Icone.vue'
import Pastas from '@/views/components/layout/Pastas.vue'

export default {
  mixins: [Model],
  components: {
    Icone,
    Pastas,
  },
  data() {
    return {
      dialogCpfSenha: false,
      drawer: false,
    }
  },
  created() {
    window.api.on('drawerOff', () => this.drawer = false);
  },
  computed: {
    iconColor() { return this.$vuetify.theme.dark ? '#FFFFFF' : '#820AD1' },
  },
};
</script>
  