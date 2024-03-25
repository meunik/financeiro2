<template>
  <div>
    <v-card class="mx-auto mt-5">
      <v-card-text>
        <p class="text-h5 text--primary">Certificado de autenticação</p>
        <div class="my-3" v-if="certificadoExiste"><v-icon small left color="green">mdi-check-circle</v-icon>Gerado</div>
        <div class="my-3" v-else><v-icon small left color="red">mdi-close-circle</v-icon>Não Gerado</div>
        <div class="text--primary">
          Para poder usar a API do Nubank, é necessário gerar um certificado de autenticação. Para isso, clique no botão abaixo e siga as instruções.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="warning accent-4" :loading="loading" @click="revealCodigo = true">Gerar Certificado</v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card v-if="revealCodigo" class="transition-fast-in-fast-out v-card--reveal h-100 d-flex flex-column justify-content-between">
          <v-card-text class="pb-0">
            <p class="text-h5 text--primary">Tem certeza que deseja gerar o certificado?</p>
            <p>Para gerar o certificado será necessário armazenar infromações sensível como <b class="blue-grey--text">cpf</b> e <b class="blue-grey--text">senha</b>.<br>Este sistema não possue servidor, portanto essas informações estarão salvas somente em sua máquina.</p>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn text color="red accent-4" :loading="loading" @click="revealCodigo = false">Não</v-btn>
            <v-btn text color="teal accent-4" :loading="loading" @click="dialogCpfSenha = true">Sim</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
    
    <div v-if="certificadoExiste">
      <v-divider class="mt-5"></v-divider>
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

      <Opcoes
        titulo="Faturas completas"
        sub-titulo="Faturas completas encontradas"
        texto-certeza="Tem certeza que deseja buscar todas as suas faturas completas?"
        :count="countFaturasCompl"
        :listar="listarFaturasCompletas"
        :salvar="salvarFaturasCompletas"
      />
      
      <v-divider class="mt-5"></v-divider>
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

      <Opcoes
        titulo="Gastos no cartão de crédigo"
        sub-titulo="Gastos encontrados"
        texto-certeza="Tem certeza que deseja buscar todos os gastos no seu cartão de crédigo?"
        :count="countGastos"
        :listar="listarGastosCartao"
        :salvar="listarGastosCartao"
      />
      
      <v-divider class="mt-5"></v-divider>
      <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

      <Opcoes
        titulo="Faturas resumidas"
        sub-titulo="Faturas encontrados"
        texto-certeza="Tem certeza que deseja buscar o resumo das suas faturas?"
        :count="countFaturas"
        :listar="listarfaturasCartao"
        :salvar="salvarFaturasCartao"
      />

      <!-- <Opcoes
        titulo="Transações"
        sub-titulo="Transações encontradas"
        texto-certeza="Tem certeza que deseja buscar todas as suas transações?"
        :count="countTransacoes"
        :listar="listarTransacoes"
        :salvar="salvarTransacoes"
      /> -->
    </div>


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
  </div>
</template>

<script>
import { Model } from "@/store/Model"
import Icone from '@/assets/icones/Icone.vue'
import Pastas from '@/views/components/layout/Pastas.vue'
import Opcoes from '@/views/components/Configuracos/Opcoes.vue'

export default {
  mixins: [Model],
  components: {
    Icone,
    Pastas,
    Opcoes,
  },
  data() {
    return {
      revealCodigo: false,
      revealFaturas: false,
      revealFaturasCompletas: false,
      dialogCpfSenha: false,
      drawer: false,

      certificadoExiste: false,
      countGastos: 0,
      countFaturas: 0,

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
    window.api.on('exibeCertificadoExiste', (existe) => this.certificadoExiste = existe);
    window.api.on('exibeCountGastos', (valor) => this.countGastos = valor);
    window.api.on('exibeCountFaturas', (valor) => this.countFaturas = valor);
    
    window.api.send('varificarCertificadoExiste');
    window.api.send('buscarCountGastos');
    window.api.send('buscarCountFaturas');
  },
  computed: {
    iconColor() { return this.$vuetify.theme.dark ? '#FFFFFF' : '#820AD1' },
    isActive() { return this.codigo.length === this.codLength },
    countFaturasCompl() { return this.faturasCompletas.length },
  },
  methods: {
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
      console.log(this.faturasCartao);
      // console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
      // console.log(JSON.parse(JSON.stringify(this.faturasCartao)));
    },
    salvarFaturasCompletas() {
      this.loading = true;
      window.api.send('salvarFaturasCompletas');
    },
    listarFaturasCompletas() {
      // console.log(this.faturasCompletas);
      // console.log(JSON.parse(JSON.stringify(this.gastosCartao)));
      // console.log(JSON.parse(JSON.stringify(this.faturasCartao)));
      console.log(JSON.parse(JSON.stringify(this.faturasCompletas)));
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

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
  