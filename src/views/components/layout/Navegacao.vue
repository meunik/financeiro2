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
            <!-- <v-icon>mdi-cog</v-icon> -->
            <v-icon>mdi-wrench-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Bancos</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list nav dense class="pt-0 f-13">
          <v-list-item @click="link('configNubank')">
            <Icone icone="Nubank" :cor="iconColor" class="mr-2"/>NuBank
          </v-list-item>
        </v-list>

      </v-list-group>

      <!-- <v-list-group>
        
        <template v-slot:activator>
          <v-list-item-icon class="mr-2">
            <Icone icone="Nubank" :cor="iconColor"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>NuBank</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list nav dense class="pt-0 f-13">
          <v-list-item @click="dialogCpfSenha = true">
            <v-icon left>mdi-file-certificate-outline</v-icon>
            Gerar Certificado
          </v-list-item>
          <v-list-item @click="salvarGastosCartao()">
            <v-icon left>mdi-invoice-list-outline</v-icon>
            busca fatura
          </v-list-item>
          <v-list-item @click="listarGastosCartao()">
            <v-icon left>mdi-format-list-bulleted-square</v-icon>
            listarGastosCartao
          </v-list-item>
          <v-list-item @click="salvarFaturasCartao()">
            <v-icon left>mdi-format-list-bulleted-square</v-icon>
            salvarFaturasCartao
          </v-list-item>
          <v-list-item @click="listarfaturasCartao()">
            <v-icon left>mdi-format-list-bulleted-square</v-icon>
            listarfaturasCartao
          </v-list-item>
        </v-list>

      </v-list-group> -->
    </v-list>

    <v-dialog v-model="dialogCpfSenha" persistent max-width="300px">
      <v-card>
        <v-card-title class="text-h5">
          Gerar Certificado
        </v-card-title>
        <v-card-text>
          
          <v-text-field
            label="Digite seu CPF"
            v-model="cpf"
            hint="Somente os números"
            type="number"
          ></v-text-field>
          <v-text-field
            v-model="senha"
            :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
            :type="mostrarSenha ? 'text' : 'password'"
            label="Senha"
            counter
            @click:append="mostrarSenha = !mostrarSenha"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogCpfSenha = false">Fechar</v-btn>
          <v-btn color="green darken-1" text :disabled="(cpf && senha)?false:true" @click="scriptCertificado()">enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCodigo" persistent max-width="350px">
      <v-card>
        <v-card-title class="text-h5">Código de acesso</v-card-title>
        <v-card-text>
          <v-subheader v-if="codigoEmail" class="px-0 flex-wrap">
            <span class="white-space-nowrap">Enviado para:</span>
            <span class="ml-1 primary--text">{{ codigoEmail }}</span>
          </v-subheader>
          <v-subheader v-else class="px-0">
            <span class="white-space-nowrap">Enviado email</span>
            <v-progress-linear class="ml-2" color="primary" indeterminate rounded height="6"></v-progress-linear>
          </v-subheader>
          <v-subheader class="px-0 mb-2">Digite o código recebido por e-mail:</v-subheader>
          <v-otp-input v-model="codigo" :length="codLength" dark></v-otp-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancelScriptCodigo()">Fechar</v-btn>
          <v-btn color="green darken-1" text :disabled="!isActive" @click="scriptCertificadoCodigo()">enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

      dialogCpfSenha: false,
      cpf: '',
      senha: '',
      mostrarSenha: false,
      dialogCodigo: false,
      codigoEmail: null,
      codigo: '',
      codLength: 6,
    }
  },
  created() {
    window.api.on('dialogCodigo', (email, abredialogCodigo) => {
      if (abredialogCodigo) {
        this.codigoEmail = (email.length > 2) ? email : null;
        this.dialogCodigo = true;
      } else this.cancelScriptCodigo();
    });
    window.api.on('drawerOff', () => this.drawer = false);
  },
  computed: {
    iconColor() { return this.$vuetify.theme.dark ? '#FFFFFF' : '#820AD1' },
    isActive() { return this.codigo.length === this.codLength },
  },
  methods: {
    link(goTo) { this.$router.push(goTo).catch(err => {}); },

    salvarGastosCartao() {
      // this.loading = true;
      // window.api.send('salvarGastosCartao');
    },
    listarGastosCartao() {
      console.log(this.gastosCartao);
      // console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
    },
    salvarFaturasCartao() {
      // this.loading = true;
      // window.api.send('salvarFaturasCartao');
    },
    listarfaturasCartao() {
      // console.log(this.faturasCartao);
      console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
      console.log(JSON.parse(JSON.stringify(this.faturasCartao)));
    },

    scriptCertificado() {
      this.dialogCpfSenha = false;
      this.dialogCodigo = true;
      this.loading = true;
      window.api.send('certificadoNubank', { cpf: this.cpf, senha: this.senha });
    },
    cancelScriptCodigo() {
      this.loading = false;
      this.dialogCodigo = false;
      this.cpf = '';
      this.senha = '';
      this.codigoEmail = '';
    },
    scriptCertificadoCodigo() {
      this.loading = true;
      this.dialogCodigo = false;
      window.api.send('certificadoNubankCodigo', this.codigo);
    },
  }
};
</script>
  